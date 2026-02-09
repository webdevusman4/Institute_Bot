import json
import re
import os
import sys

def natural_keys(text):
    return [ int(c) if c.isdigit() else c for c in re.split(r'(\d+)', text) ]

# Get absolute path to the data directory based on script location
script_dir = os.path.dirname(os.path.abspath(__file__))
# Assuming script is in /scripts, data is in /data (sibling)
file_path = os.path.join(script_dir, '..', 'data', 'Notes.json')
file_path = os.path.abspath(file_path)

print(f"Target file path: {file_path}")

try:
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        # List what is in ../data for debugging
        data_dir = os.path.join(script_dir, '..', 'data')
        if os.path.exists(data_dir):
            print(f"Contents of {data_dir}: {os.listdir(data_dir)}")
        else:
            print(f"Data dir {data_dir} does not exist.")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        notes = json.load(f)
    
    print(f"Read {len(notes)} notes. Sorting...")
    
    # Sort by ID
    notes.sort(key=lambda x: natural_keys(x.get('id', '')))
    
    # Check if header changed
    print(f"First note ID before save: {notes[0]['id']}")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully sorted notes in {file_path}")

except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
