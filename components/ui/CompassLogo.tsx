import React from 'react';

interface CompassLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
  spinFast?: boolean;
}

export const CompassLogo: React.FC<CompassLogoProps> = ({ className = "", size = 40, animate = false, spinFast = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* SVG Container */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* 1. Compass Loop/Handle at top */}
        <path d="M48 2 L52 2 L52 -2 L48 -2 Z" fill="#D95D2E" />
        <path d="M50 -2 C 52 -2, 53 -3, 53 -5 C 53 -7, 51.5 -8, 50 -8 C 48.5 -8, 47 -7, 47 -5 C 47 -3, 48 -2, 50 -2" fill="#D95D2E" />

        {/* 2. Outer Ring (Orange) */}
        <circle cx="50" cy="50" r="45" stroke="#D95D2E" strokeWidth="5" fill="none" />
        
        {/* 3. Mountain (Green) - Masked inside circle */}
        <defs>
          <mask id="circle-mask">
             <circle cx="50" cy="50" r="43" fill="white" />
          </mask>
        </defs>
        
        <g mask="url(#circle-mask)">
          {/* 
            Mountain Path Logic (Updated):
            - Starts at bottom left.
            - Left Side Peak: Moved closer (34) and made taller (45).
            - Left Valley: Adjusted to (42, 55).
            - Main Peak: (50, 25).
            - Right Valley: Adjusted to (58, 55).
            - Right Side Peak: Moved closer (66) and made taller (45).
            - Ends at bottom right.
          */}
          <path 
            d="M 0 90 
               L 34 45 
               L 42 55 
               L 50 25 
               L 58 55 
               L 66 45 
               L 100 90 
               V 100 H 0 Z" 
            fill="#2C4A3B" 
            stroke="#2C4A3B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      
      {/* 4. Spinning Needle (Overlay) */}
      <div className={`absolute inset-0 flex items-center justify-center ${animate ? (spinFast ? 'animate-spin-fast' : 'animate-spin-slow') : ''}`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
          style={{ transformOrigin: 'center', transform: 'rotate(45deg)' }} 
        >
           {/* Needle Shape - Dark Navy/Blue */}
           {/* Long point to North (Top Right in rotated view), Short to South */}
           <path d="M50 15 L62 50 L50 85 L38 50 Z" fill="#0F2C3E" /> 
           
           {/* Light half for 3D effect (Right side) */}
           <path d="M50 15 L62 50 L50 50 Z" fill="#1B3B50" />
           
           {/* Center White Dot */}
           <circle cx="50" cy="50" r="4" fill="white" />
        </svg>
      </div>
    </div>
  );
};