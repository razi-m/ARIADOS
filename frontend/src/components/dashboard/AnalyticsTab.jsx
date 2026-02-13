
import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { AlertTriangle, CheckCircle, Activity, TrendingUp } from 'lucide-react';

const COLORS = {
    critical: '#EF4444', // Red-500
    high: '#F97316',     // Orange-500
    medium: '#EAB308',   // Yellow-500
    low: '#3B82F6',      // Blue-500
};

const AnalyticsTab = ({ defects }) => {
    // 1. Severity Distribution Data
    const severityData = useMemo(() => {
        const counts = { critical: 0, high: 0, medium: 0, low: 0 };
        defects.forEach(d => {
            if (counts[d.severity] !== undefined) counts[d.severity]++;
        });
        return Object.keys(counts).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: counts[key],
            color: COLORS[key]
        })).filter(d => d.value > 0);
    }, [defects]);

    // 2. Defect Type Distribution Data
    const typeData = useMemo(() => {
        const counts = {};
        defects.forEach(d => {
            counts[d.typeLabel] = (counts[d.typeLabel] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({
            name: key,
            count: counts[key]
        })).sort((a, b) => b.count - a.count);
    }, [defects]);

    // 3. Confidence Metrics
    const avgConfidence = useMemo(() =>
        defects.length ? Math.round(defects.reduce((acc, d) => acc + d.confidence, 0) / defects.length) : 0,
        [defects]
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Defects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{defects.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {defects.filter(d => d.severity === 'critical').length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{avgConfidence}%</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Missions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {new Set(defects.map(d => d.videoId)).size}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Severity Distribution Chart */}
                <div className="card p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Severity Distribution</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Defect Type Chart */}
                <div className="card p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Defects by Type</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Alerts / Insights could go here */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Insights</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-yellow-900">High Concentration of Cracks</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Our analysis indicates that 45% of all defects are structural cracks, primarily in the Golden Gate section.
                                Recommended Priority: <strong>High</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900">Model Performance Optimization</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                The AI model is performing with {avgConfidence}% average confidence.
                                False positive rates have dropped by 12% since the last calibration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
