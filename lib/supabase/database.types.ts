export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            match_history: {
                Row: {
                    assists: number | null
                    created_at: string | null
                    deaths: number | null
                    game_mode: string | null
                    headshots: number | null
                    id: string
                    kills: number | null
                    map_name: string | null
                    match_duration: number | null
                    match_id: string | null
                    mvp_count: number | null
                    played_at: string | null
                    result: string | null
                    score: number | null
                    steam_id: string
                }
                Insert: {
                    assists?: number | null
                    created_at?: string | null
                    deaths?: number | null
                    game_mode?: string | null
                    headshots?: number | null
                    id?: string
                    kills?: number | null
                    map_name?: string | null
                    match_duration?: number | null
                    match_id?: string | null
                    mvp_count?: number | null
                    played_at?: string | null
                    result?: string | null
                    score?: number | null
                    steam_id: string
                }
                Update: {
                    assists?: number | null
                    created_at?: string | null
                    deaths?: number | null
                    game_mode?: string | null
                    headshots?: number | null
                    id?: string
                    kills?: number | null
                    map_name?: string | null
                    match_duration?: number | null
                    match_id?: string | null
                    mvp_count?: number | null
                    played_at?: string | null
                    result?: string | null
                    score?: number | null
                    steam_id?: string
                }
            }
            player_stats: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    favorite_weapon: string | null
                    headshot_percentage: number | null
                    id: string
                    kd_ratio: number | null
                    last_updated: string | null
                    matches_played: number | null
                    steam_id: string
                    total_deaths: number | null
                    total_kills: number | null
                    total_losses: number | null
                    total_wins: number | null
                    username: string | null
                    win_rate: number | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    favorite_weapon?: string | null
                    headshot_percentage?: number | null
                    id?: string
                    kd_ratio?: number | null
                    last_updated?: string | null
                    matches_played?: number | null
                    steam_id: string
                    total_deaths?: number | null
                    total_kills?: number | null
                    total_losses?: number | null
                    total_wins?: number | null
                    username?: string | null
                    win_rate?: number | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    favorite_weapon?: string | null
                    headshot_percentage?: number | null
                    id?: string
                    kd_ratio?: number | null
                    last_updated?: string | null
                    matches_played?: number | null
                    steam_id?: string
                    total_deaths?: number | null
                    total_kills?: number | null
                    total_losses?: number | null
                    total_wins?: number | null
                    username?: string | null
                    win_rate?: number | null
                }
            }
            user_favorites: {
                Row: {
                    created_at: string | null
                    id: string
                    nickname: string | null
                    steam_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    nickname?: string | null
                    steam_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    nickname?: string | null
                    steam_id?: string
                    user_id?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
