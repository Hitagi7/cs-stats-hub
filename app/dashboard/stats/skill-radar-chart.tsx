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
        if (val <= min) return 20;
        if (val >= max) return 100;
        return 20 + ((val - min) / (max - min)) * 80;
    };

    // Calculate Metrics
    const kpm = (stats.total_kills || 0) / (stats.matches_played || 1);
    const dpm = (stats.total_deaths || 0) / (stats.matches_played || 1);
    const aggression = ((stats.total_kills || 0) + (stats.total_deaths || 0)) / (stats.matches_played || 1);

    const data = [
        {
            subject: "Aiming",
            label: "HS %",
            value: stats.headshot_percentage || 0,
            A: normalize(stats.headshot_percentage || 0, 10, 60)
        },
        {
            subject: "Fragging",
            label: "Kills/Match",
            value: Number(kpm.toFixed(1)),
            A: normalize(kpm, 10, 25)
        },
        {
            subject: "Efficiency",
            label: "K/D",
            value: Number(stats.kd_ratio?.toFixed(2)) || 0,
            A: normalize(stats.kd_ratio || 0, 0.6, 1.4)
        },
        {
            subject: "Survival",
            label: "Deaths/Match",
            value: Number(dpm.toFixed(1)),
            A: (() => {
                if (dpm <= 15) return 100;
                if (dpm >= 22) return 20;
                return 20 + ((22 - dpm) / (22 - 15)) * 80;
            })()
        },
        {
            subject: "Aggression",
            label: "Engage/Match",
            value: Number(aggression.toFixed(1)),
            A: normalize(aggression, 30, 45)
        },
    ];

    // Calculate overall score (average of all normalized values)
    const overallScore = Math.round(data.reduce((sum, d) => sum + d.A, 0) / data.length);

    // Reorder for visual balance (Pentagon)
    const orderedData = [
        data[0], // Top: Aiming
        data[2], // Efficiency (Right)
        data[4], // Aggression (Bottom Right)
        data[3], // Survival (Bottom Left)
        data[1], // Fragging (Left)
    ];

    // Get score color based on value
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#22c55e'; // Green
        if (score >= 60) return '#ff6b00'; // Orange
        if (score >= 40) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    // Get score label
    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Elite';
        if (score >= 60) return 'Skilled';
        if (score >= 40) return 'Average';
        return 'Improving';
    };

    return (
        <div className="w-full h-[300px] relative">
            {/* Center Score Badge */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div
                    className="flex flex-col items-center bg-[var(--cs2-bg)]/90 rounded-full w-20 h-20 justify-center border-2"
                    style={{ borderColor: getScoreColor(overallScore) }}
                >
                    <span
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(overallScore) }}
                    >
                        {overallScore}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        {getScoreLabel(overallScore)}
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={orderedData}>
                    <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#ff6b00" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
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
                        fill="url(#radarGradient)"
                        fillOpacity={0.6}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                    <Tooltip
                        position={{ x: 0, y: -20 }}
                        wrapperStyle={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 20
                        }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-[#0a0a0f] border border-[#2a2b38] rounded-lg p-3 shadow-xl min-w-[120px]">
                                        <p className="text-[var(--primary)] font-bold mb-1">{d.subject}</p>
                                        <div className="text-sm text-gray-300">
                                            <span className="text-gray-500 mr-2">{d.label}:</span>
                                            <span className="font-mono text-white">{d.value}</span>
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] mt-1">
                                            Score: {Math.round(d.A)}/100
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
