import requests
import json
import random
import time
import concurrent.futures

BASE_URL = "http://localhost:8000/api"

# Configuration
TOTAL_VOTERS = 1000
CONCURRENCY = 50  # Number of parallel sessions
DISTRICTS = [
    "Srikakulam", "Vizianagaram", "Visakhapatnam", "Anakapalli", "Alluri Sitharama Raju",
    "Kakinada", "East Godavari", "Konaseema", "West Godavari", "Eluru", "Krishna",
    "NTR", "Guntur", "Palnadu", "Bapatla", "Prakasam", "Nellore", "Tirupati",
    "Chittoor", "Annamayya", "Kadapa", "Nandyal", "Kurnool", "Anantapur", "Sri Sathya Sai"
]

def simulate_voter(voter_idx):
    try:
        # 1. Start Session
        district = random.choice(DISTRICTS)
        res = requests.post(f"{BASE_URL}/auth/session/create", json={"district": district})
        if res.status_code != 200: return False
        session_id = res.json()['session_id']
        
        # 2. Get available constituencies for this district
        res = requests.get(f"{BASE_URL}/voting/constituencies/MLA?district={district}")
        mla_list = res.json().get('constituencies', [])
        if not mla_list: return False
        mla_const = random.choice(mla_list)
        
        res = requests.get(f"{BASE_URL}/voting/constituencies/MP") # MP might be across districts
        mp_list = res.json().get('constituencies', [])
        if not mp_list: return False
        mp_const = random.choice(mp_list)
        
        # 3. Select Constituencies
        payload = {
            "session_id": session_id,
            "mla_constituency_id": mla_const['id'],
            "mp_constituency_id": mp_const['id']
        }
        requests.post(f"{BASE_URL}/auth/session/select-constituencies", json=payload)
        
        # 4. Generate Quantum Key
        requests.post(f"{BASE_URL}/auth/quantum/generate-key?session_id={session_id}&simulate_attack=false")
        
        # 5. Fetch Candidates and Cast Votes
        # Realistic Bias: Kutami (TDP, JSP, BJP) 70%, YSRCP 20%, others 10%
        bias_roll = random.random()
        
        # MLA Vote
        res = requests.get(f"{BASE_URL}/voting/candidates/{mla_const['id']}")
        candidates = res.json().get('candidates', [])
        if not candidates: return False
        
        # Sort candidates to handle bias
        kutami_cands = [c for c in candidates if c['party_short'] in ['TDP', 'JSP', 'BJP']]
        ysrcp_cands = [c for c in candidates if c['party_short'] == 'YSRCP']
        others = [c for c in candidates if c['party_short'] not in ['TDP', 'JSP', 'BJP', 'YSRCP']]
        
        mla_choice = None
        if bias_roll < 0.7 and kutami_cands:
            mla_choice = random.choice(kutami_cands)
        elif bias_roll < 0.9 and ysrcp_cands:
            mla_choice = random.choice(ysrcp_cands)
        else:
            mla_choice = random.choice(candidates)
            
        requests.post(f"{BASE_URL}/voting/cast", json={
            "session_id": session_id,
            "candidate_id": mla_choice['id'],
            "election_type": "MLA"
        })
        
        # MP Vote (using same session)
        res = requests.get(f"{BASE_URL}/voting/candidates/{mp_const['id']}")
        candidates_mp = res.json().get('candidates', [])
        if not candidates_mp: return False
        
        kutami_cands_mp = [c for c in candidates_mp if c['party_short'] in ['TDP', 'JSP', 'BJP']]
        ysrcp_cands_mp = [c for c in candidates_mp if c['party_short'] == 'YSRCP']
        
        mp_choice = None
        if bias_roll < 0.7 and kutami_cands_mp:
            mp_choice = random.choice(kutami_cands_mp)
        elif bias_roll < 0.9 and ysrcp_cands_mp:
            mp_choice = random.choice(ysrcp_cands_mp)
        else:
            mp_choice = random.choice(candidates_mp)
            
        requests.post(f"{BASE_URL}/voting/cast", json={
            "session_id": session_id,
            "candidate_id": mp_choice['id'],
            "election_type": "MP"
        })
        
        if voter_idx % 50 == 0:
            print(f"✅ Voter {voter_idx} cast their votes.")
        return True
    except Exception as e:
        # print(f"Error for voter {voter_idx}: {e}")
        return False

def main():
    print(f"🚀 Starting Real-World Simulation of {TOTAL_VOTERS} voters...")
    start_time = time.time()
    
    success_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = [executor.submit(simulate_voter, i) for i in range(1, TOTAL_VOTERS + 1)]
        for future in concurrent.futures.as_completed(futures):
            if future.result():
                success_count += 1
                
    end_time = time.time()
    duration = end_time - start_time
    print(f"\n✨ Simulation Complete!")
    print(f"Total Successful Votes: {success_count}/{TOTAL_VOTERS}")
    print(f"Time Taken: {duration:.2f} seconds ({success_count/duration:.2f} votes/sec)")

if __name__ == "__main__":
    main()
