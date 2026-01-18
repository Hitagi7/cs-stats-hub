"use server";

import { linkSteamAccount } from "@/lib/stats";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function connectSteamAction(prevState: any, formData: FormData) {
    const steamId = formData.get("steamId") as string;

    if (!steamId) {
        return { success: false, error: "Steam ID is required" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const result = await linkSteamAccount(user.id, steamId);

    if (result.success) {
        revalidatePath("/dashboard/stats");
        return { success: true };
    }

    return { success: false, error: result.error };
    return { success: false, error: result.error };
}

export async function disconnectSteamAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ steam_id: null, username: null, avatar_url: null })
        .eq("id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/stats");
    return { success: true };
}
