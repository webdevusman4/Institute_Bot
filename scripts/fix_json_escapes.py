
import re

file_path = 'data/chapter_2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 7 (index 6) is the problem.
line_index = 6
if len(lines) > line_index:
    line = lines[line_index]
    # Look for "content": "..."
    # We want to replace backslashes inside the quoted string value.
    # Pattern: lead ("content": ") + value + tail (",\n or "\n)
    # We use a non-greedy match for the content if possible, but since allowed content can be anything...
    # Actually, simplest way for this specific line:
    # Identify the part between the first "content": " and the last "
    
    start_marker = '"content": "'
    start_pos = line.find(start_marker)
    
    if start_pos != -1:
        # Start of the value
        content_start = start_pos + len(start_marker)
        
        # End of the value: find the last quote in the line
        # (Assuming the line ends with quote+comma or quote+newline)
        content_end = line.rfind('"')
        
        if content_end > content_start:
            prefix = line[:content_start]
            content = line[content_start:content_end]
            suffix = line[content_end:]
            
            # Escape backslashes in the content
            # Note: We replace single backslash with double backslash.
            # But we must be careful not to double-escape if already valid?
            # The prompt says "Invalid escape character", implying they are single.
            # So escaping all is likely what we want for LaTeX code.
            new_content = content.replace('\\', '\\\\')
            
            lines[line_index] = prefix + new_content + suffix
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print("Fixed line 7 successfully.")
        else:
            print("Could not find end of content string.")
    else:
        print("Could not find 'content' key on line 7.")
else:
    print("File has fewer than 7 lines.")
