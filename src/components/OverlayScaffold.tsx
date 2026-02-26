import React from 'react';

interface OverlayScaffoldProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const OverlayScaffold: React.FC<OverlayScaffoldProps> = ({ children, className = '', contentClassName = '' }) => {
  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] overflow-auto ${className}`}>
      <div className={`max-w-5xl mx-auto px-6 ${contentClassName}`}>{children}</div>
    </div>
  );
};

export default OverlayScaffold;
