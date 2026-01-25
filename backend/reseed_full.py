
import json
import re

def parse_combined_data(file_path):
    print("Parsing full candidate data...")
    
    mla_constituencies = []
    mp_constituencies = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split MLA and MP sections
    parts = content.split('CONST_DATA_SEPARATOR')
    mla_section = parts[0]
    mp_section = parts[1] if len(parts) > 1 else ""
    
    # --- PARSE MLA DATA ---
    # Format: District | No | Name | Reserved | YSRCP Candidate | NDA Candidate | INDIA Candidate
    # Actually based on text structure:
    # Srikakulam 1 Ichchapuram YSRCP Piriya Vijaya TDP Bendalam Ashok INC Masupatri Chakravarthy Reddy
    
    mla_lines = mla_section.strip().split('\n')
    current_district = "Srikakulam" # Default start
    
    for line in mla_lines:
        line = line.strip()
        if not line or "Constituency" in line or "No." in line:
            continue
            
        # Try to parse tab separated first
        cols = line.split('\t')
        
        # Clean up empty cols
        cols = [c.strip() for c in cols if c.strip()]
        
        if not cols:
            continue
            
        # Logic to identify columns
        # Sometimes District is the first column if it changes
        # Row usually starts with ID if district is same as unknown, or maybe District is explicit
        
        # Let's try to detect if first col is a District name (String) or ID (Int)
        first_col = cols[0]
        
        c_id = None
        c_name = None
        c_district = current_district
        
        try:
            c_id = int(first_col)
            # If successful, first col is ID. Next is Name.
            c_name = cols[1]
            idx_offset = 0
            
            # Special case: line 1 "Srikakulam 1 Ichchapuram..."
        except ValueError:
            # First col is likely District
            c_district = first_col
            try:
                c_id = int(cols[1])
                c_name = cols[2]
                current_district = c_district
                idx_offset = 1
            except:
                continue # Header line or garbage
        
        # Now we have ID, Name, District. Need candidates.
        # The remaining columns are alternating Party Name, Candidate Name?
        # User pasted: 
        # Srikakulam 1 Ichchapuram YSRCP Piriya Vijaya TDP Bendalam Ashok INC Masupatri Chakravarthy Reddy
        # Cols for line 1: ['Srikakulam', '1', 'Ichchapuram', 'YSRCP', 'Piriya Vijaya', 'TDP', 'Bendalam Ashok', 'INC', 'Masupatri Chakravarthy Reddy']
        
        candidates = []
        
        # Remaining cols after Name
        remaining = cols[2+idx_offset:]
        
        # Some rows might have "Reserved" column? "Rajam (SC)" - name includes reservation
        reserved = "None"
        if "(SC)" in c_name:
            c_name = c_name.replace("(SC)", "").strip()
            reserved = "SC"
        elif "(ST)" in c_name:
            c_name = c_name.replace("(ST)", "").strip()
            reserved = "ST"
            
        # Parse candidates from remaining
        # Expect pairs: Party, Candidate Name
        # Sometimes there might be empty columns in between in the original copy paste
        
        i = 0
        while i < len(remaining) - 1:
            party = remaining[i]
            cand_name = remaining[i+1]
            
            # Simple validation: Party should be short
            if len(party) < 10 and len(cand_name) > 2:
                candidates.append({"party": party, "name": cand_name})
            
            i += 2
            
        mla_constituencies.append({
            "id": c_id,
            "name": c_name,
            "district": c_district,
            "election_type": "MLA",
            "reserved": reserved,
            "candidates": candidates
        })

    # --- PARSE MP DATA ---
    # Format: No | Name | YCP Cand | NDA Cand | INDIA Cand
    # 1 Araku (ST) YCP Gumma Thanuja Rani BJP Kothapalli Geetha CPI(M) Appala Narsa
    
    # --- MP TO DISTRICT MAPPING (New 26 Districts) ---
    mp_dist_map = {
        "Araku": "Alluri Sitharama Raju",
        "Srikakulam": "Srikakulam",
        "Vizianagaram": "Vizianagaram",
        "Visakhapatnam": "Visakhapatnam",
        "Anakapalli": "Anakapalli",
        "Kakinada": "Kakinada",
        "Amalapuram": "Dr. B.R. Ambedkar Konaseema",
        "Rajahmundry": "East Godavari",
        "Narasapuram": "West Godavari",
        "Eluru": "Eluru",
        "Machilipatnam": "Krishna",
        "Vijayawada": "NTR",
        "Guntur": "Guntur",
        "Narasaraopet": "Palnadu",
        "Bapatla": "Bapatla",
        "Ongole": "Prakasam",
        "Nandyal": "Nandyal",
        "Kurnool": "Kurnool",
        "Kurnoolu": "Kurnool",
        "Anantapur": "Anantapur",
        "Hindupur": "Sri Sathya Sai",
        "Kadapa": "YSR",
        "Nellore": "SPSR Nellore",
        "Tirupati": "Tirupati",
        "Rajampet": "Annamayya",
        "Chittoor": "Chittoor"
    }

    mp_lines = mp_section.strip().split('\n')
    for line in mp_lines:
        line = line.strip()
        if not line or "Constituency" in line or "YSRCP" in line:
            continue
            
        cols = line.split('\t')
        cols = [c.strip() for c in cols if c.strip()]
        
        if not cols:
            continue
            
        try:
            c_id = int(cols[0])
            c_name_raw = cols[1]
        except:
            continue
            
        reserved = "None"
        c_name_clean = c_name_raw
        if "(SC)" in c_name_raw:
            c_name_clean = c_name_raw.replace("(SC)", "").strip()
            reserved = "SC"
        elif "(ST)" in c_name_raw:
            c_name_clean = c_name_raw.replace("(ST)", "").strip()
            reserved = "ST"
            
        # Determine District
        # Split by space to get first word usually works, but some have two words
        # Try direct lookup first
        
        mapped_district = "Andhra Pradesh" # Fallback
        
        # Try exact match or partial match in map
        for key in mp_dist_map:
            if key.lower() in c_name_clean.lower():
                mapped_district = mp_dist_map[key]
                break
        
        # Candidates start from index 2
        candidates = []
        remaining = cols[2:]
        
        i = 0
        while i < len(remaining) - 1:
            party = remaining[i]
            cand_name = remaining[i+1]
            
            if len(party) < 10 and len(cand_name) > 2:
                candidates.append({"party": party, "name": cand_name})
            i += 2
            
        mp_constituencies.append({
            "id": 200 + c_id, # Offset for uniqueness
            "real_id": c_id,
            "name": c_name_raw, # Keep original name with (SC)/(ST) for display
            "district": mapped_district,
            "election_type": "MP",
            "reserved": reserved,
            "candidates": candidates
        })

    return {"mla": mla_constituencies, "mp": mp_constituencies}

