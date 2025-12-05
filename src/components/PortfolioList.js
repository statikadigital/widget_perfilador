import React from 'react';
import './PortfolioList.css';

const PortfolioList = ({ 
  portfolio = {},
  portfolioName = '',
  show = false 
}) => {
  if (!show || !portfolio) return null;

  const labels = [];
  const values = [];

  // Extraer labels y values del objeto portfolio
  Object.entries(portfolio).forEach(([key, raw]) => {
    if (key === 'portafolio_1' || key === 'portafolio_2' || key === 'perfil') return;
    const num = parseFloat(String(raw).replace(',', '.'));
    if (!isNaN(num) && num > 0) {
      labels.push(key.replace(/_/g, ' '));
      values.push(Number(num.toFixed(2)));
    }
  });

  const portafolio_1 = portfolio.portafolio_1 || '';
  const portafolio_2 = portfolio.portafolio_2 ? (' + ' + portfolio.portafolio_2) : '';
  const fullPortfolioName = portafolio_1 + portafolio_2 || portfolioName;

  return (
    <div className="col-md-6 inversion">
      <div className="text-container">
        <h3>¿En qué se invertiría mi dinero?</h3>
        <p>
          Te recomendamos invertir en el siguiente portafolio:{' '}
          <span className="font-bold-custom">GUBERNAMENTAL</span>{' '}
          (<span className="font-bold-custom" id="activostitulo2">
            {fullPortfolioName}
          </span>).
        </p>
      </div>

      <div className="activos" style={{ display: 'block' }}>
        <p id="activostitulo">{fullPortfolioName}</p>
        <p className="d-flex">
          Liquidez de la cartera <span className="ml-auto">15%</span>
        </p>
        <ul id="activoslistado">
          {labels.map((label, index) => {
            const value = values[index];
            if (value === 0) return null;
            return (
              <React.Fragment key={index}>
                <li>
                  {label}: <span>{value.toFixed(2)}%</span>
                </li>
                <div className="full-bar"></div>
                <div className="parcial-bar" style={{ width: `${value}%` }}></div>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PortfolioList;

