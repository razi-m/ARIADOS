import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Card = memo(({
    children,
    title,
    icon: Icon,
    action,
    onClick,
    className = '',
    headerClassName = '',
    noPadding = false,
    animate = true,
}) => {
    const Wrapper = animate ? motion.div : 'div';
    const wrapperProps = animate
        ? { whileHover: { borderColor: 'rgba(0,212,255,0.3)' }, transition: { duration: 0.3 } }
        : {};

    return (
        <Wrapper
            className={`glass-panel rounded-xl overflow-hidden ${className}`}
            {...wrapperProps}
        >
            {title && (
                <div className={`flex items-center justify-between px-6 py-4 border-b border-white/5 ${headerClassName}`}>
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    {action && (
                        <button
                            onClick={onClick}
                            className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                            {typeof action === 'string' ? (
                                <span className="flex items-center gap-1 text-sm">{action} <ChevronRight className="w-4 h-4" /></span>
                            ) : action}
                        </button>
                    )}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </Wrapper>
    );
});

Card.displayName = 'Card';
export default Card;
