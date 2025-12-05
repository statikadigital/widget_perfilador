import React from 'react';
import './ScreenBlocker.css';

interface ScreenBlockerProps {
  show: boolean;
}

const ScreenBlocker: React.FC<ScreenBlockerProps> = ({ show }) => {
  return <div className={`screen-blocker ${show ? 'show' : ''}`}></div>;
};

export default ScreenBlocker;

