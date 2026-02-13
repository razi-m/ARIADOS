import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = memo(({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'glow-button text-white',
        secondary: 'outline-button bg-transparent',
        ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-7 py-3 text-base gap-2.5',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
            {IconRight && !loading && <IconRight className="w-4 h-4" />}
        </motion.button>
    );
});

Button.displayName = 'Button';
export default Button;
