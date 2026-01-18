"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Sidebar from "@/app/components/sidebar";

interface Favorite {
    id: string;
    steam_id: string;
    nickname: string | null;
    created_at: string;
}

const StarFilledIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export default function FavoritesPage({ user }: { user: User }) {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        const { data, error } = await supabase
            .from("user_favorites")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setFavorites(data);
        }
        setLoading(false);
    };

    const removeFavorite = async (steamId: string) => {
        const { error } = await supabase
            .from("user_favorites")
            .delete()
            .eq("steam_id", steamId);

        if (!error) {
            setFavorites(favorites.filter((f) => f.steam_id !== steamId));
        }
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-gradient-orange">Favorite</span> Players
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Track your favorite CS2 players and monitor their stats.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="feature-card animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--cs2-surface)]" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-[var(--cs2-surface)] rounded w-24 mb-2" />
                                        <div className="h-3 bg-[var(--cs2-surface)] rounded w-32" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="glass rounded-2xl p-8 border border-[var(--cs2-border)] text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center mx-auto mb-4">
                            <StarFilledIcon />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
                        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                            Search for players and add them to your favorites to quickly access their stats.
                        </p>
                        <a href="/dashboard/search" className="btn-primary inline-block">
                            Search Players
                        </a>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="feature-card group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center text-[var(--cs2-orange)] font-bold">
                                            {favorite.nickname?.charAt(0).toUpperCase() || "P"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">
                                                {favorite.nickname || `Player`}
                                            </p>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                {favorite.steam_id}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFavorite(favorite.steam_id)}
                                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove from favorites"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[var(--cs2-border)]">
                                    <a
                                        href={`/player/${favorite.steam_id}`}
                                        className="text-sm text-[var(--cs2-orange)] hover:underline"
                                    >
                                        View Stats →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
