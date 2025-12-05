import React from 'react';
import './ScreenBlocker.css';

const ScreenBlocker = ({ show }) => {
  return <div className={`screen-blocker ${show ? 'show' : ''}`}></div>;
};

export default ScreenBlocker;


