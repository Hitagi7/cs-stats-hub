"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

// SVG Icon Components
const ChartIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const TargetIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

const SwordsIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const CrosshairIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v3m0 12v3M3 12h3m12 0h3" />
    </svg>
);

interface DashboardClientProps {
    user: User;
}

const statsData = [
    { label: "K/D Ratio", value: "--", icon: <ChartIcon /> },
    { label: "Win Rate", value: "--", icon: <TargetIcon /> },
    { label: "Matches", value: "--", icon: <SwordsIcon /> },
    { label: "Headshots", value: "--", icon: <CrosshairIcon /> },
];

export default function DashboardClient({ user }: DashboardClientProps) {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen">
            {/* Dashboard Header */}
            <header className="nav-blur border-b border-[var(--cs2-border)] sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gradient-orange">CS2</span>
                        <span className="text-2xl font-bold text-white">Stats Hub</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/dashboard"
                            className="text-white font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/stats"
                            className="text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            My Stats
                        </Link>
                        <Link
                            href="/dashboard/favorites"
                            className="text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            Favorites
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[var(--text-secondary)] text-sm hidden sm:block">
                            {user.email}
                        </span>
                        <button onClick={handleSignOut} className="btn-secondary">
                            Sign Out
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, <span className="text-gradient-orange">{user.email?.split("@")[0]}</span>
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Track your CS2 performance and get AI-powered insights.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="feature-card text-center"
                        >
                            <div className="flex justify-center mb-3">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Search Player */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                            <h2 className="text-xl font-semibold mb-4">Search Player</h2>
                            <form className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter Steam ID or Profile URL"
                                    className="search-input flex-1"
                                />
                                <button type="submit" className="btn-primary whitespace-nowrap">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* AI Chat Quick Access */}
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-[var(--ai-cyan)]">AI</span> Insights
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Ask questions about your gameplay and get personalized tips.
                        </p>
                        <Link href="/dashboard/ai" className="btn-secondary w-full block text-center">
                            Open AI Chat
                        </Link>
                    </div>
                </div>

                {/* Recent Matches Placeholder */}
                <div className="mt-8">
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                        <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            <p className="mb-2">No matches found</p>
                            <p className="text-sm">Connect your Steam account to see your match history.</p>
                        </div>
                    </div>
                </div>

                {/* Favorites Placeholder */}
                <div className="mt-8">
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                        <h2 className="text-xl font-semibold mb-4">Favorite Players</h2>
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            <p className="mb-2">No favorite players yet</p>
                            <p className="text-sm">Search for players and add them to your favorites.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
