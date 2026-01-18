import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import { getUserStats, getStatsHistory } from "@/lib/stats";
import ConnectSteamForm from "./connect-steam-form";
import PerformanceChart from "./performance-chart";
import SkillRadarChart from "./skill-radar-chart";
import DisconnectSteamButton from "./disconnect-button";

export default async function StatsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [stats, history] = await Promise.all([
        getUserStats(user.id),
        getStatsHistory(user.id)
    ]);

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            My <span className="text-gradient-orange">Stats</span>
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            View your CS2 performance statistics and trends.
                        </p>
                    </div>
                    {stats && <DisconnectSteamButton />}
                </div>

                {!stats ? (
                    /* Connect Steam Card */
                    <ConnectSteamForm />
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "K/D Ratio", value: stats.kd_ratio?.toFixed(2) ?? "--" },
                                { label: "Win Rate", value: stats.win_rate ? `${stats.win_rate.toFixed(1)}%` : "--" },
                                { label: "Headshot %", value: stats.headshot_percentage ? `${stats.headshot_percentage.toFixed(1)}%` : "--" },
                                { label: "Total Matches", value: stats.matches_played },
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
                                <SkillRadarChart stats={stats} />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Total Kills", value: stats.total_kills },
                                { label: "Total Deaths", value: stats.total_deaths },
                                { label: "Total Wins", value: stats.total_wins },
                                { label: "Hours Played", value: stats.hours_played },
                            ].map((stat, index) => (
                                <div key={index} className="feature-card bg-[var(--cs2-surface)]/50">
                                    <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
