import React, { memo } from 'react';

const Badge = memo(({ children, variant = 'default', size = 'sm', className = '', dot = false }) => {
    const variants = {
        default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        primary: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        low: 'severity-low',
        medium: 'severity-medium',
        high: 'severity-high',
        critical: 'severity-critical',
        queued: 'status-queued',
        processing: 'status-processing',
        completed: 'status-completed',
        failed: 'status-failed',
    };

    const sizes = {
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';
export default Badge;
