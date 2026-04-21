"use client";

import React, { useEffect, useState } from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    LineChart, 
    Line, 
    CartesianGrid,
    Legend
} from 'recharts';
import { toast } from "sonner";
import { Loader2, TrendingUp, Users, Calendar, CheckCircle2 } from "lucide-react";

// Theme-compatible color palette using your CSS variables
const CHART_COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2, 210 20% 50%))',
    'hsl(var(--chart-3, 160 60% 45%))',
    'hsl(var(--muted-foreground))',
];

export const AnalyticsPage = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics/bookings/summary');
                if (!res.ok) throw new Error("Failed to synchronize analytics");
                const json = await res.json();
                
                // Transformation layer for Recharts format
                setData({
                    resources: json.resources.map((i: any) => ({ name: i[0], count: i[1] })),
                    status: json.statusDistribution.map((i: any) => ({ name: i[0], value: i[1] })),
                    trends: json.trends.map((i: any) => ({ 
                        date: new Date(i[0]).toLocaleDateString('en-US', { weekday: 'short' }), 
                        count: i[1] 
                    })),
                    // High-level summary metrics for the top row
                    metrics: {
                        total: json.statusDistribution.reduce((acc: number, curr: any) => acc + curr[1], 0),
                        approved: json.statusDistribution.find((i: any) => i[0] === 'APPROVED')?.[1] || 0,
                    }
                });
            } catch (err) {
                toast.error("Analytics synchronization failed");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium animate-pulse">Aggregating Campus Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 1. Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.metrics.total}</div>
                        <p className="text-xs text-muted-foreground">+4% from last week</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Approval Volume</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.metrics.approved}</div>
                        <p className="text-xs text-muted-foreground">Processed by Admin</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Wednesday</div>
                        <p className="text-xs text-muted-foreground">Peak resource usage</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">Current system session</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Weekly Trends Line Chart */}
                <Card className="lg:col-span-4 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Booking Velocity</CardTitle>
                        <CardDescription>Daily request volume over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pl-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--popover-foreground))', fontSize: '12px' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={3} 
                                    dot={{ fill: 'hsl(var(--primary))', r: 4 }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution Pie Chart */}
                <Card className="lg:col-span-3 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Approval Efficiency</CardTitle>
                        <CardDescription>Ratio of approved vs rejected requests</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={data?.status} 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {data?.status.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Popular Resources Bar Chart */}
                <Card className="lg:col-span-7 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Resource Popularity</CardTitle>
                        <CardDescription>Most frequently booked campus assets</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.resources}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="hsl(var(--muted-foreground))" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip cursor={{fill: 'hsl(var(--muted)/0.2)'}} />
                                <Bar 
                                    dataKey="count" 
                                    fill="hsl(var(--primary))" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};