import { User } from "@supabase/supabase-js";
import ChatInterface from "./chat-interface";
import { UserStats, EnrichedFavorite } from "@/lib/stats";

export default function AIClient({ user, stats, favorites }: { user: User; stats: UserStats | null, favorites: EnrichedFavorite[] }) {
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    <span className="text-gradient-cyan">AI</span> Insights
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Your personal CS2 stats analyst powered by Gemini.
                </p>
            </div>

            {/* Chat Interface */}
            <ChatInterface statsContext={stats} favoritesContext={favorites} />
        </>
    );
}
