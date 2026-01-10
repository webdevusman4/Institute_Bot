'use client';

import { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How are you?", sender: "other", time: "10:00 AM" },
        { id: 2, text: "I'm doing well, thank you! How about yourself?", sender: "me", time: "10:01 AM" },
        { id: 3, text: "I'm great, just working on a new project.", sender: "other", time: "10:02 AM" },
        { id: 4, text: "That sounds exciting! What kind of project?", sender: "me", time: "10:03 AM" },
        { id: 5, text: "It's a chat application built with Next.js and Tailwind.", sender: "other", time: "10:04 AM" },
        { id: 6, text: "Wow, sounds cool! Can't wait to see it.", sender: "me", time: "10:05 AM" },
        { id: 7, text: "This interface looks pretty clean right?", sender: "other", time: "10:06 AM" },
        { id: 8, text: "Yes, very WhatsApp-like!", sender: "me", time: "10:07 AM" },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (inputText.trim() && !isLoading) {
            const userMessage = {
                id: messages.length + 1,
                text: inputText,
                sender: "me",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, userMessage]);
            setInputText("");
            setIsLoading(true);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: userMessage.text }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(prev => [...prev, {
                        id: prev.length + 1,
                        text: data.reply,
                        sender: "other",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                } else {
                    console.error("Failed to fetch reply");
                }
            } catch (error) {
                console.error("Error sending message:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            {/* Header */}
            <div className="bg-[#008069] p-4 text-white shadow-md flex items-center z-10">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center overflow-hidden">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </div>
                <div>
                    <h1 className="font-bold text-lg">Contact Name</h1>
                    <p className="text-xs text-gray-200">{isLoading ? 'Typing...' : 'Online'}</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ded8]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: 'overlay' }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-2 px-3 shadow-sm relative ${msg.sender === 'me'
                                    ? 'bg-[#d9fdd3] rounded-tr-none'
                                    : 'bg-white rounded-tl-none'
                                }`}
                        >
                            <p className="text-gray-800 text-sm leading-relaxed">{msg.text}</p>
                            <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-gray-500' : 'text-gray-500'}`}>
                                {msg.time}
                                {msg.sender === 'me' && <span className="ml-1 text-blue-500">✓✓</span>}
                            </span>

                            {/* Triangle/Tail for the bubble */}
                            <div className={`absolute top-0 w-0 h-0 border-[8px] border-solid border-transparent ${msg.sender === 'me'
                                    ? 'right-[-8px] border-t-[#d9fdd3] border-l-[#d9fdd3]'
                                    : 'left-[-8px] border-t-white border-r-white'
                                }`}></div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3 flex items-center shadow-inner">
                <button 
                    suppressHydrationWarning={true}
                    className="text-gray-500 mr-3 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
                <button 
                    suppressHydrationWarning={true}
                    className="text-gray-500 mr-3 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                </button>
                <div className="flex-1 bg-white rounded-full px-4 py-2 border border-gray-300 focus-within:ring-2 focus-within:ring-[#00a884]">
                    <input
                        suppressHydrationWarning={true}
                        type="text"
                        className="w-full focus:outline-none text-gray-700 bg-transparent"
                        placeholder="Type a message"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button
                    suppressHydrationWarning={true}
                    className={`ml-3 p-2 rounded-full ${inputText.trim() ? 'bg-[#008069] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                    onClick={handleSend}
                >
                    {inputText.trim() ? (
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;