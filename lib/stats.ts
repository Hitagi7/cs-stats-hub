import { createClient } from "@/lib/supabase/server";
import { getFullPlayerData } from "@/lib/steam/api";

export interface UserStats {
    steam_id: string;
    username: string;
    avatar_url: string;
    kd_ratio: number | null;
    win_rate: number | null;
    headshot_percentage: number | null;
    matches_played: number;
    total_kills: number;
    total_deaths: number;
    total_wins: number;
    total_losses: number;
    total_mvps: number;
    hours_played: number;
    last_updated: string;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
    const supabase = await createClient();

    // 1. Get user's linked Steam ID
    const { data: profile } = await supabase
        .from("profiles")
        .select("steam_id")
        .eq("id", userId)
        .single();

    if (!profile?.steam_id) {
        return null;
    }

    const outputSteamId = profile.steam_id;

    // 2. Check cache in player_stats
    const { data: cachedStats } = await supabase
        .from("player_stats")
        .select("*")
        .eq("steam_id", outputSteamId)
        .single();

    const now = new Date();
    const CACHE_DURATION_HOURS = 1;

    let isCacheValid = false;
    if (cachedStats?.last_updated) {
        const lastUpdated = new Date(cachedStats.last_updated);
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        isCacheValid = hoursDiff < CACHE_DURATION_HOURS;
    }

    if (isCacheValid) {
        return cachedStats as UserStats;
    }

    // 3. Cache miss or stale: Fetch from Steam API
    // Ensure API Key exists
    if (!process.env.STEAM_API_KEY) {
        return cachedStats || null; // Return stale if no key
    }

    const { success, data: steamData, error } = await getFullPlayerData(outputSteamId);

    if (!success || !steamData) {
        console.error("Failed to refresh stats:", error);
        return cachedStats || null;
    }

    // 4. Update Cache
    const statsPayload = {
        steam_id: steamData.steam_id,
        username: steamData.username,
        avatar_url: steamData.avatar_url,
        kd_ratio: steamData.kd_ratio,
        win_rate: steamData.win_rate,
        headshot_percentage: steamData.headshot_percentage,
        matches_played: steamData.matches_played || 0,
        total_kills: steamData.total_kills || 0,
        total_deaths: steamData.total_deaths || 0,
        total_wins: steamData.total_wins || 0,
        total_losses: steamData.total_losses || 0,
        total_mvps: steamData.total_mvps || 0,
        hours_played: steamData.hours_played || 0,
        last_updated: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
        .from("player_stats")
        .upsert(statsPayload, { onConflict: "steam_id" });

    if (upsertError) {
        console.error("Failed to cache stats:", JSON.stringify(upsertError, null, 2));
    }

    return statsPayload as UserStats;
}

export async function linkSteamAccount(userId: string, steamIdOrUrl: string) {
    const supabase = await createClient();

    // Validate ID first
    const { success, data } = await getFullPlayerData(steamIdOrUrl);
    if (!success || !data) {
        return { success: false, error: "Invalid Steam ID or Profile URL" };
    }

    // Upsert into profiles
    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: userId,
            steam_id: data.steam_id, // Store the resolved 64-bit ID
            username: data.username,
            avatar_url: data.avatar_url,
            updated_at: new Date().toISOString()
        });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, steamId: data.steam_id };
}

export interface EnrichedFavorite {
    id: string;
    steam_id: string;
    nickname: string | null;
    avatar_url: string | null;
    created_at: string;
    stats: UserStats | null;
}

export async function getFavoritesWithStats(userId: string): Promise<EnrichedFavorite[]> {
    const supabase = await createClient();

    // 1. Get user's favorites
    const { data: favorites } = await supabase
        .from("user_favorites")
        .select("*")
        .order("created_at", { ascending: false });

    if (!favorites || favorites.length === 0) {
        return [];
    }

    const steamIds = favorites.map(f => f.steam_id);

    // 2. Get cached stats
    const { data: cachedStatsList } = await supabase
        .from("player_stats")
        .select("*")
        .in("steam_id", steamIds);

    const statsMap = new Map<string, UserStats>();
    if (cachedStatsList) {
        cachedStatsList.forEach(s => statsMap.set(s.steam_id, s as UserStats));
    }

    // 3. Identify missing stats and fetch if needed
    // Limit parallel fetching to avoid rate limits
    const missingStatsIds = steamIds.filter(id => !statsMap.has(id));

    // Only attempt to fetch if we have an API key
    if (missingStatsIds.length > 0 && process.env.STEAM_API_KEY) {
        const fetchPromises = missingStatsIds.map(async (steamId) => {
            const { success, data } = await getFullPlayerData(steamId);
            if (success && data) {
                // Prepare stats object
                const statsPayload = {
                    steam_id: data.steam_id,
                    username: data.username,
                    avatar_url: data.avatar_url,
                    kd_ratio: data.kd_ratio,
                    win_rate: data.win_rate,
                    headshot_percentage: data.headshot_percentage,
                    matches_played: data.matches_played || 0,
                    total_kills: data.total_kills || 0,
                    total_deaths: data.total_deaths || 0,
                    total_wins: data.total_wins || 0,
                    total_losses: data.total_losses || 0,
                    total_mvps: data.total_mvps || 0,
                    hours_played: data.hours_played || 0,
                    last_updated: new Date().toISOString(),
                };

                // Cache it
                await supabase.from("player_stats").upsert(statsPayload, { onConflict: "steam_id" });

                return statsPayload as UserStats;
            }
            return null;
        });

        const fetchedResults = await Promise.all(fetchPromises);
        fetchedResults.forEach(r => {
            if (r) statsMap.set(r.steam_id, r);
        });
    }

    // 4. Return enriched favorites
    return favorites.map(f => ({
        ...f,
        stats: statsMap.get(f.steam_id) || null
    }));
}
