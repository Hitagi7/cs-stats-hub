"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// SVG Icon Components
const ChartIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const TargetIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

const SwordsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const CrosshairIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v3m0 12v3M3 12h3m12 0h3" />
    </svg>
);

// Navigation Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const StatsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const AIIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

interface DashboardClientProps {
    user: User;
}

const statsData = [
    { label: "K/D Ratio", value: "--", icon: <ChartIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
    { label: "Win Rate", value: "--", icon: <TargetIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
    { label: "Matches", value: "--", icon: <SwordsIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
    { label: "Headshots", value: "--", icon: <CrosshairIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
];

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
    { label: "My Stats", href: "/dashboard/stats", icon: <StatsIcon /> },
    { label: "Favorites", href: "/dashboard/favorites", icon: <StarIcon /> },
    { label: "Search Player", href: "/dashboard/search", icon: <SearchIcon /> },
    { label: "AI Insights", href: "/dashboard/ai", icon: <AIIcon /> },
];

export default function DashboardClient({ user }: DashboardClientProps) {
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 h-screen glass border-r border-[var(--cs2-border)] flex flex-col z-50">
                {/* Logo */}
                <div className="p-6 border-b border-[var(--cs2-border)]">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gradient-orange">CS2</span>
                        <span className="text-2xl font-bold text-white">Stats</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                ? "bg-[var(--cs2-orange)] text-white"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--cs2-surface)] hover:text-white"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-[var(--cs2-border)]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center text-[var(--cs2-orange)] font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--cs2-surface)] hover:text-white transition-all"
                    >
                        <LogoutIcon />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
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
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Search Player */}
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)] flex flex-col">
                        <h2 className="text-xl font-semibold mb-4">Search Player</h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Look up any CS2 player by their Steam ID or profile URL.
                        </p>
                        <form className="flex gap-3 mt-auto">
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

                    {/* AI Chat Quick Access */}
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)] flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-[var(--ai-cyan)]">AI</span> Insights
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Ask questions about your gameplay and get personalized tips.
                        </p>
                        <Link href="/dashboard/ai" className="btn-secondary w-full block text-center mt-auto">
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
