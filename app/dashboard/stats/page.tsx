import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserStats, getStatsHistory } from "@/lib/stats";
import StatsContent from "./stats-content";

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

    return <StatsContent stats={stats} history={history || []} />;
}
