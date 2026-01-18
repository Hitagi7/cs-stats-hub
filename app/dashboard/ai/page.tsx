import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AIClient from "./ai-client";
import { getUserStats, getFavoritesWithStats } from "@/lib/stats";

export default async function AIPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const stats = await getUserStats(user.id);
    const favorites = await getFavoritesWithStats(user.id);

    return <AIClient user={user} stats={stats} favorites={favorites} />;
}
