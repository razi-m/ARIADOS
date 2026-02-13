import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loader = memo(({ message = 'Loading...', fullScreen = false }) => {
    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4"
        >
            <div className="relative">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-cyan-400/20 animate-ping" />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">{message}</p>
        </motion.div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-16">
            {content}
        </div>
    );
});

export const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <div className={`${width} ${height} bg-white/5 rounded animate-pulse ${className}`} />
);

export const SkeletonCard = () => (
    <div className="glass-panel rounded-xl p-6 space-y-4 animate-pulse">
        <SkeletonLine width="w-1/3" height="h-5" />
        <SkeletonLine width="w-2/3" />
        <SkeletonLine width="w-1/2" />
    </div>
);

Loader.displayName = 'Loader';
export default Loader;
