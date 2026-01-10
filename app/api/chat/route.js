import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
// ... imports


console.log("🔑 API Key Status:", process.env.GOOGLE_API_KEY ? "Loaded" : "MISSING - CHECK .ENV FILE");

// ✅ USE THE WORKING MODEL
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let cachedPdfText = "";

async function getPdfText() {
    if (cachedPdfText) return cachedPdfText;

    try {
        const filePath = path.join(process.cwd(), "docs", "data.pdf");
        console.log("📂 Reading PDF from:", filePath);

        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // Join text and Safety Trim: Limit to 10,000 characters to avoid "Token Limit" errors
        const fullText = docs.map(doc => doc.pageContent).join("\n");
        cachedPdfText = fullText.substring(0, 10000);

        console.log("✅ PDF Loaded! Length:", cachedPdfText.length);
        return cachedPdfText;
    } catch (error) {
        console.error("❌ PDF Read Error:", error.message);
        return "";
    }
}

export async function POST(req) {
    try {
        const { message } = await req.json();
        console.log("📩 User Asked:", message);

        const context = await getPdfText();

        const prompt = `
      You are an AI assistant for 'Unity Institute'. 
      Answer the question based ONLY on the text below.
      
      --- DATA ---
      ${context}
      --- END DATA ---

      Question: ${message}
    `;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        return Response.json({ reply });

    } catch (error) {
        console.error("🔥 API ERROR:", error);
        return Response.json({ reply: "Connection failed. Please check terminal for details." });
    }
}