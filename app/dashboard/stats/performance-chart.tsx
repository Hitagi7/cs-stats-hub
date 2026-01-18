"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { StatsHistoryPoint } from "@/lib/stats";

interface PerformanceChartProps {
    data: StatsHistoryPoint[];
}

type MetricType = 'kd_ratio' | 'win_rate' | 'headshot_percentage';

const METRIC_CONFIG: Record<MetricType, { label: string; color: string; axis: string }> = {
    kd_ratio: { label: 'K/D Ratio', color: '#ff6b00', axis: 'left' },
    win_rate: { label: 'Win Rate %', color: '#10b981', axis: 'right' },
    headshot_percentage: { label: 'Headshot %', color: '#8b5cf6', axis: 'right' }
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
    const [activeMetrics, setActiveMetrics] = useState<MetricType[]>(['kd_ratio', 'win_rate']);

    const toggleMetric = (metric: MetricType) => {
        setActiveMetrics(prev => {
            if (prev.includes(metric) && prev.length === 1) return prev; // Prevent empty state
            return prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric];
        });
    };

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex flex-col items-center justify-center text-[var(--text-secondary)]">
                <p>Not enough data to show trends</p>
                <p className="text-sm mt-2">Play more games and check back daily!</p>
            </div>
        );
    }

    // Format dates for display
    const formattedData = data.map(point => ({
        ...point,
        date: new Date(point.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        win_rate: point.win_rate ? Number(point.win_rate.toFixed(1)) : 0,
        kd_ratio: point.kd_ratio ? Number(point.kd_ratio.toFixed(2)) : 0,
        headshot_percentage: point.headshot_percentage ? Number(point.headshot_percentage.toFixed(1)) : 0
    }));

    return (
        <div className="w-full">
            {/* Metric Toggles */}
            <div className="flex flex-wrap gap-2 mb-6 justify-end">
                {(Object.keys(METRIC_CONFIG) as MetricType[]).map(metric => (
                    <button
                        key={metric}
                        onClick={() => toggleMetric(metric)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeMetrics.includes(metric)
                            ? "bg-[var(--cs2-surface)]"
                            : "border-[var(--cs2-border)] text-[var(--text-secondary)] hover:bg-[var(--cs2-surface)]"
                            }`}
                        style={{
                            borderColor: activeMetrics.includes(metric) ? METRIC_CONFIG[metric].color : undefined,
                            color: activeMetrics.includes(metric) ? METRIC_CONFIG[metric].color : undefined,
                            boxShadow: activeMetrics.includes(metric) ? `0 0 10px ${METRIC_CONFIG[metric].color}20` : undefined
                        }}
                    >
                        {METRIC_CONFIG[metric].label}
                    </button>
                ))}
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" />
                        <XAxis
                            dataKey="date"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <YAxis
                            yAxisId="right"
                            stroke="#71717a"
                            orientation="right"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            unit="%"
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0a0a0f',
                                border: '1px solid #2a2b38',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        {activeMetrics.includes('kd_ratio') && (
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="kd_ratio"
                                name="K/D Ratio"
                                stroke={METRIC_CONFIG.kd_ratio.color}
                                strokeWidth={2}
                                dot={{ r: 4, fill: METRIC_CONFIG.kd_ratio.color }}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                        )}

                        {activeMetrics.includes('win_rate') && (
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="win_rate"
                                name="Win Rate"
                                stroke={METRIC_CONFIG.win_rate.color}
                                strokeWidth={2}
                                dot={{ r: 4, fill: METRIC_CONFIG.win_rate.color }}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                        )}

                        {activeMetrics.includes('headshot_percentage') && (
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="headshot_percentage"
                                name="Headshot %"
                                stroke={METRIC_CONFIG.headshot_percentage.color}
                                strokeWidth={2}
                                dot={{ r: 4, fill: METRIC_CONFIG.headshot_percentage.color }}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
