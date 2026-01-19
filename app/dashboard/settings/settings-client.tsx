"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/profile";
import Image from "next/image";

interface SettingsClientProps {
    user: User;
    profile: UserProfile | null;
    steamConnected: boolean;
    steamUsername: string | null;
    steamAvatarUrl: string | null;
}

export default function SettingsClient({
    user,
    profile,
    steamConnected,
    steamUsername,
    steamAvatarUrl,
}: SettingsClientProps) {
    const [username, setUsername] = useState(profile?.username || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const supabase = createClient();

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);

        const { error } = await supabase
            .from("profiles")
            .update({
                username: username || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

        if (error) {
            setProfileMessage({ type: "error", text: error.message });
        } else {
            setProfileMessage({ type: "success", text: "Profile updated successfully!" });
        }
        setProfileLoading(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "Passwords do not match" });
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
            setPasswordLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setPasswordMessage({ type: "error", text: error.message });
        } else {
            setPasswordMessage({ type: "success", text: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        setPasswordLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Profile Section */}
            <section className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>

                {/* Avatar Preview */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--cs2-surface)] flex items-center justify-center">
                        {steamAvatarUrl ? (
                            <Image
                                src={steamAvatarUrl}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-[var(--cs2-orange)]">
                                {user.email?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-white font-medium">
                            {steamUsername || user.email?.split("@")[0]}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                        {steamConnected && (
                            <p className="text-xs text-green-500 mt-1">✓ Steam Connected</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your display name"
                            className="search-input"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            This is how your name appears across the platform
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="search-input opacity-50 cursor-not-allowed"
                        />
                    </div>

                    {profileMessage && (
                        <div
                            className={`px-4 py-3 rounded-lg text-sm ${profileMessage.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                                }`}
                        >
                            {profileMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </section>

            {/* Steam Connection Section */}
            <section className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                <h2 className="text-xl font-semibold text-white mb-4">Steam Account</h2>

                {steamConnected ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {steamAvatarUrl && (
                                <Image
                                    src={steamAvatarUrl}
                                    alt="Steam Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <p className="text-white font-medium">{steamUsername}</p>
                                <p className="text-xs text-green-500">Connected</p>
                            </div>
                        </div>
                        <a
                            href="/dashboard/stats"
                            className="text-sm text-[var(--cs2-orange)] hover:underline"
                        >
                            View Stats →
                        </a>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-[var(--text-secondary)] mb-4">
                            Connect your Steam account to track your CS2 stats
                        </p>
                        <a href="/dashboard/stats" className="btn-primary inline-block">
                            Connect Steam
                        </a>
                    </div>
                )}
            </section>

            {/* Password Section */}
            <section className="glass rounded-2xl p-6 border border-[var(--cs2-border)]">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="search-input"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="search-input"
                            minLength={6}
                        />
                    </div>

                    {passwordMessage && (
                        <div
                            className={`px-4 py-3 rounded-lg text-sm ${passwordMessage.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                                }`}
                        >
                            {passwordMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={passwordLoading || !newPassword || !confirmPassword}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </section>
        </div>
    );
}
