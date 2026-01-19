import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserStats } from "@/lib/stats";
import Sidebar from "@/app/components/sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user stats to get Steam avatar
    const stats = await getUserStats(user.id);

    return (
        <div className="min-h-screen bg-[var(--cs2-bg)]">
            <Sidebar
                user={user}
                avatarUrl={stats?.avatar_url}
                username={stats?.username}
            />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
