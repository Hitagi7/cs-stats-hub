import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface PlayerPageProps {
    params: Promise<{ steamId: string }>;
}

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

const CrosshairIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v3m0 12v3M3 12h3m12 0h3" />
    </svg>
);

const SwordsIcon = () => (
    <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

export default async function PlayerPage({ params }: PlayerPageProps) {
    const { steamId } = await params;
    const supabase = await createClient();

    // Fetch player stats from database
    const { data: player } = await supabase
        .from("player_stats")
        .select("*")
        .eq("steam_id", steamId)
        .single();

    // Fetch match history
    const { data: matches } = await supabase
        .from("match_history")
        .select("*")
        .eq("steam_id", steamId)
        .order("played_at", { ascending: false })
        .limit(10);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="nav-blur border-b border-[var(--cs2-border)] sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/search"
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon />
                            <span>Back</span>
                        </Link>
                    </div>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gradient-orange">CS2</span>
                        <span className="text-2xl font-bold text-white">Stats Hub</span>
                    </Link>
                    <div className="w-20" />
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Player Header */}
                <div className="glass rounded-2xl p-8 border border-[var(--cs2-border)] mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center text-4xl font-bold text-[var(--cs2-orange)]">
                            {player?.username?.charAt(0).toUpperCase() || "P"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {player?.username || `Player_${steamId.slice(-4)}`}
                            </h1>
                            <p className="text-[var(--text-muted)]">Steam ID: {steamId}</p>
                            {player?.last_updated && (
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                    Last updated: {new Date(player.last_updated).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="feature-card text-center">
                        <div className="flex justify-center mb-3"><ChartIcon /></div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {player?.kd_ratio?.toFixed(2) || "--"}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm">K/D Ratio</p>
                    </div>
                    <div className="feature-card text-center">
                        <div className="flex justify-center mb-3"><TargetIcon /></div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {player?.win_rate ? `${player.win_rate.toFixed(1)}%` : "--"}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm">Win Rate</p>
                    </div>
                    <div className="feature-card text-center">
                        <div className="flex justify-center mb-3"><CrosshairIcon /></div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {player?.headshot_percentage ? `${player.headshot_percentage.toFixed(1)}%` : "--"}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm">Headshot %</p>
                    </div>
                    <div className="feature-card text-center">
                        <div className="flex justify-center mb-3"><SwordsIcon /></div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {player?.matches_played || "--"}
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm">Matches Played</p>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Kill/Death Stats */}
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                        <h2 className="text-xl font-semibold mb-4">Combat Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Total Kills</span>
                                <span className="font-semibold text-white">{player?.total_kills || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Total Deaths</span>
                                <span className="font-semibold text-white">{player?.total_deaths || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Favorite Weapon</span>
                                <span className="font-semibold text-white">{player?.favorite_weapon || "--"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Win/Loss Stats */}
                    <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                        <h2 className="text-xl font-semibold mb-4">Match Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Total Wins</span>
                                <span className="font-semibold text-green-400">{player?.total_wins || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Total Losses</span>
                                <span className="font-semibold text-red-400">{player?.total_losses || "--"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--cs2-border)]">
                                <span className="text-[var(--text-secondary)]">Matches Played</span>
                                <span className="font-semibold text-white">{player?.matches_played || "--"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match History */}
                <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                    <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
                    {matches && matches.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[var(--text-secondary)] text-sm">
                                        <th className="pb-4">Map</th>
                                        <th className="pb-4">Result</th>
                                        <th className="pb-4">K/D/A</th>
                                        <th className="pb-4">Score</th>
                                        <th className="pb-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map((match) => (
                                        <tr key={match.id} className="border-t border-[var(--cs2-border)]">
                                            <td className="py-3 text-white">{match.map_name || "Unknown"}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${match.result === "win"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : match.result === "loss"
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                >
                                                    {match.result?.toUpperCase() || "N/A"}
                                                </span>
                                            </td>
                                            <td className="py-3 text-white">
                                                {match.kills}/{match.deaths}/{match.assists}
                                            </td>
                                            <td className="py-3 text-white">{match.score || "--"}</td>
                                            <td className="py-3 text-[var(--text-muted)]">
                                                {match.played_at
                                                    ? new Date(match.played_at).toLocaleDateString()
                                                    : "--"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            <p className="mb-2">No match history available</p>
                            <p className="text-sm">Match data will appear once Steam API is integrated.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
