
import React from 'react';

const Logo = ({ className = "h-8", textSize = "text-xl" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG Icon: Stylized Drone 'A' with 4 rotors */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-auto aspect-square overflow-visible"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                        <stop offset="50%" stopColor="#8B5CF6" /> {/* Violet-500 */}
                        <stop offset="100%" stopColor="#EC4899" /> {/* Pink-500 */}
                    </linearGradient>
                </defs>

                {/* Drone Rotors (4 circles) */}
                <circle cx="20" cy="20" r="12" stroke="url(#logoGradient)" strokeWidth="6" opacity="0.8" />
                <circle cx="80" cy="20" r="12" stroke="url(#logoGradient)" strokeWidth="6" opacity="0.8" />
                <circle cx="20" cy="80" r="12" stroke="url(#logoGradient)" strokeWidth="6" opacity="0.8" />
                <circle cx="80" cy="80" r="12" stroke="url(#logoGradient)" strokeWidth="6" opacity="0.8" />

                {/* Central 'A' shape (Cross frame) */}
                <path
                    d="M50 20 L20 80 M50 20 L80 80 M30 60 L70 60"
                    stroke="url(#logoGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Central Diamond/Core */}
                <path
                    d="M50 35 L65 50 L50 65 L35 50 Z"
                    fill="url(#logoGradient)"
                    opacity="0.9"
                />
            </svg>

            {/* Text Logo */}
            <span className={`${textSize} font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 tracking-wide`}>
                ARIADOS
            </span>
        </div>
    );
};

export default Logo;
