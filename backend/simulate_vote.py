import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def simulate_full_vote():
    print("🚀 Starting Vote Simulation...")
    
    # 1. Create Session
    print("\n1. Creating Session...")
    res = requests.post(f"{BASE_URL}/auth/session/create", json={"district": "Guntur"})
    if res.status_code != 200:
        print(f"Failed to create session: {res.text}")
        return
    session_data = res.json()
    session_id = session_data['session_id']
    print(f"Session Created: {session_id[:10]}...")
    
    # 2. Select Constituencies
    # Finding Guntur West (MLA) and Guntur (MP)
    mla_id = 88 # Guntur West
    mp_id = 213 # Guntur
    
    print("\n2. Selecting Constituencies...")
    payload = {
        "session_id": session_id,
        "mla_constituency_id": mla_id,
        "mp_constituency_id": mp_id
    }
    res = requests.post(f"{BASE_URL}/auth/session/select-constituencies", json=payload)
    if res.status_code != 200:
        print(f"Constituency selection failed: {res.text}")
        return
    print("Constituencies Selected (Guntur West + Guntur MP)")
    
    # 3. Generate Quantum Key
    print("\n3. Generating Quantum Key...")
    res = requests.post(f"{BASE_URL}/auth/quantum/generate-key?session_id={session_id}&simulate_attack=false")
    if res.status_code != 200:
        print(f"Key generation failed: {res.text}")
        return
    print("Quantum Key Generated")
    
    # 4. Get Candidates to Vote For
    print("\n4. Fetching Candidates...")
    res_candidates = requests.get(f"{BASE_URL}/voting/candidates/{mla_id}")
    mla_cand = res_candidates.json()['candidates'][0] # Vote for first candidate (likely TDP)
    print(f"Selected MLA Candidate: {mla_cand['name']} ({mla_cand['party']})")
    
    res_candidates_mp = requests.get(f"{BASE_URL}/voting/candidates/{mp_id}")
    mp_cand = res_candidates_mp.json()['candidates'][0] # Vote for first candidate
    print(f"Selected MP Candidate: {mp_cand['name']} ({mp_cand['party']})")
    
    # 5. Cast Votes
    print("\n5. Casting Votes...")
    
    # MLA Vote
    vote_data_mla = {
        "session_id": session_id,
        "candidate_id": mla_cand['id'],
        "election_type": "MLA"
    }
    res = requests.post(f"{BASE_URL}/voting/cast", json=vote_data_mla)
    if res.status_code != 200:
        print(f"MLA Vote failed: {res.text}")
        return
    print(f"MLA Vote Cast! Receipt: {res.json()['receipt_code']}")
    
    # MP Vote
    vote_data_mp = {
        "session_id": session_id,
        "candidate_id": mp_cand['id'],
        "election_type": "MP"
    }
    res = requests.post(f"{BASE_URL}/voting/cast", json=vote_data_mp)
    if res.status_code != 200:
        print(f"MP Vote failed: {res.text}")
        return
    print(f"MP Vote Cast! Receipt: {res.json()['receipt_code']}")
    
    print("\n✅ VOTING SIMULATION COMPLETE SUCCESS")

if __name__ == "__main__":
    simulate_full_vote()
