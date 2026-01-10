// scripts/test-read.js
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

async function testRead() {
    console.log("📂 Loading PDF...");

    try {
        // 1. Load the PDF
        const loader = new PDFLoader("docs/data.pdf");
        const docs = await loader.load();

        // 2. Success Check
        if (docs.length > 0) {
            console.log("✅ SUCCESS! The bot can read your file.");
            console.log("---------------------------------------");
            console.log("Preview text found:");
            console.log(docs[0].pageContent.substring(0, 300) + "...");
            console.log("---------------------------------------");
        } else {
            console.log("⚠️ The file is empty.");
        }

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        console.log("Tip: Make sure 'data.pdf' is inside the 'docs' folder.");
    }
}

testRead();