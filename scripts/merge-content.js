const fs = require('fs');
const path = require('path');

// 1. PATHS
const SYLLABUS_FILE = path.join(__dirname, '../data/syllabus.json');
const NOTES_FILE = path.join(__dirname, '../data/Notes.json');
const OUTPUT_FILE = path.join(__dirname, '../data/chapter_complete.json');

// 2. HELPER: Clean Note IDs (e.g., "Note.2.1.3.1" -> "2.1.3.1")
function cleanId(id) {
    return id.replace(/^Note\./i, '').trim();
}

function mergeData() {
    try {
        // Read Files
        if (!fs.existsSync(SYLLABUS_FILE) || !fs.existsSync(NOTES_FILE)) {
            console.error("❌ Error: Missing input files.");
            return;
        }

        const syllabus = JSON.parse(fs.readFileSync(SYLLABUS_FILE, 'utf8'));
        const notesData = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));

        // 3. Create a Lookup Map for Syllabus Items
        // We map "ID" -> Object Reference so we can instantly find where to inject notes
        const syllabusMap = new Map();

        syllabus.sections.forEach(section => {
            // Map the Section (e.g., "2.1")
            syllabusMap.set(section.id, section);

            // Initialize notes array if missing
            if (!section.notes) section.notes = [];

            // Map all Subtopics (e.g., "2.1.1")
            if (section.subtopics) {
                section.subtopics.forEach(sub => {
                    syllabusMap.set(sub.id, sub);
                    if (!sub.notes) sub.notes = [];
                });
            }
        });

        console.log(`🗺️  Mapped ${syllabusMap.size} syllabus items.`);

        // 4. Distribute Notes into the Syllabus
        let matchedCount = 0;
        let unmatchedCount = 0;

        notesData.forEach(item => {
            const cleanNoteId = cleanId(item.id);

            // LOGIC: Find the best parent for this note
            // If Note is "2.1.3.1", we look for "2.1.3.1", then "2.1.3", then "2.1"
            let target = null;
            let searchId = cleanNoteId;

            while (searchId.length > 0) {
                if (syllabusMap.has(searchId)) {
                    target = syllabusMap.get(searchId);
                    break; // Found the closest parent!
                }
                // Remove the last segment (e.g., "2.1.3.1" -> "2.1.3")
                const lastDot = searchId.lastIndexOf('.');
                if (lastDot === -1) break;
                searchId = searchId.substring(0, lastDot);
            }

            if (target) {
                // We found a home for this note!
                // Decide if it's a "Topic Content" (replace) or an "Extra Note" (append)

                // If IDs match exactly and it's not explicitly a "Note", treat it as main content
                if (cleanNoteId === target.id && !item.id.toLowerCase().startsWith("note")) {
                    target.content = item.content; // Fill in the empty definition from syllabus
                } else {
                    // It's a Note or extra info, append to notes array
                    target.notes.push({
                        title: item.title,
                        content: item.content
                    });
                }
                matchedCount++;
            } else {
                console.warn(`⚠️  Orphan Note (No parent found): ${item.id}`);
                unmatchedCount++;
            }
        });

        // 5. Save the Result
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(syllabus, null, 2));

        console.log(`\n✅ MERGE COMPLETE!`);
        console.log(`   - Matched: ${matchedCount} items`);
        console.log(`   - Unmatched: ${unmatchedCount} items`);
        console.log(`   - Output: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("🔥 Critical Error:", error);
    }
}

mergeData();