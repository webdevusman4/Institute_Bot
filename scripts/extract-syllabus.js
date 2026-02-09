const fs = require('fs');
const path = require('path');

// INPUT: Your source file with all the content
const INPUT_FILE = path.join(__dirname, '../data/Math 11 Chapter 2.json');
// OUTPUT: The lightweight list
const OUTPUT_FILE = path.join(__dirname, '../data/syllabus.json');

function extractSyllabus() {
    try {
        // 1. Read the full content file
        if (!fs.existsSync(INPUT_FILE)) {
            console.error(`❌ Error: Could not find ${INPUT_FILE}`);
            return;
        }
        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        const source = JSON.parse(rawData);

        const syllabus = {
            chapter: source.chapter || "Unit 2: Matrices & Determinants",
            sections: []
        };

        let currentSection = null;

        // 2. Iterate and Extract ONLY Titles/IDs
        source.topics.forEach(item => {
            const idLower = item.id.toLowerCase();

            // Skip Notes, Exercises, and Reviews (Keep only Topics)
            if (idLower.startsWith('note') ||
                idLower.startsWith('exercise') ||
                idLower.startsWith('review')) {
                return;
            }

            // Determine hierarchy based on dots (e.g., 2.1 vs 2.1.1)
            const dots = item.id.split('.').length - 1;

            if (dots === 1) {
                // === Main Section (e.g., 2.1) ===
                currentSection = {
                    id: item.id,
                    title: item.title,
                    subtopics: [] // Initialize empty list
                };
                syllabus.sections.push(currentSection);

            } else if (dots >= 2) {
                // === Subtopic (e.g., 2.1.1) ===
                if (!currentSection) {
                    // Safety catch if a subtopic appears before a section
                    currentSection = { id: "Intro", title: "Introduction", subtopics: [] };
                    syllabus.sections.push(currentSection);
                }

                // Push ONLY id and title (No content/definition)
                currentSection.subtopics.push({
                    id: item.id,
                    title: item.title
                });
            }
        });

        // 3. Save the clean list
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(syllabus, null, 2));
        console.log(`✅ Syllabus extracted successfully!`);
        console.log(`📂 Saved to: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("🔥 Error extracting syllabus:", error);
    }
}

extractSyllabus();