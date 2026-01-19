"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="text-3xl font-bold text-gradient-orange">CS2</span>
                        <span className="text-3xl font-bold text-white">Stats Hub</span>
                    </Link>
                    <p className="text-[var(--text-secondary)] mt-2">
                        Reset your password
                    </p>
                </div>

                {/* Form */}
                <div className="glass rounded-2xl p-8 border border-[var(--cs2-border)]">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
                            <p className="text-[var(--text-secondary)] text-sm mb-6">
                                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
                            </p>
                            <Link
                                href="/login"
                                className="text-[var(--cs2-orange)] hover:underline font-medium"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <p className="text-[var(--text-secondary)] text-sm">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="search-input"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-[var(--text-secondary)] text-sm">
                                Remember your password?{" "}
                                <Link
                                    href="/login"
                                    className="text-[var(--cs2-orange)] hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-[var(--text-muted)] text-sm hover:text-white transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
