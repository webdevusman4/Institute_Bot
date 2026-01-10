import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let cachedPdfText = "";

async function getPdfText() {
  if (cachedPdfText) return cachedPdfText;
  try {
    const filePath = path.join(process.cwd(), "docs", "data.pdf");
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const fullText = docs.map(doc => doc.pageContent).join("\n");
    cachedPdfText = fullText.substring(0, 10000); 
    return cachedPdfText;
  } catch (error) {
    console.error("❌ PDF Read Error:", error.message);
    return ""; 
  }
}

export async function POST(req) {
  try {
    // 1. Get the FULL conversation history (not just the last message)
    const { messages } = await req.json();
    
    // 2. Get the last message (the user's new question)
    const lastMessage = messages[messages.length - 1];
    console.log("📩 User Asked:", lastMessage.content);

    // 3. Get PDF Context
    const context = await getPdfText();

    // 4. Format the history for Gemini
    // We turn the previous messages into a script like: "User: Hi", "Bot: Hello"
    const historyText = messages.slice(0, -1).map(m => 
      `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`
    ).join("\n");

    const prompt = `
      You are an AI assistant for 'Unity Institute'. 
      Answer the question based strictly on the text below.
      
      --- PROSPECTUS DATA ---
      ${context}
      --- END DATA ---

      --- CONVERSATION HISTORY ---
      ${historyText}
      ----------------------------

      Student's New Question: ${lastMessage.content}
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