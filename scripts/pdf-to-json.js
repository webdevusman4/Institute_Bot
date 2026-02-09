const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" }); 

// CONFIGURATION
const PDF_PATH = "data/Math 11 Chapter 2.pdf";             
const OUTPUT_PATH = "data/Math 11 Chapter 2.json"; // Outputting the FULL chapter now

async function main() {
  console.log("🚀 Starting Full Chapter Extraction...");

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
  
  // Using Flash for speed, but instructing it to be detailed
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" } 
  });

  try {
    // 1. Upload PDF
    console.log("📤 Uploading PDF...");
    const uploadResponse = await fileManager.uploadFile(PDF_PATH, {
      mimeType: "application/pdf",
      displayName: "Textbook Chapter",
    });

    console.log(`✅ Uploaded: ${uploadResponse.file.uri}`);

    // 2. Wait for processing
    let file = await fileManager.getFile(uploadResponse.file.name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await fileManager.getFile(uploadResponse.file.name);
    }
    console.log("\n✅ PDF is ready.");

    // 3. Send FULL CONTENT Command
    console.log("🧠 Transcribing Definitions, Formulas & Notes...");
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: `
        You are an expert Math Textbook Transcriber. 
        Your goal is to convert this PDF chapter into a structured JSON database including ALL content.

        OUTPUT FORMAT (Strict JSON):
        {
          "chapter": "Matrices",
          "topics": [
            {
              "id": "2.1",
              "title": "Introduction to Matrices",
              "content": "Full text of the definition... $$ A = [a_{ij}] $$ ... include examples."
            },
            {
              "id": "Note",
              "title": "Note on Singular Matrices",
              "content": "A square matrix A is singular if |A| = 0."
            }
          ]
        }

        CRITICAL RULES:
        1. **Content is King:** Do not summarize. If the text says "A rectangular array...", you write "A rectangular array...".
        2. **LaTeX for Math:** Convert ALL math expressions to LaTeX.
           - Inline: $ x + y $
           - Block: $$ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} $$
        3. **Capture Notes:** If you see a "Note", "Remark", or "Important" box, create a topic entry for it and transcribe the text inside.
        4. **Escape Characters:** Double escape backslashes (e.g., use \\\\ for LaTeX commands).
      `},
    ]);

    // 4. Save the Result
    const jsonString = result.response.text();
    
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, jsonString);
    
    console.log(`🎉 Success! Full Chapter saved to: ${OUTPUT_PATH}`);

  } catch (error) {
    console.error("🔥 Error:", error);
  }
}

main();