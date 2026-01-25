
import json
import os

def parse_data(file_path):
    print("Parsing user data...")
    mla_list = []
    mp_list = []
    
    mp_map = {} # MP_Name -> District
    
    with open(file_path, 'r') as f:
        # Skip header
        next(f)
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) < 5:
                continue
            
            # Format: No, Name, Reserved, District, Lok Sabha Constituency
            try:
                c_no = int(parts[0])
            except:
                continue
                
            c_name = parts[1].strip()
            reserved = parts[2].strip()
            district = parts[3].strip()
            mp_name = parts[4].strip()
            
            # Create MLA Constituency
            mla_obj = {
                "id": c_no,
                "name": c_name,
                "district": district,
                "reserved": reserved
            }
            mla_list.append(mla_obj)
            
            # Track MP constituency with a unique ID later
            if mp_name not in mp_map:
                mp_map[mp_name] = district
    
    # Create MP Constituencies
    # Assign IDs 1 to 25 based on sorted names or just order
    sorted_mps = sorted(mp_map.keys())
    for idx, mp_name in enumerate(sorted_mps):
        mp_obj = {
            "id": idx + 1,
            "name": mp_name,
            "district": mp_map[mp_name]
        }
        mp_list.append(mp_obj)
        
    return {
        "mla_constituencies": mla_list,
        "mp_constituencies": mp_list
    }

def update_seed_file(new_data, seed_file_path):
    print(f"Updating {seed_file_path}...")
    
    directory = os.path.dirname(seed_file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
        
    with open(seed_file_path, 'w') as f:
        json.dump(new_data, f, indent=4)
    print("User data converted and saved.")

if __name__ == "__main__":
    data = parse_data('user_data.txt')
    update_seed_file(data, 'data/constituencies.json')
