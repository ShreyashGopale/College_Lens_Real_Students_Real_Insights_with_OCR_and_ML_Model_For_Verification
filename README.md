# College Lens - Real Students, Real Insights

**College Lens** is a comprehensive full-stack web application designed for college admissions counselling and reviews. It features automated OCR student verification and a live Machine Learning Predictor pipeline for predicting your admission chances based on JEE ranks (powered by a ~2.8 GB Random Forest model).

---

## 🛠️ Prerequisites & Installation

Before running the project from scratch, you must install the following core applications on your computer:

1. **Git**: To clone the repository.
   - Download & Install: [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. **Node.js (LTS version)**: Required to run the React/Vite Frontend.
   - Download & Install: [https://nodejs.org/](https://nodejs.org/)
3. **Python (3.9 to 3.12)**: Required to run the Django Backend and ML model. 
   - Download & Install: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - *Important (For Windows Users): When installing Python, ensure you check the box that says "Add Python to PATH" at the bottom of the installer window.*

---

## 🚀 Setup & Execution 

Follow these steps exactly to run the project without errors.

### Step 1: Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/ShreyashGopale/College_Lens_Real_Students_Real_Insights_with_OCR_and_ML_Model_For_Verification.git
cd College_Lens_Real_Students_Real_Insights_with_OCR_and_ML_Model_For_Verification
```

### Step 2: Download & Setup the ML Model (Critical)
Due to standard repository size limits, the heavy machine learning files are excluded from GitHub. You **must** download them manually.

1. Click this secure Google Drive link: **[Download ML Model Files Here](https://drive.google.com/drive/folders/1OVkWyVOtgjo2YlzLsq7ZXb-lzGmgyzp8?usp=drive_link)**
2. Download **all the files** inside this Drive folder. 
3. Go to your cloned project folder. Locate the following directory: `backend/ml_model/`
4. Move/Paste the downloaded files exactly into the `backend/ml_model/` folder. Your folder must now contain:
   - `random_forest_(ultra)_model.pkl`
   - `label_encoders.pkl`
   - `unique_colleges.csv`

### Step 3: Start the Backend (Django Server)
Open a terminal in the root directory of your project, then run the following commands sequentially:

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment to isolate dependencies
python -m venv venv

# Activate the virtual environment
# --> For Windows:
venv\Scripts\activate
# --> For Mac/Linux:
# source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Run the Django Server
python manage.py runserver
```
*(Keep this terminal open! The server will start at `http://127.0.0.1:8000/`. Note: The first time you request a college prediction on the website, it will take ~30 seconds as the 2.8 GB model loads into memory).*

### Step 4: Start the Frontend (React Setup)
Open a **new, separate terminal window** (do not close the backend one) in the root directory:

```bash
# Install all required Node packages
npm install

# Start the Vite development server
npm run dev
```

*(Click the Localhost link provided in the terminal, usually `http://localhost:5173/`, to open the College Lens application in your browser).*