'use client';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat() {
  const defaultMessage = { role: 'assistant', content: 'Hello! I am the Unity AI. Ask me anything about the prospectus.' };
  
  const [messages, setMessages] = useState([defaultMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) { 
      localStorage.setItem('chat_history', JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem('chat_history');
    setMessages([defaultMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50 border-x border-gray-200">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
        <span className="font-bold">Unity Institute AI</span>
        <button 
          onClick={clearHistory}
          className="text-xs bg-blue-700 px-2 py-1 rounded hover:bg-blue-800"
          suppressHydrationWarning={true} 
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[85%] text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white ml-auto rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 mr-auto rounded-bl-none shadow-sm'
            }`}
          >
            {/* THIS IS THE NEW PART: MARKDOWN RENDERER */}
            {msg.role === 'assistant' ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-blue-800" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-400 text-xs ml-2 animate-pulse">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about fees, courses..."
            suppressHydrationWarning={true}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            suppressHydrationWarning={true}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}