import React from 'react';
import './Loader.css';

const Loader = ({ show }) => {
  if (!show) return null;
  
  return (
    <section className="waiter-form">
      <div className="loader center"></div>
    </section>
  );
};

export default Loader;


