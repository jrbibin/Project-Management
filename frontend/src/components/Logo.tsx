import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface LogoProps extends Omit<SvgIconProps, 'children'> {
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', ...props }) => {
  if (variant === 'icon') {
    return (
      <SvgIcon {...props} viewBox="0 0 100 100">
        {/* Circular background */}
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
        
        {/* Person silhouette */}
        <path
          d="M35 25c0-8 6-14 14-14s14 6 14 14-6 14-14 14-14-6-14-14zm-5 50c0-12 10-22 22-22s22 10 22 22v5H30v-5z"
          fill="#2196F3"
        />
        
        {/* Sparkles */}
        <path d="M25 20l2 6 6-2-6-2-2-6z" fill="#4CAF50" />
        <path d="M70 15l1.5 4.5 4.5-1.5-4.5-1.5L70 15z" fill="#FF9800" />
        <path d="M75 35l1 3 3-1-3-1-1-3z" fill="#9C27B0" />
        <path d="M20 45l1.5 4.5 4.5-1.5-4.5-1.5L20 45z" fill="#00BCD4" />
        <path d="M75 65l1 3 3-1-3-1-1-3z" fill="#FF5722" />
        <path d="M25 75l1.5 4.5 4.5-1.5-4.5-1.5L25 75z" fill="#FFEB3B" />
        
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E63" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
      </SvgIcon>
    );
  }

  if (variant === 'text') {
    return (
      <SvgIcon {...props} viewBox="0 0 200 60">
        {/* ETRA text */}
        <text x="10" y="35" fontSize="24" fontWeight="bold" fill="url(#textGradient)">
          ETRA
        </text>
        {/* DREAMS text */}
        <text x="10" y="55" fontSize="16" fontWeight="600" fill="#666">
          DREAMS
        </text>
        
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E91E63" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
      </SvgIcon>
    );
  }

  // Full logo with icon and text
  return (
    <SvgIcon {...props} viewBox="0 0 300 100">
      {/* Icon part */}
      <g transform="translate(10, 10)">
        <circle cx="40" cy="40" r="35" fill="url(#fullLogoGradient)" />
        
        {/* Person silhouette */}
        <path
          d="M30 22c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10zm-3 36c0-9 7-16 16-16s16 7 16 16v4H27v-4z"
          fill="#2196F3"
        />
        
        {/* Sparkles */}
        <path d="M22 18l1.5 4.5 4.5-1.5-4.5-1.5L22 18z" fill="#4CAF50" />
        <path d="M55 15l1 3 3-1-3-1-1-3z" fill="#FF9800" />
        <path d="M58 30l0.8 2.4 2.4-0.8-2.4-0.8L58 30z" fill="#9C27B0" />
        <path d="M18 35l1 3 3-1-3-1-1-3z" fill="#00BCD4" />
        <path d="M58 50l0.8 2.4 2.4-0.8-2.4-0.8L58 50z" fill="#FF5722" />
        <path d="M22 60l1 3 3-1-3-1-1-3z" fill="#FFEB3B" />
      </g>
      
      {/* Text part */}
      <g transform="translate(100, 0)">
        {/* ETRA text */}
        <text x="0" y="45" fontSize="32" fontWeight="bold" fill="url(#fullTextGradient)">
          ETRA
        </text>
        {/* DREAMS text */}
        <text x="0" y="70" fontSize="18" fontWeight="600" fill="#666" letterSpacing="2px">
          DREAMS
        </text>
        <text x="0" y="85" fontSize="12" fontWeight="400" fill="#999">
          PRIVATE LIMITED
        </text>
      </g>
      
      <defs>
        <linearGradient id="fullLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
        <linearGradient id="fullTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};

export default Logo;