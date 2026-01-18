"use client";

import { useState, useRef, useEffect } from "react";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "ai";
    content: string;
}

import { EnrichedFavorite } from "@/lib/stats";

interface ChatInterfaceProps {
    statsContext?: any;
    favoritesContext?: EnrichedFavorite[];
}

export default function ChatInterface({ statsContext, favoritesContext }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize messages from localStorage or default
    useEffect(() => {
        const saved = localStorage.getItem("cs2_ai_chat_history");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history");
                setDefaultMessages();
            }
        } else {
            setDefaultMessages();
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("cs2_ai_chat_history", JSON.stringify(messages));
        }
    }, [messages]);

    const setDefaultMessages = () => {
        setMessages([
            {
                role: "ai",
                content: "Hello! I'm your CS2 AI Coach. I can analyze your stats, compare you with your favorite professionals, or answer general questions about the game. How can I help you today?"
            }
        ]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage = { role: "user" as const, content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text,
                    statsContext,
                    favoritesContext,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: "ai", content: data.data }
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "ai", content: "Sorry, I encountered an error analyzing your request. Please try again." }
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Network error. Please check your connection and try again." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedPrompts = [
        "Analyze my overall performance",
        "How can I improve my K/D ratio?",
        "What maps should I focus on?",
        "Explain CS2 economy basics"
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] glass rounded-2xl border border-[var(--cs2-border)] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-[var(--cs2-border)] bg-[var(--cs2-surface)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--cs2-orange)] flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-bold text-white">AI Coach</h2>
                        <p className="text-xs text-[var(--text-muted)]">Powered by Gemini 2.0</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem("cs2_ai_chat_history");
                        setDefaultMessages();
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    Clear History
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user"
                                ? "bg-[var(--cs2-orange)] text-white"
                                : "bg-[var(--cs2-surface)] border border-[var(--cs2-border)] text-[var(--text-secondary)]"
                                }`}
                        >
                            {msg.role === "ai" ? (
                                <div className="prose prose-invert max-w-none text-sm">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkBreaks, remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed whitespace-pre-wrap" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="mb-4 list-disc pl-4 space-y-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="mb-4 list-decimal pl-4 space-y-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[var(--cs2-surface)] border border-[var(--cs2-border)] rounded-2xl p-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--cs2-orange)] rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-[var(--cs2-orange)] rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-[var(--cs2-orange)] rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--cs2-border)] bg-[#0a0a0f]">
                {/* Suggested Prompts */}
                {messages.length === 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(prompt)}
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--cs2-surface)] border border-[var(--cs2-border)] text-sm text-[var(--text-secondary)] hover:border-[var(--cs2-orange)] hover:text-[var(--cs2-orange)] transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                        placeholder="Ask your AI coach..."
                        disabled={isLoading}
                        className="flex-1 bg-[var(--cs2-surface)] border border-[var(--cs2-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--cs2-orange)] transition-colors disabled:opacity-50"
                    />
                    <button
                        onClick={() => handleSendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary rounded-xl px-6"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
