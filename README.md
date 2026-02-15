# 🗳️ Q-Voting Ultra: Next-Gen Quantum Secure Voting System-Under Development


![Q-Voting Ultra Banner](https://img.shields.io/badge/Status-Ultra%20Verified-blueviolet?style=for-the-badge) ![Security](https://img.shields.io/badge/Security-Quantum%20Resistant-green?style=for-the-badge) ![Monitoring](https://img.shields.io/badge/Monitoring-Real%20Time-red?style=for-the-badge) ![Made By](https://img.shields.io/badge/Made%20By-V%20C%20Premchand%20Yadav-blue?style=for-the-badge&logo=linkedin)

**The World's First Real-Time, Quantum-Encrypted Digital Democracy Platform.**
*Privacy-Preserving. Tamper-Proof. Instantly Verifiable.*

---

## 🌟 Introduction

Q-Voting Ultra represents a paradigm shift in election technology. It moves beyond traditional electronic voting machines (EVMs) and standard blockchain voting by integrating **Quantum Key Distribution (QKD)** simulations and **Post-Quantum Cryptography (PQC)**. 

This system addresses the "Trilemma of E-Voting":
1.  **Security**: Resistant to future quantum computer attacks (Shor's Algorithm).
2.  **Anonymity**: Voters verify *that* they voted, without revealing *who* they voted for (Zero-Knowledge Proofs).
3.  **Transparency**: A public, immutable ledger that anyone can audit in real-time.

---

## 🚀 One-Click Local Launch

Run the entire platform (Backend + Frontend) with a single command:

### Prerequisites
- **Windows OS** (PowerShell)
- **Python 3.10+**
- **Node.js 18+**

### Startup
Open your terminal in the project root folder and run:

```powershell
.\run_project.ps1
```

This will automatically:
- Install all Python/Node dependencies.
- Boot the **FastAPI Backend** (Port 8000).
- Launch the **Vite Frontend** (Port 5173).
- Open the dashboard in your default browser.

---

## ⚡ Deep Feature Analysis

### 1. Quantum Security Operations Center (QSOC)
*The Heart of the System.*

The QSOC Dashboard provides a "God's Eye View" of the network's cryptographic health. Unlike traditional admin panels that just show server load, QSOC visualizes the physics of the security layer.
- **Entropy Metric**: Measures the randomness of the generated keys. True quantum randomness is unpredictable.
- **Photon Fidelity**: Simulates the quality of the quantum state transmission. Drops in fidelity indicate potential interference or tampering.
- **Decoherence Rate**: Tracks environmental noise affecting Qubits.
- **Eve Detection (BB84)**: The system actively hunts for eavesdroppers ("Eve"). If an interception is attempted, the quantum error rate spikes, and the system automatically discards the compromised key and generates a new one.

### 2. Live Immutable Ledger & Blockchain
*Trust through Transparency.*

Every vote is not just a database entry; it is a cryptographically sealed block.
- **Quantum Seals**: Votes are signed using quantum-resistant algorithms.
- **Chaining**: Each block contains the hash of the previous block, creating an unbreakable chain. Retroactive alteration is mathematically impossible without breaking the entire chain.
- **Real-Time Feed**: The "Live Ledger" component mimics a stock ticker, showing vote blocks being mined and added to the chain instantly.

### 3. Interactive Surge Map (Quantum Radar)
*Data Visualization at Scale.*

A real-time, vector-based map of Andhra Pradesh that reflects the pulse of democracy.
- **Heatwave Pulses**: When a batch of votes arrives from a district (e.g., Kuppam), that specific region pulses on the map.
- **Drill-Down Analytics**: Click on any district (like Guntur or Visakhapatnam) to see localized voting trends, protecting individual voter privacy while showing aggregate data.
- **Alliance Logic**: The system aims to simulate real-world political alliances (e.g., TDP+JSP+BJP) accurately in its data aggregation.

### 4. Zero-Knowledge Public Verification (ZK-SNARKs Simulation)
*Verify Without Revealing.*

This is the "Holy Grail" of voting privacy.
- **The Problem**: How do you prove you voted for Candidate X without telling the government you voted for Candidate X?
- **The Solution**: Q-Voting issues a cryptographic "Receipt ID". Users can enter this ID into the **Public Verification Portal**. The system uses a Zero-Knowledge Proof protocol to confirm: *"Yes, this vote exists in the ledger and counts towards the final tally"* — **without** ever displaying the candidate's name on the screen.

### 5. Advanced Attack Simulation Lab
*Stress-Testing the Future.*

A dedicated sandbox environment to demonstrate why this system is necessary.
- **Grover's Search Attack**: Simulates a quantum computer trying to invert the secure hash function. Watch as the system increases difficulty to counter it.
- **Man-in-the-Middle (Eve)**: A visualization of the BB84 Quantum Key Distribution protocol. See "Eve" try to intercept photons and how the system detects the disturbance instantly.

### 6. AI-Powered Insights (Gemini 2.5 Flash)
*Intelligence Layer.*

Integrated Google Gemini AI analyzes voting patterns in real-time to provide text-based summaries, predict surge trends, and explain complex cryptographic events to the user in plain English.

---

## ⚙️ Backend Architecture & Support Flow

The backend is engineered for high concurrency, quantum simulation, and real-time verifiable audits.

### Phase 1: Authentication & Quantum Session
1.  **User Login**: Voter logs in via `POST /api/auth/login`.
    -   *Logic*: System verifies credentials/ID.
2.  **Quantum Handshake (BB84)**:
    -   The `QuantumKeyManager` initiates a BB84 protocol simulation.
    -   **Alice (Server)** prepares qubits in random bases.
    -   **Bob (Voter Client)** measures them.
    -   **Eve (Attacker)** presence is checked by estimating the Error Rate (QBER).
3.  **Key Generation**: If QBER < 11%, a shared **Quantum Key** is generated and assigned to the session `VoterSession`.

### Phase 2: Secure Vote Transaction
1.  **Vote Casting**: User submits vote via `POST /api/voting/cast`.
2.  **Encryption Layer**:
    -   `VoteEncryption` module uses the session's **Quantum Key** to encrypt vote data.
    -   Algorithm: **AES-256-GCM** (Galois/Counter Mode) for authenticated encryption.
3.  **Anonymity Layer**:
    -   A unique `vote_hash` is generated using SHA-256(Vote + Salt).
    -   The system ensures **Unlinkability**: The database stores the vote, but the link to the voter ID is cryptographically severed.
4.  **Storage (WAL Mode)**:
    -   The encrypted vote is written to the SQLite database (enabled with Write-Ahead Logging for high-speed concurrent writes).
    -   The vote is appended to the **Immutable Ledger**.

### Phase 3: Verification & Auditing
1.  **Receipt Generation**: The user receives a `receipt_code` (e.g., `QV-A1B2-C3D4`).
2.  **Zero-Knowledge Proof (ZKP)**:
    -   User can query `GET /api/voting/verify/{receipt_code}`.
    -   The system proves the vote exists in the chain **without** decrypting it or revealing who cast it.

### Phase 4: Real-Time Analytics
1.  **Background Aggregation**:
    -   `voting_analytics.py` continuously aggregates encrypted votes by district.
2.  **AI Insights**:
    -   `gemini_client` analyzes the aggregated data stream to generate readable summaries ("TDP is surging in Guntur...").
3.  **Live Map**:
    -   The frontend polls `/api/realtime/district-map` to update the vector map colors instantly.

---

## 🌐 Deployment Guide (Vercel)

This project is configured as a Monorepo (Frontend + Backend). Follow these exact steps to deploy.

### Step 1: Prepare GitHub
1.  **Push Code**: Ensure your latest code is pushed to GitHub (we just fixed the `node_modules` issue).
2.  **Verify**: Go to your GitHub repo and check that `frontend/node_modules` folder is **NOT** present.

### Step 2: Vercel Dashboard Setup
1.  **Import Project**:
    -   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    -   Click **Add New** -> **Project**.
    -   Select `Q-Voting` from the list and clicking **Import**.

2.  **Configure Project**:
    *You will see a screen asking for build settings. ENTER THESE EXACTLY:*

    -   **Project Name**: `q-voting` (or your choice).
    -   **Framework Preset**: Select **Vite**.
    -   **Root Directory**: Click `Edit` and select `frontend`.
        *(⚠️ Important: Since we are deploying the frontend as the main view, we point root to `frontend`. The `vercel.json` in the root will handle the backend routing).*

    *(Wait! Actually, for the hybrid setup with `vercel.json` to work perfectly, keep Root Directory as `./` (default) and use the settings below)*:

    **b) CORRECT SETTINGS (Hybrid Mode)**:
    -   **Framework Preset**: Select **Other** (Override if it picked Vite).
    -   **Root Directory**: Leave as `./` (The root folder).
    -   **Build Command**: `cd frontend && npm install && npm run build`
    -   **Output Directory**: `frontend/dist`
    -   **Install Command**: `pip install -r backend/requirements.txt`

    *Why? Because we need to tell Vercel to install both Python and Node dependencies from the root.*

3.  **Environment Variables**:
    -   Expand "Environment Variables".
    -   Add `GEMINI_API_KEY` : `your_api_key_here` (If you want AI features).

4.  **Deploy**:
    -   Click **Deploy**.
    -   Vercel will detect the `vercel.json` configuration for the `/api` routes and the build command for the UI.

### Step 3: Verify Live Site
-   The build logs will show dependencies installing.
-   Once complete, visit your URL (e.g., `https://q-voting.vercel.app`).
-   Test the API by going to `https://q-voting.vercel.app/api/health`. It should return `{"status": "healthy"}`.

---

## 🌐 Professional Deployment (Stateful Backend)

While Vercel is perfect for the **Frontend**, its "Serverless" nature means the SQLite database (`quantum_voting.db`) resets frequently. For a persistent, production-grade deployment, we recommend hosting the **Backend** on **Render** or **Railway**.

### Option A: Deploy Backend to Render (Recommended)
1. **Create Web Service**: Connect your GitHub repo to [Render](https://render.com).
2. **Configure Service**:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Plan**: Free (or Starter for persistence).
3. **Environment Variables**: Add `GEMINI_API_KEY`.
4. **Persistent Disk (Important)**: 
   - Go to **Advanced** -> **Add Disk**.
   - Mount Path: `/app/data` (Update `DATABASE_URL` in `database.py` to `sqlite:////app/data/quantum_voting.db` if using a disk).
   - *Note: Without a disk, the DB will reset on every deploy/restart.*

### Option B: Deploy Backend to Railway
1. **New Project**: Select "Deploy from GitHub repo".
2. **Variables**: Add your `GEMINI_API_KEY`.
3. **Volumes**: Add a Volume to the backend service to persist the `.db` file.

### Step 3: Connect Frontend (Vercel) to Backend (Render/Railway)
Once your backend is live (e.g., `https://q-voting-api.onrender.com`), update your `vercel.json` in the root:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend-url.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔄 Updating & Maintenance Procedure

To update the system and push changes to GitHub/Production:

1. **Local Development**:
   Make your changes in the `backend/` or `frontend/` folders.

2. **Test Locally**:
   ```powershell
   .\run_project.ps1
   ```

3. **Deploy Updates**:
   Once satisfied, run these commands in your terminal:
   ```powershell
   git add .
   git commit -m "feat: your feature description"
   git push origin main
   ```

4. **Automatic Re-deployment**:
   - **Vercel** will detect the push and rebuild the **Frontend**.
   - **Render/Railway** will detect the push and rebuild the **Backend Container**.
   - Your live site will update automatically in ~2-3 minutes.

---

## 👤 Credits & Author

**Architected & Developed by:**

<div align="center">

### **V C Premchand Yadav**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/premchand-yadav-a785691a2/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/Premchandyadav369)

</div>

*Made by humans on Earth.* 🌍
*Driving the future of secure, transparent, and democratic elections.*

---

## ⚖️ Disclaimer
*This project is a high-fidelity academic simulation. While it leverages real cryptographic libraries (PyCryptodome, Qiskit) and authentic data structures, it is a prototype designed for research and demonstration purposes. It is not currently affiliated with the Election Commission of India.*
