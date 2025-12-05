import React from 'react';
import './StepsIndicator.css';

interface StepsIndicatorProps {
  currentStep: number;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="steps-container">
      <div className="steps">
        <div className="progress-bar"></div>
        <div className={`step step1 ${currentStep >= 1 ? 'on' : ''}`}>
          Datos de<br />simulación
        </div>
        <div className={`step step2 ${currentStep >= 2 ? 'on' : ''}`}>
          Perfílate
        </div>
        <div className={`step step3 ${currentStep >= 3 ? 'on' : ''}`}>
          Simulación
        </div>
      </div>
    </div>
  );
};

export default StepsIndicator;

