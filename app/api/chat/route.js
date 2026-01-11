import Groq from "groq-sdk";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

// 1. Setup Groq with the key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let cachedPdfText = "";

async function getPdfText() {
  if (cachedPdfText) return cachedPdfText;
  try {
    const filePath = path.join(process.cwd(), "docs", "data.pdf");
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const fullText = docs.map(doc => doc.pageContent).join("\n");

    // --- NEW LOGIC: LINE LIMITER ---
    // 1. Split the text into an array of lines
    const lines = fullText.split('\n');

    // 2. Check if it's too long
    console.log(`📄 PDF Total Lines: ${lines.length}`);

    // 3. Take only the first 500 lines (or less if the file is short)
    const selectedLines = lines.slice(0, 500).join('\n');

    cachedPdfText = selectedLines;
    console.log("✅ Loaded Context: 500 Lines");
    
    return cachedPdfText;
  } catch (error) {
    console.error("❌ PDF Read Error:", error.message);
    return ""; 
  }
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const context = await getPdfText();

    // 2. Prepare the System Prompt (The Brain Instructions)
    const systemPrompt = `
      You are an AI assistant for 'Unity Institute'. 
      Answer the question based strictly on the text below.
      
      --- PROSPECTUS DATA ---
      ${context}
      --- END DATA ---
      
      If the answer is not in the data, say "I don't have that information in the prospectus."
      Keep your answers helpful, professional, and concise.
    `;

    // 3. Format History for Groq 
    // We put the System Prompt first, then the chat history
    const conversation = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // 4. Ask Groq (Using Llama 3 70B)
    const chatCompletion = await groq.chat.completions.create({
      messages: conversation,
      model: "llama-3.3-70b-versatile", 
      temperature: 0.5,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return Response.json({ reply });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return Response.json({ reply: "I'm having trouble connecting to Groq right now." });
  }
}