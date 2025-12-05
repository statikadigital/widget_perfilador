import React from 'react';
import './Loader.css';

interface LoaderProps {
  show: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <section className="waiter-form">
      <div className="loader center"></div>
    </section>
  );
};

export default Loader;

