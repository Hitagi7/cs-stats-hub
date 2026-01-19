import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
    id: string;
    steam_id: string | null;
    username: string | null;
    avatar_url: string | null;
    email: string | null;
    updated_at: string | null;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !profile) {
        console.error("Error fetching profile:", error);
        return null;
    }

    // Get user email from auth
    const { data: { user } } = await supabase.auth.getUser();

    return {
        ...profile,
        email: user?.email || null,
    } as UserProfile;
}

export async function updateProfile(
    userId: string,
    data: Partial<Pick<UserProfile, "username" | "avatar_url">>
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function syncSteamAvatar(userId: string, steamAvatarUrl: string): Promise<void> {
    const supabase = await createClient();

    await supabase
        .from("profiles")
        .update({
            avatar_url: steamAvatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
}
