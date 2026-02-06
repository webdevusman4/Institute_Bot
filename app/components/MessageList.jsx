"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function MessageList({ messages, isLoading }) {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`
            max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm relative animate-fade-in
            ${msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none shadow-primary/20"
                            : "bg-card border border-border text-card-foreground rounded-bl-none"}
          `}>
                        <ReactMarkdown
                            components={{
                                strong: ({ node, ...props }) => <span className={`font-bold ${msg.role === 'user' ? 'text-white' : 'text-primary'}`} {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 my-2 space-y-1" {...props} />,
                                code: ({ node, ...props }) => <code className={`px-1 py-0.5 rounded font-mono text-sm ${msg.role === 'user' ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`} {...props} />
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-start animate-fade-in">
                    <div className="p-4 rounded-2xl rounded-bl-none border flex items-center gap-2
            bg-card border-border">
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            )}
            <div ref={endRef} />
        </div>
    );
}
