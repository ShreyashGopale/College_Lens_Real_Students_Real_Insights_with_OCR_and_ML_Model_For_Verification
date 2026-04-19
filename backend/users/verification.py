import fitz
import easyocr
import re
import os
import tempfile
import datetime
from difflib import SequenceMatcher

# Reader singleton
_reader = None

DEGREE_MAP = {
    "MBA": ["MASTERS", "BUSINESS", "ADMINISTRATION"],
    "BCA": ["BACHELORS", "COMPUTER", "APPLICATION"],
    "MCA": ["MASTERS", "COMPUTER", "APPLICATION"],
    "BE": ["BACHELORS", "ENGINEERING"],
    "BTECH": ["BACHELORS", "TECHNOLOGY"],
    "MTECH": ["MASTERS", "TECHNOLOGY"],
}

# Generic words to ignore in matching branch/degree
IGNORE_WORDS = {"ENGINEERING", "TECHNOLOGY", "DEPARTMENT", "BRANCH", "DEGREE", "COURSE", "OF", "THE", "AND", "FOR"}

def get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['en'], gpu=False, verbose=False)
    return _reader

def has_both(word):
    """Check if a word contains both letters and numbers (indicative of a code)."""
    return any(c.isdigit() for c in word) and any(c.isalpha() for c in word)

def clean_ocr_text(text):
    """
    Cleans OCR text by:
    1. Removing bracketed content [e.g. university codes].
    2. Removing mixed alphanumeric codes (e.g. CEGN017720).
    3. Removing long standalone numbers (pins, years, etc).
    """
    if not text: return ""
    # 1. Remove bracketed content
    text = re.sub(r'\[.*?\]', ' ', text)
    # 2. Split and filter words
    words = text.split()
    cleaned_words = []
    for w in words:
        # Remove words that are codes (mix of letters and numbers)
        if has_both(w): continue
        # Remove long standalone numbers (likely years, pins, or IDs)
        if w.isdigit() and len(w) >= 5: continue
        cleaned_words.append(w)
    
    res = " ".join(cleaned_words)
    # 3. Final cleanup of punctuation and whitespace
    res = re.sub(r'\s+', ' ', res).strip()
    return res.upper()

def convert_pdf_to_images(pdf_stream):
    images = []
    # pdf_stream is a Django TemporaryUploadedFile or InMemoryUploadedFile stream
    doc = fitz.open(stream=pdf_stream.read(), filetype="pdf")
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        zoom = 2.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        pix.save(tmp.name)
        images.append(tmp.name)
    # Rest to byte 0 for any downstream django commits
    pdf_stream.seek(0)
    return images

def extract_text_from_pdf(pdf_stream):
    try:
        # 1. Try direct text extraction first (for searchable PDFs)
        pdf_bytes = pdf_stream.read()
        pdf_stream.seek(0)
        
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        direct_text = []
        for page in doc:
            direct_text.append(page.get_text())
        
        full_text_direct = " ".join(direct_text).strip()
        
        # If we found substantial text, clean and return it
        if len(full_text_direct) > 50:
            return clean_ocr_text(full_text_direct)
            
        # 2. Fallback to OCR if direct extraction found nothing (for scanned images)
        images = convert_pdf_to_images(pdf_stream)
        reader = get_reader()
        full_text_ocr = []
        for img_path in images:
            extracted = reader.readtext(img_path, detail=0)
            full_text_ocr.extend(extracted)
            os.remove(img_path)  # Cleanup temp images instantly
            
        return clean_ocr_text(" ".join(full_text_ocr))
    except Exception as e:
        return ""

