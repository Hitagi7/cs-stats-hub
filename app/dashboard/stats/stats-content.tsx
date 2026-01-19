"use client";

import { UserStats, StatsHistoryPoint } from "@/lib/stats";
import { useRealtimeStats } from "@/lib/hooks/useRealtimeStats";
import PerformanceChart from "./performance-chart";
import SkillRadarChart from "./skill-radar-chart";
import DisconnectSteamButton from "./disconnect-button";
import ConnectSteamForm from "./connect-steam-form";

interface StatsContentProps {
    stats: UserStats | null;
    history: StatsHistoryPoint[];
}

export default function StatsContent({ stats, history }: StatsContentProps) {
    // Subscribe to realtime stats updates
    const liveStats = useRealtimeStats(stats);

    return (
        <>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        My <span className="text-gradient-orange">Stats</span>
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        View your CS2 performance statistics and trends.
                    </p>
                </div>
                {liveStats && <DisconnectSteamButton />}
            </div>

            {!liveStats ? (
                /* Connect Steam Card */
                <ConnectSteamForm />
            ) : (
                <>
                    {/* Stats Overview */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "K/D Ratio", value: liveStats.kd_ratio?.toFixed(2) ?? "--" },
                            { label: "Win Rate", value: liveStats.win_rate ? `${liveStats.win_rate.toFixed(1)}%` : "--" },
                            { label: "Headshot %", value: liveStats.headshot_percentage ? `${liveStats.headshot_percentage.toFixed(1)}%` : "--" },
                            { label: "Total Matches", value: liveStats.matches_played },
                        ].map((stat, index) => (
                            <div key={index} className="feature-card">
                                <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {/* Performance Chart */}
                        <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Performance Trends</h2>
                                <p className="text-xs text-[var(--text-muted)]">Last 30 Days</p>
                            </div>
                            <PerformanceChart data={history || []} />
                        </div>

                        {/* Skill Radar */}
                        <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                            <h2 className="text-xl font-semibold mb-6">Skill Analysis</h2>
                            <SkillRadarChart stats={liveStats} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Kills", value: liveStats.total_kills },
                            { label: "Total Deaths", value: liveStats.total_deaths },
                            { label: "Total Wins", value: liveStats.total_wins },
                            { label: "Hours Played", value: liveStats.hours_played },
                        ].map((stat, index) => (
                            <div key={index} className="feature-card bg-[var(--cs2-surface)]/50">
                                <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
