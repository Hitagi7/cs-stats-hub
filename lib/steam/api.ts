/**
 * Steam Web API Integration
 * 
 * This module handles fetching player data from Steam API.
 * CS2/CS:GO uses appid 730
 */

const STEAM_API_BASE = "https://api.steampowered.com";
const CS2_APP_ID = 730;

interface SteamPlayerSummary {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personastate: number;
    communityvisibilitystate: number;
    profilestate?: number;
    lastlogoff?: number;
    commentpermission?: number;
    realname?: string;
    primaryclanid?: string;
    timecreated?: number;
    gameid?: string;
    gameserverip?: string;
    gameextrainfo?: string;
    loccountrycode?: string;
    locstatecode?: string;
    loccityid?: number;
}

interface SteamUserStats {
    steamID: string;
    gameName: string;
    stats: Array<{
        name: string;
        value: number;
    }>;
    achievements?: Array<{
        name: string;
        achieved: number;
    }>;
}

interface ParsedCS2Stats {
    total_kills: number;
    total_deaths: number;
    total_wins: number;
    total_round_wins: number;
    total_rounds_played: number;
    total_matches_played: number;
    total_headshots: number;
    total_shots_fired: number;
    total_shots_hit: number;
    total_mvps: number;
    hours_played: number;
    kd_ratio: number;
    win_rate: number;
    headshot_percentage: number;
    accuracy: number;
}

/**
 * Get Steam API key from environment
 */
function getApiKey(): string {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
        throw new Error("STEAM_API_KEY environment variable is not set");
    }
    return apiKey;
}

/**
 * Resolve vanity URL to Steam64 ID
 */
export async function resolveVanityUrl(vanityUrl: string): Promise<string | null> {
    try {
        const apiKey = getApiKey();
        const response = await fetch(
            `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${vanityUrl}`
        );
        const data = await response.json();

        if (data.response?.success === 1) {
            return data.response.steamid;
        }
        return null;
    } catch (error) {
        console.error("Error resolving vanity URL:", error);
        return null;
    }
}

/**
 * Get player summary (profile info)
 */
