"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Sidebar from "@/app/components/sidebar";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-6 h-6 text-[var(--ai-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
);

const exampleQueries = [
    "What's my best weapon this month?",
    "How can I improve my clutch rate?",
    "What maps should I practice?",
    "Analyze my recent performance",
];

export default function AIClient({ user }: { user: User }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Simulate AI response (will be replaced with actual Gemini API)
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Thanks for your question about "${content.trim()}"! 

The Gemini AI integration is coming soon. Once connected, I'll be able to:

• Analyze your CS2 gameplay patterns
• Provide personalized improvement tips
• Compare your stats with pro players
• Suggest strategies based on your playstyle

Stay tuned for this exciting feature!`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setLoading(false);
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            <main className="flex-1 ml-64 flex flex-col h-screen">
                {/* Header */}
                <div className="p-6 border-b border-[var(--cs2-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--ai-cyan)] flex items-center justify-center">
                            <span className="text-white text-sm font-bold">AI</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                <span className="text-[var(--ai-cyan)]">AI</span> Insights
                            </h1>
                            <p className="text-sm text-[var(--text-muted)]">Powered by Google Gemini</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center mb-6">
                                <SparklesIcon />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Ask Me Anything About CS2</h2>
                            <p className="text-[var(--text-secondary)] max-w-md mb-8">
                                I can help you analyze your gameplay, suggest improvements, and answer questions about Counter-Strike 2.
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-w-lg">
                                {exampleQueries.map((query, index) => (
                                    <button
                                        key={index}
                                        onClick={() => sendMessage(query)}
                                        className="p-3 rounded-lg bg-[var(--cs2-surface)] text-left text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--cs2-surface-hover)] transition-colors border border-[var(--cs2-border)]"
                                    >
                                        {query}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-[var(--ai-cyan)] flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-bold">AI</span>
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === "user"
                                                ? "bg-[var(--cs2-orange)] text-white"
                                                : "bg-[var(--cs2-surface)] text-white border border-[var(--cs2-border)]"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center flex-shrink-0 text-[var(--cs2-orange)] font-bold text-sm">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--ai-cyan)] flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                    <div className="bg-[var(--cs2-surface)] rounded-2xl px-4 py-3 border border-[var(--cs2-border)]">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" />
                                            <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "0.1s" }} />
                                            <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--cs2-border)]">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your CS2 gameplay..."
                            className="search-input flex-1"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="btn-primary disabled:opacity-50 flex items-center gap-2"
                        >
                            <SendIcon />
                            Send
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