def fuzzy_match(target, ocr_text, threshold=0.90):
    """
    Checks if the target string appears as a continuous sequence of words
    within the cleaned OCR text, allowing for minor spelling variations (e.g. V vs W).
    """
    if not target or not ocr_text: return False
    
    # Normalize strings: Uppercase, remove all punctuation, collapse whitespace
    def normalize_for_proximity(text):
        if not text: return ""
        # Replace non-alphanumeric with space
        res = re.sub(r'[^\w\s]', ' ', text.upper())
        # Collapse multiple spaces into one
        return " ".join(res.split())

    target_norm = normalize_for_proximity(target)
    ocr_norm = normalize_for_proximity(ocr_text)
    
    if not target_norm: return False
    
    # 1. Exact continuous match (Fast)
    if target_norm in ocr_norm:
        return True
        
    # 2. Fuzzy continuous match (handles V vs W or minor OCR typos)
    # We check windows of text in ocr_norm similar to target_norm length
    target_len = len(target_norm)
    ocr_words = ocr_norm.split()
    
    for i in range(len(ocr_words)):
        for j in range(i + 1, len(ocr_words) + 1):
            window = " ".join(ocr_words[i:j])
            # If window is much longer than target, stop this inner loop
            if len(window) > target_len + 15: 
                break
            # Only check windows of similar length
            if abs(len(window) - target_len) <= 15:
                if SequenceMatcher(None, target_norm, window).ratio() >= threshold:
                    return True
        
    return False

def academic_match(target, ocr_text):
    """
    Smart match for degrees and branches.
    Handles acronyms (BCA -> Bachelors of Computer Application) 
    and ignores generic words (Engineering, Technology).
    """
    if not target or not ocr_text: return False
    
    # Helper to clean text specifically for academic comparison
    def clean_academic(text):
        if not text: return ""
        text = text.replace('.', '') # B.E. -> BE
        res = re.sub(r'[^\w\s]', ' ', text.upper())
        return " ".join(res.split())

    target_clean = clean_academic(target)
    ocr_clean = clean_academic(ocr_text)
    
    # Original words to match (ignoring generics/conjunctions)
    target_words = [w for w in target_clean.split() if w not in IGNORE_WORDS]
    ocr_words = set(ocr_clean.split())
    
    if not target_words: return False
    
    matches = 0
    for tw in target_words:
        # 1. Direct match
        if tw in ocr_words:
            matches += 1
            continue
        
        # 2. Acronym -> Full Form match (User entered BCA, OCR has Bachelors...)
        if tw in DEGREE_MAP:
            full_form = DEGREE_MAP[tw]
            if all(f_word in ocr_words for f_word in full_form if f_word not in IGNORE_WORDS):
                matches += 1
                continue
        
        # 3. Full Form -> Acronym match (User entered Bachelors..., OCR has BE)
        matched_via_acronym = False
        for acronym, full_form in DEGREE_MAP.items():
            if tw in full_form and acronym in ocr_words:
                matched_via_acronym = True
                break
        if matched_via_acronym:
            matches += 1
            continue
            
    return matches == len(target_words)

def parse_date(date_str):
    # Try numerical formatting variants
    for fmt in ('%d/%m/%Y', '%d-%m-%Y', '%m/%Y', '%m-%Y'):
        try:
            return datetime.datetime.strptime(date_str, fmt)
        except ValueError:
            pass
    return None

