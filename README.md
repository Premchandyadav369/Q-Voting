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
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   - Add `VITE_API_BASE_URL` pointing to your deployed backend (e.g., `https://your-backend.herokuapp.com`).
5. **Deploy**: Click "Deploy".

### Phase 5: Deploy Backend (FastAPI)

1. **Recommended Platforms**: [Render](https://render.com), [Railway](https://railway.app), or [Koyeb](https://koyeb.com).
2. **Setup**:
   - Link your GitHub repo.
   - Set the root directory to `backend`.
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**:
   - Add `GEMINI_API_KEY` with your real-time Gemini 2.5 Flash API Key.

---
## 📄 Academic Disclaimer
*This project is an academic research prototype. It is not affiliated with the Election Commission of India (ECI). Candidate data used is for simulation purposes based on 2024 records.*

---
*Built with ❤️ by the Quantum Research Team*
