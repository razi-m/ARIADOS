import React, { memo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = memo(({ title, value, trend, icon: Icon, suffix = '', color = 'cyan', showMeter = false, meterValue = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) {
            setDisplayValue(value);
            return;
        }
        hasAnimated.current = true;
        const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
        const duration = 1500;
        const steps = 60;
        const increment = numVal / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, numVal);
            setDisplayValue(Math.round(current * 100) / 100);
            if (step >= steps) {
                setDisplayValue(numVal);
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    const isPositive = trend?.startsWith('+');
    const colorMap = {
        cyan: 'from-cyan-400 to-cyan-600',
        red: 'from-red-400 to-red-600',
        green: 'from-green-400 to-green-600',
        amber: 'from-amber-400 to-amber-600',
        purple: 'from-purple-400 to-purple-600',
    };

    return (
        <motion.div
            className="metric-card group"
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1)' }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                {Icon && (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorMap[color]} bg-opacity-20 flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            <div className="flex items-end gap-2 mb-2">
                {showMeter ? (
                    <div className="flex items-center gap-3 w-full">
                        <div className="relative w-14 h-14">
                            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                                <circle
                                    cx="28" cy="28" r="24"
                                    stroke="url(#meterGrad)"
                                    strokeWidth="4" fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(meterValue / 100) * 150.8} 150.8`}
                                />
                                <defs>
                                    <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00d4ff" />
                                        <stop offset="100%" stopColor="#0099ff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                {Math.round(meterValue)}%
                            </span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">{displayValue}{suffix}</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-3xl font-bold text-white tracking-tight">{displayValue}</span>
                )}
                {suffix && !showMeter && <span className="text-lg text-gray-500 mb-0.5">{suffix}</span>}
            </div>

            {trend && (
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {trend}
                    </span>
                    <span className="text-xs text-gray-600">vs last period</span>
                </div>
            )}

            {/* Bottom gradient bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${colorMap[color]} opacity-60`} />
        </motion.div>
    );
});

MetricCard.displayName = 'MetricCard';
export default MetricCard;
