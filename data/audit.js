const fs = require('fs');
const path = require('path');
const dir = process.cwd();
const files = fs.readdirSync(dir);

const targetFiles = files.filter(f => {
  const lower = f.toLowerCase();
  return lower.startsWith('java') && lower.endsWith('.json');
});

const result = {};

targetFiles.forEach(file => {
  try {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const data = JSON.parse(raw);
    const fileObj = {};
    
    if (Array.isArray(data.sections)) {
      data.sections.forEach(sec => {
        if (!sec.id) return;
        const secId = String(sec.id);
        const subtopicsObj = {};
        
        if (Array.isArray(sec.subtopics)) {
          sec.subtopics.forEach(sub => {
            if (sub.id) {
              subtopicsObj[String(sub.id)] = sub.title;
            }
          });
        }
        
        fileObj[secId] = { title: sec.title, subtopics: subtopicsObj };
      });
    }
    
    // 🏗️ GHOST FILTER: Only add to result if it successfully extracted data
    if (Object.keys(fileObj).length > 0) {
      result[file] = fileObj;
    }
    
  } catch (e) {
    process.stderr.write('Error processing ' + file + ': ' + e.message + '\n');
  }
});

// 🏗️ FILE WRITER: Save directly to a JSON file instead of flooding the terminal
const outputPath = path.join(dir, 'MasterOutline.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 4), 'utf8');

console.log(`✅ Extraction complete! Master curriculum saved to: ${outputPath}`);