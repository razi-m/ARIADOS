import React from 'react';

/**
 * Logo component.
 *
 * Props:
 *   className  — controls the height (e.g. "h-8", "h-12"). Width is automatic.
 *   variant    — "light" (default): white text for dark backgrounds
 *                "dark": near-black text for white/light backgrounds
 */
const Logo = ({ className = 'h-8', variant = 'light' }) => {
  const textColor = variant === 'dark' ? '#111827' : '#FFFFFF';

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ height: '100%' }}>
      {/* Icon: drone frame — four rotors around a central A */}
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: '100%', width: 'auto' }}
      >
        <defs>
          <linearGradient id="ig" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#60A5FA" /> {/* blue-400  */}
            <stop offset="50%"  stopColor="#A78BFA" /> {/* violet-400 */}
            <stop offset="100%" stopColor="#F472B6" /> {/* pink-400  */}
          </linearGradient>
        </defs>

        {/* Four rotor rings — bright, solid stroke */}
        <circle cx="16" cy="16" r="9"  stroke="url(#ig)" strokeWidth="4.5" />
        <circle cx="64" cy="16" r="9"  stroke="url(#ig)" strokeWidth="4.5" />
        <circle cx="16" cy="64" r="9"  stroke="url(#ig)" strokeWidth="4.5" />
        <circle cx="64" cy="64" r="9"  stroke="url(#ig)" strokeWidth="4.5" />

        {/* Connecting arms from rotors to centre */}
        <line x1="25" y1="16" x2="40" y2="32" stroke="url(#ig)" strokeWidth="3" strokeLinecap="round" />
        <line x1="55" y1="16" x2="40" y2="32" stroke="url(#ig)" strokeWidth="3" strokeLinecap="round" />
        <line x1="25" y1="64" x2="40" y2="48" stroke="url(#ig)" strokeWidth="3" strokeLinecap="round" />
        <line x1="55" y1="64" x2="40" y2="48" stroke="url(#ig)" strokeWidth="3" strokeLinecap="round" />

        {/* Central 'A' letterform */}
        <path
          d="M40 22 L26 58 M40 22 L54 58 M31 46 L49 46"
          stroke="url(#ig)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Core diamond */}
        <path
          d="M40 29 L47 40 L40 51 L33 40 Z"
          fill="url(#ig)"
        />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          color: textColor,
          fontWeight: 700,
          fontSize: '1.35em',
          letterSpacing: '0.12em',
          lineHeight: 1,
          fontFamily: 'inherit',
        }}
      >
        ARIADOS
      </span>
    </div>
  );
};

export default Logo;
