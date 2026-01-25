# 🗳️ Q-Voting Ultra: Next-Gen Quantum Secure Voting System

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

To deploy this "Next-Gen" application to Vercel, we use a hybrid approach or a Vercel serverless configuration.

### Deployment Steps

1.  **Prepare the Frontend**:
    - Navigate to `frontend/`.
    - Ensure `vite.config.js` is set up.
    - Run `npm run build` to verify it builds correctly.

2.  **Prepare the Backend (Serverless)**:
    - Create a `vercel.json` in the root directory to tell Vercel how to handle the Python API.
    - Ensure `requirements.txt` is present in the `backend/` folder.

3.  **Vercel Configuration (`vercel.json`)**:
    Create a file named `vercel.json` in the root with the following content:

    ```json
    {
      "version": 2,
      "builds": [
        {
          "src": "backend/main.py",
          "use": "@vercel/python"
        },
        {
          "src": "frontend/package.json",
          "use": "@vercel/static-build",
          "config": { "distDir": "dist" }
        }
      ],
      "routes": [
        {
          "src": "/api/(.*)",
          "dest": "backend/main.py"
        },
        {
          "src": "/(.*)",
          "dest": "frontend/$1"
        }
      ]
    }
    ```

4.  **Push to GitHub**:
    - Push your code to the repository: [https://github.com/Premchandyadav369](https://github.com/Premchandyadav369)

5.  **Deploy**:
    - Connect your GitHub repo to Vercel.
    - Vercel will detect the configuration and deploy both the React frontend and Python backend (as serverless functions).

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
