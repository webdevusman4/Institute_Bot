const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/Notes.json');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const notes = JSON.parse(content);

    // Natural sort by ID
    notes.sort((a, b) => {
        const idA = a.id || '';
        const idB = b.id || '';
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
    });

    fs.writeFileSync(filePath, JSON.stringify(notes, null, 4));
    console.log(`Successfully sorted ${notes.length} notes in ${filePath}`);
} catch (error) {
    console.error('Error sorting notes:', error);
    process.exit(1);
}
