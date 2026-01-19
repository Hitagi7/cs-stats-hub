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

/**
 * Skill Radar Chart - 5 Core Performance Metrics
 * 
 * - Combat: K/D Ratio - core fragging ability
 * - Winning: Win Rate - team contribution
 * - Precision: Headshot % - aiming skill
 * - Fragging: Kills per match - offensive output
 * - Survival: Deaths per match (inverted) - staying alive
 */
export default function SkillRadarChart({ stats }: SkillRadarChartProps) {
    const matchesPlayed = stats.matches_played || 1;
    const killsPerMatch = (stats.total_kills || 0) / matchesPlayed;
    const deathsPerMatch = (stats.total_deaths || 0) / matchesPlayed;

    // Score calculation with CS2 benchmarks
    const calculateScore = (value: number, benchmarks: { poor: number; average: number; good: number; elite: number }) => {
        if (value <= benchmarks.poor) return 15;
        if (value <= benchmarks.average) {
            return 15 + ((value - benchmarks.poor) / (benchmarks.average - benchmarks.poor)) * 30;
        }
        if (value <= benchmarks.good) {
            return 45 + ((value - benchmarks.average) / (benchmarks.good - benchmarks.average)) * 25;
        }
        if (value <= benchmarks.elite) {
            return 70 + ((value - benchmarks.good) / (benchmarks.elite - benchmarks.good)) * 25;
        }
        return 95;
    };

    // Inverted score (lower is better)
    const calculateInverseScore = (value: number, benchmarks: { elite: number; good: number; average: number; poor: number }) => {
        if (value <= benchmarks.elite) return 95;
        if (value <= benchmarks.good) {
            return 70 + ((benchmarks.good - value) / (benchmarks.good - benchmarks.elite)) * 25;
        }
        if (value <= benchmarks.average) {
            return 45 + ((benchmarks.average - value) / (benchmarks.average - benchmarks.good)) * 25;
        }
        if (value <= benchmarks.poor) {
            return 15 + ((benchmarks.poor - value) / (benchmarks.poor - benchmarks.average)) * 30;
        }
        return 15;
    };

    const data = [
        {
            subject: "Combat",
            label: "K/D Ratio",
            value: stats.kd_ratio?.toFixed(2) || "0",
            description: "Kills per death - core measure of fragging ability",
            A: calculateScore(stats.kd_ratio || 0, {
                poor: 0.7,
                average: 1.0,
                good: 1.25,
                elite: 1.5
            })
        },
        {
            subject: "Winning",
            label: "Win Rate",
            value: `${(stats.win_rate || 0).toFixed(1)}%`,
            description: "Match win percentage - shows team contribution",
            A: calculateScore(stats.win_rate || 0, {
                poor: 42,
                average: 50,
                good: 54,
                elite: 58
            })
        },
        {
            subject: "Precision",
            label: "Headshot %",
            value: `${(stats.headshot_percentage || 0).toFixed(1)}%`,
            description: "Percentage of kills that are headshots",
            A: calculateScore(stats.headshot_percentage || 0, {
                poor: 25,
                average: 38,
                good: 48,
                elite: 55
            })
        },
        {
            subject: "Fragging",
            label: "Kills/Match",
            value: killsPerMatch.toFixed(1),
            description: "Average kills per match - offensive output",
            A: calculateScore(killsPerMatch, {
                poor: 8,
                average: 14,
                good: 18,
                elite: 22
            })
        },
        {
            subject: "Survival",
            label: "Deaths/Match",
            value: deathsPerMatch.toFixed(1),
            description: "Average deaths per match - lower is better",
            A: calculateInverseScore(deathsPerMatch, {
                elite: 12,    // Very low deaths = elite
                good: 15,     // Low deaths = good
                average: 18,  // Average deaths
                poor: 22      // High deaths = struggling
            })
        }
    ];

    const overallScore = Math.round(data.reduce((sum, d) => sum + d.A, 0) / data.length);

    // Pentagon layout
    const orderedData = [
        data[0], // Top: Combat
        data[1], // Right: Winning
        data[2], // Bottom Right: Precision
        data[3], // Bottom Left: Fragging
        data[4], // Left: Survival
    ];

    const getScoreColor = (score: number) => {
        if (score >= 70) return '#22c55e';
        if (score >= 50) return '#ff6b00';
        if (score >= 35) return '#eab308';
        return '#ef4444';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return 'Elite';
        if (score >= 50) return 'Skilled';
        if (score >= 35) return 'Average';
        return 'Learning';
    };

    return (
        <div className="w-full h-[300px] relative flex items-center">
            {/* Tooltip Panel - Fixed on left */}
            <div id="skill-tooltip" className="w-[140px] shrink-0 pr-2" />

            {/* Chart Container */}
            <div className="flex-1 h-full">
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
                            angle={90}
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
                            wrapperStyle={{
                                visibility: 'hidden'
                            }}
                            content={({ active, payload }) => {
                                const tooltipEl = document.getElementById('skill-tooltip');
                                if (tooltipEl) {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        const scoreColor = getScoreColor(d.A);
                                        const scorePercent = Math.round(d.A);
                                        tooltipEl.innerHTML = `
                                        <div style="background: linear-gradient(135deg, rgba(10,10,15,0.98) 0%, rgba(20,21,32,0.95) 100%); border: 1px solid rgba(255,107,0,0.3); border-radius: 12px; padding: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(255,107,0,0.1);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                                <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%); display: flex; align-items: center; justify-content: center;">
                                                    <span style="font-size: 14px; font-weight: bold; color: white;">${d.subject.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p style="color: white; font-weight: 600; font-size: 13px; margin: 0;">${d.subject}</p>
                                                    <p style="color: #6b7280; font-size: 10px; margin: 0;">${d.label}</p>
                                                </div>
                                            </div>
                                            <div style="background: rgba(42,43,56,0.5); border-radius: 8px; padding: 10px; margin-bottom: 12px;">
                                                <p style="font-family: monospace; font-size: 24px; font-weight: bold; color: ${scoreColor}; margin: 0;">${d.value}</p>
                                            </div>
                                            <p style="font-size: 11px; color: #9ca3af; line-height: 1.4; margin: 0 0 12px 0;">${d.description}</p>
                                            <div style="background: rgba(42,43,56,0.3); border-radius: 6px; padding: 8px;">
                                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                                    <span style="font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Skill Score</span>
                                                    <span style="font-size: 12px; font-weight: 600; color: ${scoreColor};">${scorePercent}/100</span>
                                                </div>
                                                <div style="height: 4px; background: rgba(42,43,56,0.8); border-radius: 2px; overflow: hidden;">
                                                    <div style="height: 100%; width: ${scorePercent}%; background: linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}99 100%); border-radius: 2px; transition: width 0.3s ease;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    } else {
                                        tooltipEl.innerHTML = `
                                        <div style="background: linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(20,21,32,0.9) 100%); border: 1px solid rgba(42,43,56,0.5); border-radius: 12px; padding: 20px; text-align: center;">
                                            <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,107,0,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" stroke-width="2">
                                                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                                                    <path d="M2 17L12 22L22 17"></path>
                                                    <path d="M2 12L12 17L22 12"></path>
                                                </svg>
                                            </div>
                                            <p style="color: #9ca3af; font-size: 11px; margin: 0;">Hover over a skill</p>
                                            <p style="color: #6b7280; font-size: 10px; margin: 4px 0 0 0;">to see details</p>
                                        </div>
                                    `;
                                    }
                                }
                                return null;
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
