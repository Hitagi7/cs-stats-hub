import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/sidebar";

export default async function StatsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        My <span className="text-gradient-orange">Stats</span>
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        View your CS2 performance statistics and trends.
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "K/D Ratio", value: "--", change: null },
                        { label: "Win Rate", value: "--", change: null },
                        { label: "Headshot %", value: "--", change: null },
                        { label: "Total Matches", value: "--", change: null },
                    ].map((stat, index) => (
                        <div key={index} className="feature-card">
                            <p className="text-[var(--text-secondary)] text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Connect Steam Card */}
                <div className="glass rounded-2xl p-8 border border-[var(--cs2-border)] text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Connect Your Steam Account</h2>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                        Link your Steam account to automatically track your CS2 statistics and get personalized insights.
                    </p>
                    <button className="btn-primary">
                        Connect Steam
                    </button>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="mt-8 glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                    <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
                    <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">
                        <p>Chart will appear after connecting your Steam account</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
