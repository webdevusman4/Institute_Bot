import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import fs from "fs";

// ✅ 1. SETUP: Use the requested Gemini 2.5 Flash model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let cachedPdfText = "";

// --- HELPER 1: Load PDF (Institute Info) ---
async function getPdfText() {
  if (cachedPdfText) return cachedPdfText;
  try {
    const filePath = path.join(process.cwd(), "data", "data.pdf");
    // Check if file exists to avoid crashing
    if (!fs.existsSync(filePath)) return "";
    
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const fullText = docs.map(doc => doc.pageContent).join("\n");
    cachedPdfText = fullText.substring(0, 20000); 
    return cachedPdfText;
  } catch (error) {
    console.error("❌ PDF Read Error:", error.message);
    return ""; 
  }
}

// --- HELPER 2: Load JSON (Math Formulas) ---
async function getJsonContext(lastMessage) {
  try {
    const filePath = path.join(process.cwd(), 'app/data/matrices.json');
    if (!fs.existsSync(filePath)) return "";

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const knowledgeBase = JSON.parse(fileContents);

    // Find the specific topic based on keywords in the user's message
    const relevantTopic = knowledgeBase.find(topic => 
      topic.keywords.some(keyword => lastMessage.toLowerCase().includes(keyword))
    );

    if (relevantTopic) {
      return `\n\n📌 OFFICIAL MATH DEFINITION (Use this LaTeX exactly):\n${relevantTopic.content}\n\n`;
    }
    return "";
  } catch (error) {
    console.error("❌ JSON Read Error:", error.message);
    return "";
  }
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]; // User's latest message (Object)
    const userQuery = lastMessage.content;             // The actual text string

    console.log("📩 User Asked:", userQuery);

    // 1. Gather all context
    const pdfContext = await getPdfText();
    const jsonContext = await getJsonContext(userQuery);

    // 2. Build Conversation History
    const historyText = messages.slice(0, -1).map(m => 
      `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`
    ).join("\n");

    // 3. THE MASTER PROMPT
    const prompt = `
      You are 'StudyMate', the advanced AI assistant for Unity Institute.
      
      --- SOURCE 1: OFFICIAL MATH FORMULAS (High Priority) ---
      ${jsonContext}
      (If this section is not empty, you MUST use the provided LaTeX for math queries.)
      --------------------------------------------------------

      --- SOURCE 2: INSTITUTE PROSPECTUS (PDF) ---
      ${pdfContext}
      --------------------------------------------

      --- CONVERSATION HISTORY ---
      ${historyText}
      ----------------------------

      Student's New Question: ${userQuery}

      INSTRUCTIONS:
      1. **Math Mode:** If the user asks about a math topic found in "SOURCE 1", use that exact definition and LaTeX.
      2. **Institute Mode:** If the user asks about fees, admissions, or courses, strictly use "SOURCE 2".
      3. **General Mode:** If the question is general (e.g., "Write a Python script"), use your own knowledge.
      4. **LaTeX Rules:** ALWAYS use double dollar signs $$...$$ for block equations and single $...$ for inline math.
      5. **Tone:** Professional, encouraging, and concise.
    `;

    // 4. Generate Response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();
    
    return Response.json({ reply });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return Response.json({ reply: "I'm having trouble connecting to the brain right now." }, { status: 500 });
  }
}