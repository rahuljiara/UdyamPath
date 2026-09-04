import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo/Logo.png';
import { ROUTES } from '../../routes/paths';

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const Logo = ({
  size = 'md',
  withText = true,
  to = ROUTES.DASHBOARD,
  className = '',
  textColor = 'text-text-primary',
  subtitleColor = 'text-text-muted',
  onClick
}) => {
  const imgSizeClass = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoImg}
        alt="UdyamPath Logo"
        className={`${imgSizeClass} object-contain transition-transform duration-200 group-hover:scale-105`}
      />
      {withText && (
        <div className="leading-tight">
          <span className={`text-base font-bold tracking-tight block leading-none ${textColor}`}>
            Udyam<span className="text-primary">Path</span>
          </span>
          <span className={`text-[10px] font-medium uppercase tracking-widest mt-1 block ${subtitleColor}`}>
            Campus to Career
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="focus:outline-none group inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
