"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import { UserStats } from "@/lib/stats";

interface SkillRadarChartProps {
    stats: UserStats;
}

export default function SkillRadarChart({ stats }: SkillRadarChartProps) {
    // Helper to normalize values to 0-100 scale based on min/max ranges
    const normalize = (val: number, min: number, max: number) => {
        if (val <= min) return 20; // Base baseline
        if (val >= max) return 100;
        return 20 + ((val - min) / (max - min)) * 80;
    };

    // Calculate Metrics
    const kpm = (stats.total_kills || 0) / (stats.matches_played || 1);
    const dpm = (stats.total_deaths || 0) / (stats.matches_played || 1);
    const aggression = ((stats.total_kills || 0) + (stats.total_deaths || 0)) / (stats.matches_played || 1);

    // Impact is broken (0 MVPs), so we replace it with "Experience" which is reliable
    // const mvpRate = ((stats.total_mvps || 0) / (stats.matches_played || 1)) * 100; 

    const data = [
        {
            subject: "Aiming",
            label: "HS %",
            idx: 0,
            value: stats.headshot_percentage || 0,
            fullMark: 100,
            // Pro: 60%+. Avg: 20%. User has ~45% which is distinct.
            A: normalize(stats.headshot_percentage || 0, 10, 60)
        },
        {
            subject: "Fragging",
            label: "Kills/Match",
            idx: 1,
            value: Number(kpm.toFixed(1)),
            fullMark: 100,
            // Carry: 25 kills. Poor: 10 kills.
            A: normalize(kpm, 10, 25)
        },
        {
            subject: "Efficiency",
            label: "K/D",
            idx: 2,
            value: Number(stats.kd_ratio?.toFixed(2)) || 0,
            fullMark: 100,
            // Dominant: 1.4. Struggling: 0.6.
            A: normalize(stats.kd_ratio || 0, 0.6, 1.4)
        },
        {
            subject: "Survival",
            label: "Deaths/Match",
            idx: 3,
            value: Number(dpm.toFixed(1)),
            fullMark: 100,
            // Inverted: 15 (Excellent) - 22 (Poor)
            // Custom normalization for inversion
            A: (() => {
                if (dpm <= 15) return 100;
                if (dpm >= 22) return 20;
                return 20 + ((22 - dpm) / (22 - 15)) * 80;
            })()
        },
        {
            subject: "Aggression",
            label: "Engage/Match",
            idx: 4,
            value: Number(aggression.toFixed(1)),
            fullMark: 100,
            // Active: 45+. Passive: 30.
            A: normalize(aggression, 30, 45)
        },
    ];

    // Reorder for visual balance (Pentagon)
    const orderedData = [
        data[0], // Top: Aiming
        data[2], // Efficiency (Right)
        data[4], // Aggression (Bottom Right)
        data[3], // Survival (Bottom Left)
        data[1], // Fragging (Left)
    ];

    return (
        <div className="w-full h-[300px]">
            {/* Legend / Stats Context */}
            <div className="absolute top-4 right-4 text-xs text-[var(--text-muted)] text-right hidden sm:block">
                <p>Based on per-match form</p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={orderedData}>
                    <PolarGrid stroke="#2a2b38" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#ff6b00"
                        strokeWidth={2}
                        fill="#ff6b00"
                        fillOpacity={0.4}
                        isAnimationActive={true}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-[#0a0a0f] border border-[#2a2b38] rounded-lg p-3 shadow-xl">
                                        <p className="text-[var(--primary)] font-bold mb-1">{data.subject}</p>
                                        <div className="text-sm text-gray-300">
                                            <span className="text-gray-500 mr-2">{data.label}:</span>
                                            <span className="font-mono text-white">{data.value}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