def verify_student_documents(marksheet_stream, receipt_stream, form_data):
    """
    form_data expected keys: first_name, middle_name, last_name, college_name, degree_type, branch
    """
    
    student_full_name = f"{form_data.get('first_name','')} {form_data.get('middle_name','')} {form_data.get('last_name','')}".strip().upper()
    target_college = form_data.get('college_name', '').upper()
    target_branch = form_data.get('branch', '').upper()
    target_degree = form_data.get('degree_type', '').upper()

    marksheet_text = extract_text_from_pdf(marksheet_stream)
    receipt_text = extract_text_from_pdf(receipt_stream)
    
    verification_metrics = {
        "status": "Failed",
        "errors": [],
        "marksheet_text_raw_snippet": marksheet_text[:500] if marksheet_text else "None", 
        "receipt_text_raw_snippet": receipt_text[:500] if receipt_text else "None",
        "form_data_used": form_data
    }
    
    if not marksheet_text or not receipt_text:
        verification_metrics["errors"].append("Could not extract readable text from one or both PDF files.")
        return verification_metrics

    # 1. Name Match
    def name_exists(cleaned_text, full_name, threshold=0.90):
        """
        Checks if every component of the user's name exists as a word 
        in the cleaned OCR text, regardless of order.
        Allows for minor spelling variations (e.g. GOPALE vs GOPALER).
        """
        # Strip punctuation for name matching
        clean_full_name = re.sub(r'[^\w\s]', ' ', full_name.upper())
        clean_text = re.sub(r'[^\w\s]', ' ', cleaned_text.upper())
        
        user_parts = [p.strip() for p in clean_full_name.split() if p.strip()]
        if not user_parts: return False
        
        words_in_text = set(clean_text.split())
        
        for part in user_parts:
            # Direct word match
            if part in words_in_text:
                continue
            
            # Fuzzy word match (handles minor typos)
            found_fuzzy = False
            for ocr_w in words_in_text:
                if SequenceMatcher(None, part, ocr_w).ratio() >= threshold:
                    found_fuzzy = True
                    break
            
            if not found_fuzzy:
                return False
                
        return True
        
    if not name_exists(marksheet_text, student_full_name):
        verification_metrics["errors"].append(f"Student Name components '{student_full_name}' not found in Marksheet (checked for First, Middle, and Last name regardless of order).")
    if not name_exists(receipt_text, student_full_name):
        verification_metrics["errors"].append(f"Student Name components '{student_full_name}' not found in Fees Receipt (checked for First, Middle, and Last name regardless of order).")

    # 2. College Match
    if not fuzzy_match(target_college, marksheet_text):
        verification_metrics["errors"].append(f"College Name '{target_college}' missing from Marksheet.")
    if not fuzzy_match(target_college, receipt_text):
        verification_metrics["errors"].append(f"College Name '{target_college}' missing from Fees Receipt.")

    # 3. Branch / Course Match
    if not academic_match(target_branch, marksheet_text):
         verification_metrics["errors"].append(f"Degree/Branch ('{target_branch}') mismatch in Marksheet.")
    if not academic_match(target_branch, receipt_text):
         verification_metrics["errors"].append(f"Degree/Branch ('{target_branch}') mismatch in Fees Receipt.")
         
    # 4. Progression / Date bounds logic & Year Check natively matching Student logic 
    year_indicators = ['F.E', 'FIRST YEAR', '1ST YEAR', 'SEM 1', 'SEM 2', 'FY']
    advanced_indicators = ['S.E', 'T.E', 'B.E', 'SECOND YEAR', 'THIRD YEAR', 'FINAL YEAR', '2ND YEAR', '3RD YEAR']
    
    is_first_year = any(ind in marksheet_text.replace('.','') for ind in year_indicators)
    is_advanced_year = any(ind in marksheet_text.replace('.','') for ind in advanced_indicators)

    # Date Evaluation Phase
    if is_first_year:
        # Check date bound string explicitly containing seasonal markers 
        months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']
        if not any(m in marksheet_text for m in months):
            # Try capturing numerical dates recursively 
            date_matches = re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', marksheet_text)
            passed_date = False
            for dt_str in date_matches:
                dt = parse_date(dt_str)
                if dt and 1 <= dt.month <= 7:
                    passed_date = True
                    break
            if not passed_date:
                verification_metrics["errors"].append("Marksheet issue date does not fall within the specific First Year band (January to July).")
    elif is_advanced_year:
        # Soft pass: Advanced student logic drops calendar bound checks, strictly checks if Target Degree is securely attached.
        if target_degree.replace('.','') not in marksheet_text.replace('.',''):
             verification_metrics["errors"].append(f"Advanced year detected seamlessly but standard Degree Type '{target_degree}' missing from transcript headers.")
    else:
        # If OCR missed everything, issue warning soft-fail 
        verification_metrics["errors"].append("Could not determine academic year securely from Marksheet (F.E, S.E, T.E, Etc).")
    
    # System Conclusion Evaluate 
    if not verification_metrics["errors"]:
        verification_metrics["status"] = "Verified"
    
    return verification_metrics
