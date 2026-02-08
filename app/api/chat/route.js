import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 1. FIX: Use the correct model name (2.5 Flash is the current fast model)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let cachedPdfText = "";

async function getPdfText() {
  if (cachedPdfText) return cachedPdfText;
  try {
    const filePath = path.join(process.cwd(), "data", "data.pdf");
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const fullText = docs.map(doc => doc.pageContent).join("\n");
    
    // Optional: You can increase this limit if you want more context
    cachedPdfText = fullText.substring(0, 20000); 
    return cachedPdfText;
  } catch (error) {
    console.error("❌ PDF Read Error:", error.message);
    return ""; 
  }
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    console.log("📩 User Asked:", lastMessage.content);

    const context = await getPdfText();

    const historyText = messages.slice(0, -1).map(m => 
      `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`
    ).join("\n");

    // 2. UPGRADE: The Hybrid Prompt
    // This tells the AI to look at the PDF first, but use general knowledge if needed.
    const prompt = `
      You are a smart, helpful AI assistant for 'Unity Institute'. 

      --- YOUR KNOWLEDGE BASE (PDF) ---
      ${context}
      ---------------------------------

      --- CONVERSATION HISTORY ---
      ${historyText}
      ----------------------------

      Student's New Question: ${lastMessage.content}

      INSTRUCTIONS:
      1. **Priority #1 (The Institute):** First, check the "PROSPECTUS DATA" above. If the question is about fees, courses, admission, or the institute, answer STRICTLY using that data.
      2. **Priority #2 (General Knowledge):** If the user asks a general question (e.g., "What is coding?", "Who is Einstein?", "Translate this to Urdu"), use your own general knowledge to answer.
      3. **Honesty:** If the user asks for a specific Institute fact (like a phone number) that is NOT in the PDF, say "I couldn't find that detail in the prospectus."
      4. **Tone:** Be professional and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();
    
    return Response.json({ reply });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return Response.json({ reply: "I'm having trouble thinking right now." });
  }
}