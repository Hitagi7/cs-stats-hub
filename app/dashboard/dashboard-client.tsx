"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";

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

import { UserStats, EnrichedFavorite, StatsHistoryPoint } from "@/lib/stats";
import PerformanceChart from "./stats/performance-chart";

interface DashboardClientProps {
    user: User;
    stats: UserStats | null;
    favorites?: EnrichedFavorite[];
    history?: StatsHistoryPoint[];
}

export default function DashboardClient({ user, stats, favorites, history }: DashboardClientProps) {
    const statsData = [
        { label: "K/D Ratio", value: stats?.kd_ratio?.toFixed(2) || "--", icon: <ChartIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
        { label: "Win Rate", value: stats?.win_rate ? `${stats.win_rate}%` : "--", icon: <TargetIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
        { label: "Matches", value: stats?.matches_played || "--", icon: <SwordsIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
        { label: "Headshots", value: stats?.headshot_percentage ? `${stats.headshot_percentage}%` : "--", icon: <CrosshairIcon className="w-8 h-8 text-[var(--cs2-orange)]" /> },
    ];

    return (
        <>
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
                    <Link href="/dashboard/search" className="btn-primary whitespace-nowrap text-center mt-auto">
                        Go to Search
                    </Link>
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

            {/* Performance Trends */}
            <div className="mt-8">
                <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Performance Trends</h2>
                        <p className="text-xs text-[var(--text-muted)]">Last 30 Days Breakdown</p>
                    </div>
                    <PerformanceChart data={history || []} />
                </div>
            </div>

            {/* Favorites Widget */}
            <div className="mt-8">
                <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Favorite Players</h2>
                        <Link href="/dashboard/favorites" className="text-sm text-[var(--cs2-orange)] hover:text-white transition-colors">
                            View All
                        </Link>
                    </div>

                    {favorites && favorites.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.slice(0, 3).map((fav) => (
                                <Link
                                    key={fav.steam_id}
                                    href={`/player/${fav.steam_id}`}
                                    className="block group"
                                >
                                    <div className="bg-[var(--cs2-surface)] border border-[var(--cs2-border)] rounded-xl p-4 hover:border-[var(--cs2-orange)] transition-colors relative overflow-hidden">
                                        <div className="flex items-center gap-4">
                                            {fav.avatar_url ? (
                                                <img
                                                    src={fav.avatar_url}
                                                    alt={fav.nickname || fav.steam_id}
                                                    className="w-12 h-12 rounded-full border border-[var(--cs2-border)] group-hover:border-[var(--cs2-orange)] transition-colors"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#1a1b26] flex items-center justify-center text-[var(--cs2-orange)] font-bold border border-[var(--cs2-border)]">
                                                    {(fav.nickname || fav.steam_id).charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-white truncate group-hover:text-[var(--cs2-orange)] transition-colors">
                                                    {fav.nickname || `Player_${fav.steam_id.slice(-4)}`}
                                                </h3>
                                                <p className="text-xs text-[var(--text-muted)] truncate">
                                                    K/D: <span className="text-white">{fav.stats?.kd_ratio?.toFixed(2) || "--"}</span> • Win: <span className="text-white">{fav.stats?.win_rate ? `${fav.stats.win_rate.toFixed(0)}%` : "--"}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            <p className="mb-2">No favorite players yet</p>
                            <Link href="/dashboard/search" className="text-sm text-[var(--cs2-orange)] hover:underline">
                                Search for players to add
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
