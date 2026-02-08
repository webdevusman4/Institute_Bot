import json
import re

def normalize_latex_json():
    input_file = "data/chapter_2.json"  # Point to your current file
    output_file = "data/chapter_2.json" # Overwrite it with the clean version

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: File not found!")
        return

    def clean_text(text):
        if not isinstance(text, str): return text
        
        # 1. Replace 8, 4, or 3 backslashes with 2 (Standard LaTeX)
        # This fixes the "\\\\\\\\" mess
        text = re.sub(r'\\{3,8}', r'\\\\', text)
        
        # 2. Fix the "Single Backslash" bug (2 \ 3 -> 2 \\ 3)
        # But protect common commands like \times, \frac, etc.
        protected = "times|neq|text|end|begin|frac|quad|sqrt|alpha|beta|gamma|omega|sigma|pi|theta|infty|dots|vdots|forall|exists|in|cdot|implies|approx|le|ge|mathbf|overline|left|right|vmatrix|bmatrix"
        
        # Look for single backslash NOT followed by a protected command
        text = re.sub(r'(?<=[0-9a-zA-Z])\s*\\\s*(?!\s*(?:' + protected + r'))', r' \\\\ ', text)

        return text

    # Apply to all topics
    for topic in data['topics']:
        topic['content'] = clean_text(topic.get("content", ""))

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("✅ JSON Normalized: All matrices now use standard '\\\\' format.")

if __name__ == "__main__":
    normalize_latex_json()