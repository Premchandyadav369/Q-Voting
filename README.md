# 🗳️ Q-Voting: Quantum Secure Voting System

**Privacy-Preserving Quantum Voting Simulation for Andhra Pradesh Elections**

Q-Voting is a state-of-the-art voting simulation platform that leverages quantum cryptography principles to ensure voter anonymity, ballot integrity, and security against cyber threats.

---

## 🚀 How to Run the Application

Follow these steps to set up and run the application on your local machine.

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **VS Code** (recommended)

---

### Phase 1: Backend Setup (FastAPI)

1. **Open a Terminal** and navigate to the project directory.
2. **Go to the backend folder**:
   ```powershell
   cd backend
   ```
3. **Create a Virtual Environment**:
   ```powershell
   python -m venv venv
   ```
4. **Activate the Virtual Environment**:
   ```powershell
   venv\Scripts\activate
   ```
5. **Install Python Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```
6. **Start the Backend Server**:
   ```powershell
   python -m uvicorn main:app --reload
   ```
   *The backend will now be running at `http://localhost:8000`.*

---

### Phase 2: Frontend Setup (React + Vite)

1. **Open a NEW Terminal** window.
2. **Go to the frontend folder**:
   ```powershell
   cd frontend
   ```
3. **Install Node Dependencies**:
   ```powershell
   npm install
   ```
4. **Start the Development Server**:
   ```powershell
   npm run dev
   ```
   *The frontend will now be accessible at `http://localhost:5173`.*

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Quantum Key Distribution** | Secure key exchange using BB84 Protocol. |
| 🛡️ **Tamper Detection** | Instant detection of eavesdropping or interception. |
| 👤 **Total Anonymity** | No link between the voter and the vote cast. |
| 📊 **Real-Time Data** | Live election results and AI-powered insights. |
| 🏛️ **Dual Voting** | Cast both MLA and MP votes in a single session. |

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Premium Glassmorphism)
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite
- **AI**: Google Gemini API (for election insights)
- **Quantum**: Custom BB84 implementation & AES-256-GCM

---

## 📁 System Architecture
- `/backend`: FastAPI server, database models, and quantum logic.
- `/frontend`: React application with premium UI components.
- `/data`: Real 2024 AP election candidate and constituency data.

---

## 🌐 Deployment Guide

### Phase 3: Push to GitHub

1. **Initialize Git Repository**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Q-Voting System"
   ```
2. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com/new) and create a new repository.
3. **Push Code**:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/Q-Voting.git
   git branch -M main
   git push -u origin main
   ```

### Phase 4: Deploy Frontend to Vercel

1. **Sign in to Vercel**: Go to [Vercel](https://vercel.com).
2. **Import Project**: 
   - Click "Add New" -> "Project".
   - Select your GitHub repository.
3. **Configure Project**:
   - **Root Directory**: `frontend` (Vercel should autodetect this)
4. **Environment Variables**:
   - Add `VITE_API_BASE_URL` and point it to the URL of your deployed backend (from Phase 5).
5. **Deploy**: Click "Deploy". Vercel will automatically use the `vercel.json` file for the correct build settings.

### Phase 5: Deploy Backend (FastAPI) on Render

This project uses a `render.yaml` file to define the backend infrastructure as code. This means Render can automatically configure the deployment for you.

1. **Sign in to Render**: Go to [Render](https://render.com).
2. **Create a New Blueprint Service**:
   - Click "New +" -> "Blueprint".
   - Connect your GitHub repository.
   - Render will automatically detect and parse the `render.yaml` file. The `PYTHON_VERSION` is already set to `3.11` in the file.
3. **Approve the Service**:
   - Give your new service a name and click "Apply".
4. **Add Environment Variables**:
   - After the service is created, go to its "Environment" tab.
   - The `render.yaml` file includes a placeholder for `FRONTEND_URL`. You should update its value to the live URL of your deployed Vercel frontend (from Phase 4).
   - You also need to add a secret variable for your Gemini API key:
     - `GEMINI_API_KEY`: Your secret key for the Google Gemini API.
5. **Automatic Deployment**: Render will now build and deploy your backend.

---
## 📄 Academic Disclaimer
*This project is an academic research prototype. It is not affiliated with the Election Commission of India (ECI). Candidate data used is for simulation purposes based on 2024 records.*

---
*Built with ❤️ by the Quantum Research Team*