export async function getPlayerSummary(steamId: string): Promise<SteamPlayerSummary | null> {
    try {
        const apiKey = getApiKey();
        const response = await fetch(
            `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
        );
        const data = await response.json();

        if (data.response?.players?.length > 0) {
            return data.response.players[0];
        }
        return null;
    } catch (error) {
        console.error("Error fetching player summary:", error);
        return null;
    }
}

/**
 * Get CS2 stats for a player
 */
export async function getCS2Stats(steamId: string): Promise<SteamUserStats | null> {
    try {
        const apiKey = getApiKey();
        const response = await fetch(
            `${STEAM_API_BASE}/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${CS2_APP_ID}&key=${apiKey}&steamid=${steamId}`
        );

        if (!response.ok) {
            console.error("Steam API returned:", response.status);
            return null;
        }

        const data = await response.json();

        if (data.playerstats) {
            return data.playerstats;
        }
        return null;
    } catch (error) {
        console.error("Error fetching CS2 stats:", error);
        return null;
    }
}

/**
 * Parse raw Steam stats into usable format
 */
export function parseCS2Stats(rawStats: SteamUserStats): ParsedCS2Stats {
    const statsMap = new Map<string, number>();

    for (const stat of rawStats.stats || []) {
        statsMap.set(stat.name, stat.value);
    }

    const totalKills = statsMap.get("total_kills") || 0;
    const totalDeaths = statsMap.get("total_deaths") || 0;
    const totalRoundWins = statsMap.get("total_wins") || 0; // This is ROUND wins
    const totalMatchesWon = statsMap.get("total_matches_won") || 0; // This is MATCH wins
    const totalRoundsPlayed = statsMap.get("total_rounds_played") || 0;
    const totalMatchesPlayed = statsMap.get("total_matches_played") || 0;
    const totalHeadshots = statsMap.get("total_kills_headshot") || 0;
    const totalShotsFired = statsMap.get("total_shots_fired") || 0;
    const totalShotsHit = statsMap.get("total_shots_hit") || 0;
    const totalMvps = statsMap.get("total_mvps") || 0;
    const totalTimePlayed = statsMap.get("total_time_played") || 0; // In seconds

    // Calculate derived stats
    const kdRatio = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
    // Use match wins for win rate (not round wins)
    const winRate = totalMatchesPlayed > 0 ? (totalMatchesWon / totalMatchesPlayed) * 100 : 0;
    const headshotPercentage = totalKills > 0 ? (totalHeadshots / totalKills) * 100 : 0;
    const accuracy = totalShotsFired > 0 ? (totalShotsHit / totalShotsFired) * 100 : 0;
    const hoursPlayed = Math.round(totalTimePlayed / 3600); // Convert seconds to hours

    return {
        total_kills: totalKills,
        total_deaths: totalDeaths,
        total_wins: totalMatchesWon, // Use match wins, not round wins
        total_round_wins: totalRoundWins,
        total_rounds_played: totalRoundsPlayed,
        total_matches_played: totalMatchesPlayed,
        total_headshots: totalHeadshots,
        total_shots_fired: totalShotsFired,
        total_shots_hit: totalShotsHit,
        total_mvps: totalMvps,
        hours_played: hoursPlayed,
        kd_ratio: Math.round(kdRatio * 100) / 100,
        win_rate: Math.round(winRate * 10) / 10,
        headshot_percentage: Math.round(headshotPercentage * 10) / 10,
        accuracy: Math.round(accuracy * 10) / 10,
    };
}

/**
 * Extract Steam ID from various formats
 * Supports: Steam64 ID, vanity URL, full profile URL
 */
export async function extractSteamId(input: string): Promise<string | null> {
    const trimmed = input.trim();

    // Already a Steam64 ID (17 digits starting with 7656)
    if (/^7656\d{13}$/.test(trimmed)) {
        return trimmed;
    }

    // Full profile URL with ID
    const idMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d+)/);
    if (idMatch) {
        return idMatch[1];
    }

    // Full profile URL with vanity
    const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^\/\s]+)/);
    if (vanityMatch) {
        return await resolveVanityUrl(vanityMatch[1]);
    }

    // Just a vanity name (no slashes, not all digits)
    if (!/\//.test(trimmed) && !/^\d+$/.test(trimmed)) {
        return await resolveVanityUrl(trimmed);
    }

    return null;
}

/**
 * Get full player data (profile + stats)
 */
export async function getFullPlayerData(steamIdOrUrl: string) {
    // Extract Steam ID from input
    const steamId = await extractSteamId(steamIdOrUrl);

    if (!steamId) {
        return {
            success: false,
            error: "Could not resolve Steam ID. Please enter a valid Steam64 ID, vanity URL, or profile URL.",
        };
    }

    // Fetch profile and stats in parallel
    const [profile, rawStats] = await Promise.all([
        getPlayerSummary(steamId),
        getCS2Stats(steamId),
    ]);

    if (!profile) {
        return {
            success: false,
            error: "Player not found or profile is private.",
        };
    }

    const stats = rawStats ? parseCS2Stats(rawStats) : null;

    return {
        success: true,
        data: {
            steam_id: steamId,
            username: profile.personaname,
            avatar_url: profile.avatarfull,
            profile_url: profile.profileurl,
            personastate: profile.personastate,
            kd_ratio: stats?.kd_ratio ?? null,
            win_rate: stats?.win_rate ?? null,
            headshot_percentage: stats?.headshot_percentage ?? null,
            matches_played: stats?.total_matches_played ?? null,
            total_kills: stats?.total_kills ?? null,
            total_deaths: stats?.total_deaths ?? null,
            total_wins: stats?.total_wins ?? null,
            total_losses: stats ? stats.total_matches_played - stats.total_wins : null,
            total_mvps: stats?.total_mvps ?? null,
            accuracy: stats?.accuracy ?? null,
            hours_played: stats?.hours_played ?? null,
            has_cs2_stats: !!stats,
        },
    };
}
