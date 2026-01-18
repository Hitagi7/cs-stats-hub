import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";
import { getUserStats, getFavoritesWithStats } from "@/lib/stats";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [stats, favorites] = await Promise.all([
        getUserStats(user.id),
        getFavoritesWithStats(user.id)
    ]);

    return <DashboardClient user={user} stats={stats} favorites={favorites} />;
}
