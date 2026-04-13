# College Lens

**College Lens** is a comprehensive full-stack application offering real insights from real students. It features automated OCR student verification and a live Machine Learning Predictor pipeline for college admissions (powered by a ~2.8 GB Random Forest model).

## 🚀 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ShreyashGopale/College_Lens_Real_Students_Real_Insights_with_OCR_and_ML_Model_For_Verification.git
cd College_Lens_Real_Students_Real_Insights_with_OCR_and_ML_Model_For_Verification
```

### 2. Machine Learning Model Setup (Critical Step)
Due to GitHub's file size limits, the large Machine Learning `.pkl` files and encoders are hosted externally on Google Drive. You **must** download them to run the prediction features!

1. Download the zipped Model files from the Google Drive link (provided securely by repository admins).
2. Extract the files.
3. Paste the following 3 files directly into the `backend/ml_model/` folder:
   - `random_forest_(ultra)_model.pkl` (~2.8 GB)
   - `label_encoders.pkl` (~40 KB)
   - `unique_colleges.csv` (~175 KB)

*Note: Your `backend/ml_model/` folder will have an empty `.gitkeep` file in it by default when you clone.*

### 3. Backend Setup (Django)
Open a new terminal window:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (On Windows)
pip install -r requirements.txt
python manage.py runserver
```
*The backend server will start at `http://127.0.0.1:8000/`. Note: First inference request will take ~30s while the 2.8 GB model is loaded into memory.*

### 4. Frontend Setup (React/Vite)
Open a new terminal window in the root directory:
```bash
npm i
npm run dev
```
*The frontend will boot up. Navigate to the localhost URL provided by Vite.*