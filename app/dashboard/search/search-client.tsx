"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchResult {
    steam_id: string;
    username: string | null;
    avatar_url: string | null;
    kd_ratio: number | null;
    win_rate: number | null;
    source: string;
}

interface RecentSearch {
    steam_id: string;
    username: string | null;
    avatar_url: string | null;
    timestamp: number;
}

const RECENT_SEARCHES_KEY = "cs2_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const SearchIconLarge = () => (
    <svg className="w-12 h-12 text-[var(--cs2-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Helper functions for localStorage
function getRecentSearches(): RecentSearch[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(result: SearchResult) {
    if (typeof window === "undefined") return;
    try {
        const searches = getRecentSearches();
        // Remove duplicate if exists
        const filtered = searches.filter(s => s.steam_id !== result.steam_id);
        // Add new search at the beginning
        const updated: RecentSearch[] = [
            {
                steam_id: result.steam_id,
                username: result.username,
                avatar_url: result.avatar_url,
                timestamp: Date.now(),
            },
            ...filtered,
        ].slice(0, MAX_RECENT_SEARCHES);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
        // Ignore storage errors
    }
}

export default function SearchClient({ user }: { user: User }) {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SearchResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addingFavorite, setAddingFavorite] = useState(false);
    const [favoriteAdded, setFavoriteAdded] = useState(false);
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const [showRecent, setShowRecent] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Load recent searches on mount
    useEffect(() => {
        setRecentSearches(getRecentSearches());
    }, []);

    // Auto-search if query param exists
    useEffect(() => {
        if (initialQuery && !result) {
            performSearch(initialQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);
        setFavoriteAdded(false);

        try {
            const res = await fetch(`/api/stats/${encodeURIComponent(searchQuery.trim())}`);
            const data = await res.json();

            if (data.success) {
                setResult(data.data);
                // Save to recent searches
                saveRecentSearch(data.data);
                setRecentSearches(getRecentSearches());
            } else {
                setError(data.error || "Failed to fetch player stats");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Update URL with search query for persistence
        router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
        await performSearch(query);
    };

    const handleRecentClick = (search: RecentSearch) => {
        setQuery(search.steam_id);
        setShowRecent(false);
        router.push(`/dashboard/search?q=${encodeURIComponent(search.steam_id)}`, { scroll: false });
        performSearch(search.steam_id);
    };

    const addToFavorites = async () => {
        if (!result) return;
        setAddingFavorite(true);

        try {
            const res = await fetch("/api/user/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    steam_id: result.steam_id,
                    nickname: result.username,
                    avatar_url: result.avatar_url,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setFavoriteAdded(true);
            } else {
                setError(data.error);
            }
        } catch {
            setError("Failed to add to favorites");
        } finally {
            setAddingFavorite(false);
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    <span className="text-gradient-orange">Search</span> Player
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Look up any CS2 player by their Steam ID or profile URL.
                </p>
            </div>

            {/* Search Form */}
            <div className="glass rounded-2xl p-6 border border-[var(--cs2-border)] mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowRecent(true)}
                            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                            placeholder="Enter Steam ID, Steam64 ID, or Profile URL"
                            className="search-input w-full"
                        />

                        {/* Recent Searches Dropdown */}
                        {showRecent && recentSearches.length > 0 && !result && (
                            <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-[var(--cs2-border)] overflow-hidden z-10">
                                <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--cs2-border)]">
                                    <ClockIcon />
                                    <span className="text-sm text-[var(--text-muted)]">Recent Searches</span>
                                </div>
                                {recentSearches.map((search) => (
                                    <button
                                        key={search.steam_id}
                                        type="button"
                                        onClick={() => handleRecentClick(search)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--cs2-surface)] transition-colors text-left"
                                    >
                                        {search.avatar_url ? (
                                            <img
                                                src={search.avatar_url}
                                                alt={search.username || "Player"}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center text-sm font-bold text-[var(--cs2-orange)]">
                                                {search.username?.charAt(0).toUpperCase() || "P"}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {search.username || "Unknown Player"}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)] truncate">
                                                {search.steam_id}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8">
                    {error}
                </div>
            )}

            {/* Search Result */}
            {result && (
                <div
                    onClick={() => router.push(`/player/${result.steam_id}`)}
                    className="glass rounded-2xl p-6 border border-[var(--cs2-border)] group cursor-pointer hover:border-[var(--cs2-orange)] transition-colors"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {result.avatar_url ? (
                                <img
                                    src={result.avatar_url}
                                    alt={result.username || "Player"}
                                    className="w-16 h-16 rounded-full border-2 border-[var(--cs2-orange)]"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center text-2xl font-bold text-[var(--cs2-orange)]">
                                    {result.username?.charAt(0).toUpperCase() || "P"}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {result.username || "Unknown Player"}
                                </h2>
                                <p className="text-[var(--text-muted)] text-sm">{result.steam_id}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToFavorites();
                            }}
                            disabled={addingFavorite || favoriteAdded}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${favoriteAdded
                                ? "bg-green-500/20 text-green-400"
                                : "bg-[var(--cs2-surface)] text-[var(--text-secondary)] hover:text-[var(--cs2-orange)]"
                                }`}
                        >
                            <StarIcon />
                            {favoriteAdded ? "Added!" : addingFavorite ? "Adding..." : "Add to Favorites"}
                        </button>
                    </div>

                    {result.source === "placeholder" ? (
                        <div className="text-center py-8 text-[var(--text-secondary)]">
                            <p className="mb-2">Steam API integration pending</p>
                            <p className="text-sm">Full stats will be available once integrated.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="feature-card text-center">
                                <p className="text-[var(--text-secondary)] text-sm mb-1">K/D Ratio</p>
                                <p className="text-2xl font-bold text-white">{result.kd_ratio ?? "--"}</p>
                            </div>
                            <div className="feature-card text-center">
                                <p className="text-[var(--text-secondary)] text-sm mb-1">Win Rate</p>
                                <p className="text-2xl font-bold text-white">
                                    {result.win_rate ? `${result.win_rate}%` : "--"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-6 pt-6 border-t border-[var(--cs2-border)]">
                        <span className="text-sm font-medium text-[var(--cs2-orange)] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            View Full Profile
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!result && !loading && !error && (
                <div className="glass rounded-2xl p-12 border border-[var(--cs2-border)] text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--cs2-surface)] flex items-center justify-center mx-auto mb-4">
                        <SearchIconLarge />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Find Any CS2 Player</h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Enter a Steam ID, Steam64 ID, or profile URL to look up player statistics.
                    </p>
                </div>
            )}
        </>
    );
}