def seed_database_from_parsed(data):
    from models.database import SessionLocal, Constituency, Candidate, District, Base, engine
    
    # Import locally to avoid issues
    
    print("Re-creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Party colors
    colors = {
        'YSRCP': '#2196F3', 'YCP': '#2196F3',
        'TDP': '#FFEB3B',
        'JSP': '#F44336',
        'BJP': '#FF9800',
        'INC': '#00BCD4',
        'CPI': '#E91E63', 'CPI(M)': '#E91E63',
        'IND': '#9E9E9E'
    }
    
    try:
        # Seed Districts First
        # We can extract districts from MLA list
        unique_districts = set([c['district'] for c in data['mla']])
        print(f"Seeding {len(unique_districts)} Districts...")
        
        for d_name in unique_districts:
            db.add(District(name=d_name))
        db.flush()
        
        # Seed MLA
        print(f"Seeding {len(data['mla'])} MLA Constituencies...")
        for c in data['mla']:
            const = Constituency(
                id=c['id'],
                name=c['name'],
                election_type='MLA',
                district=c['district']
            )
            db.add(const)
            db.flush()
            
            for cand in c['candidates']:
                pty = cand['party']
                color =Colors = colors.get(pty, '#9E9E9E')
                
                db.add(Candidate(
                    constituency_id=const.id,
                    name=cand['name'],
                    party=pty,
                    party_short=pty,
                    party_color=colors.get(pty, '#9E9E9E')
                ))
        
        # Seed MP
        print(f"Seeding {len(data['mp'])} MP Constituencies...")
        for c in data['mp']:
            # Try to find a district match or default
            # For MP we might need to be less strict about district mapping for now
            const = Constituency(
                id=c['id'],
                name=c['name'],
                election_type='MP',
                district=c['district'] # "Andhra Pradesh"
            )
            db.add(const)
            db.flush()
            
            for cand in c['candidates']:
                pty = cand['party']
                db.add(Candidate(
                    constituency_id=const.id,
                    name=cand['name'],
                    party=pty,
                    party_short=pty,
                    party_color=colors.get(pty, '#9E9E9E')
                ))
                
        db.commit()
        print("Database seeding complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    data = parse_combined_data('user_candidates.txt')
    seed_database_from_parsed(data)
