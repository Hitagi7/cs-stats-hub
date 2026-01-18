"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function AuthButtons() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    if (loading) {
        return (
            <div className="flex items-center gap-4">
                <div className="w-20 h-10 bg-[var(--cs2-surface)] rounded-full animate-pulse" />
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <a href="/dashboard" className="btn-primary">
                    Dashboard
                </a>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <a href="/login" className="btn-secondary hidden sm:block">Sign In</a>
            <a href="/signup" className="btn-primary">Get Started</a>
        </div>
    );
}
