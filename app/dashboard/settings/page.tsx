import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile";
import { getUserStats } from "@/lib/stats";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [profile, stats] = await Promise.all([
        getProfile(user.id),
        getUserStats(user.id),
    ]);

    return (
        <div className="flex items-start justify-center pt-4">
            <div className="w-full max-w-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage your account and preferences
                    </p>
                </div>

                <SettingsClient
                    user={user}
                    profile={profile}
                    steamConnected={!!stats}
                    steamUsername={stats?.username || null}
                    steamAvatarUrl={stats?.avatar_url || null}
                />
            </div>
        </div>
    );
}
