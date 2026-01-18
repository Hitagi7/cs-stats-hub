import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import { getUserStats } from "@/lib/stats";
import ConnectSteamForm from "./connect-steam-form";

import DisconnectSteamButton from "./disconnect-button";

export default async function StatsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const stats = await getUserStats(user.id);

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
                                { label: "K/D Ratio", value: stats.kd_ratio ?? "--" },
                                { label: "Win Rate", value: stats.win_rate ? `${stats.win_rate}%` : "--" },
                                { label: "Headshot %", value: stats.headshot_percentage ? `${stats.headshot_percentage}%` : "--" },
                                { label: "Total Matches", value: stats.matches_played },
                            ].map((stat, index) => (
                                <div key={index} className="feature-card">
                                    <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
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

                        {/* Performance Chart Placeholder */}
                        <div className="mt-8 glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                            <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
                            <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">
                                <p>Detailed charts coming soon</p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
