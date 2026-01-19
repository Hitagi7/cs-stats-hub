"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from "recharts";
import { StatsHistoryPoint } from "@/lib/stats";

interface PerformanceChartProps {
    data: StatsHistoryPoint[];
    compact?: boolean;
}

type MetricType = 'kd_ratio' | 'win_rate' | 'headshot_percentage';

const METRIC_CONFIG: Record<MetricType, { label: string; color: string; unit: string }> = {
    kd_ratio: { label: 'K/D Ratio', color: '#ff6b00', unit: '' },
    win_rate: { label: 'Win Rate', color: '#10b981', unit: '%' },
    headshot_percentage: { label: 'Headshot', color: '#8b5cf6', unit: '%' }
};

export default function PerformanceChart({ data, compact = false }: PerformanceChartProps) {
    const [activeMetrics, setActiveMetrics] = useState<MetricType[]>(['kd_ratio', 'win_rate', 'headshot_percentage']);

    const toggleMetric = (metric: MetricType) => {
        setActiveMetrics(prev => {
            if (prev.includes(metric) && prev.length === 1) return prev;
            return prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric];
        });
    };

    const isEmpty = !data || data.length === 0;

    // Format data
    const chartData = isEmpty ? [] : data.map(point => ({
        ...point,
        date: new Date(point.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        win_rate: point.win_rate ? Number(point.win_rate.toFixed(1)) : 0,
        kd_ratio: point.kd_ratio ? Number(point.kd_ratio.toFixed(2)) : 0,
        headshot_percentage: point.headshot_percentage ? Number(point.headshot_percentage.toFixed(1)) : 0
    }));

    // Use single-point bar chart if only 1 data point
    const useSinglePointMode = chartData.length === 1;

    // For single point, create bar data
    const barData = useSinglePointMode ? activeMetrics.map(metric => ({
        name: METRIC_CONFIG[metric].label,
        value: metric === 'kd_ratio'
            ? chartData[0].kd_ratio * 50 // Scale K/D to percentage for visual comparison
            : chartData[0][metric as keyof typeof chartData[0]] as number,
        rawValue: chartData[0][metric as keyof typeof chartData[0]],
        color: METRIC_CONFIG[metric].color,
        unit: METRIC_CONFIG[metric].unit,
        metric
    })) : [];

    // Empty state
    if (isEmpty) {
        return (
            <div className={`${compact ? "h-[200px]" : "h-[300px]"} flex flex-col items-center justify-center text-[var(--text-secondary)] border border-dashed border-[var(--cs2-border)] rounded-lg`}>
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-medium">No History Data Yet</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">Play games to start tracking trends</p>
            </div>
        );
    }

    return (
        <div className="w-full relative">
            {/* Metric Toggles */}
            {!compact && (
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
            )}

            {/* Single point mode info */}
            {useSinglePointMode && !compact && (
                <div className="mb-4 text-center">
                    <p className="text-xs text-[var(--text-muted)]">
                        Current snapshot from {chartData[0].date} • More data points will show trend lines
                    </p>
                </div>
            )}

            <div className={compact ? "h-[200px]" : "h-[280px]"}>
                <ResponsiveContainer width="100%" height="100%">
                    {useSinglePointMode ? (
                        // Bar chart for single data point
                        <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" horizontal={true} vertical={false} />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                stroke="#71717a"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="#71717a"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0a0a0f',
                                    border: '1px solid #2a2b38',
                                    borderRadius: '8px',
                                }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-[#0a0a0f] border border-[#2a2b38] rounded-lg p-3 shadow-xl">
                                                <p className="text-white font-medium">{d.name}</p>
                                                <p className="text-sm" style={{ color: d.color }}>
                                                    {d.rawValue}{d.unit}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[0, 4, 4, 0]}
                                animationDuration={1000}
                            >
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : (
                        // Area chart for multiple data points
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="gradientKD" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradientWR" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradientHS" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" />
                            <XAxis
                                dataKey="date"
                                stroke="#71717a"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#71717a"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                width={35}
                            />
                            <YAxis
                                yAxisId="right"
                                stroke="#71717a"
                                orientation="right"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                                domain={[0, 100]}
                                width={40}
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
                            {!compact && <Legend wrapperStyle={{ paddingTop: '20px' }} />}

                            {activeMetrics.includes('kd_ratio') && (
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="kd_ratio"
                                    name="K/D Ratio"
                                    stroke={METRIC_CONFIG.kd_ratio.color}
                                    strokeWidth={2}
                                    fill="url(#gradientKD)"
                                    dot={{ r: 4, fill: METRIC_CONFIG.kd_ratio.color }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={1500}
                                />
                            )}

                            {activeMetrics.includes('win_rate') && (
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="win_rate"
                                    name="Win Rate"
                                    stroke={METRIC_CONFIG.win_rate.color}
                                    strokeWidth={2}
                                    fill="url(#gradientWR)"
                                    dot={{ r: 4, fill: METRIC_CONFIG.win_rate.color }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={1500}
                                />
                            )}

                            {activeMetrics.includes('headshot_percentage') && (
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="headshot_percentage"
                                    name="Headshot %"
                                    stroke={METRIC_CONFIG.headshot_percentage.color}
                                    strokeWidth={2}
                                    fill="url(#gradientHS)"
                                    dot={{ r: 4, fill: METRIC_CONFIG.headshot_percentage.color }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={1500}
                                />
                            )}
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
