import React, { FormEvent } from 'react';
import { numberToMoney, safeUUID } from '../utils';
import { SimulationResult } from '../types';
import './SimulationResults.css';

interface SimulationResultsProps {
  data?: SimulationResult | null;
  loading?: boolean;
  profile?: string;
  onGetInversionFormUrl?: () => string;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  data, 
  loading = false,
  profile = 'MODERADO',
  onGetInversionFormUrl
}) => {
  const {
    estimatedamount = 0,
    scenarioConservative = 0,
    scenarioOptimistic = 0,
    capitalInvested = 0,
    yield: yieldAmount = 0
  } = data || {};

  const estPorc = capitalInvested
    ? ((yieldAmount / capitalInvested) * 100).toFixed(2)
    : '0.00';

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    if (!onGetInversionFormUrl) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="col-md-12 simulacion">
        <div className="text-container perfil-container">
          <p className="title-perfil font-bold-custom">
            Perfil proyectado
          </p>
          <p>
            Aquí está el resultado de tu simulación, según tu perfil{' '}
            <span className="font-bold-custom font-trans-upper" id="new-profile">
              {profile.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="col-md-12 proyeccion">
        <div className="container-amounts">
          <div className="amount-container">
            <p>Monto estimado*</p>
            {loading ? (
              <div className="centered" id="waiting_estimado">
                <div className="loader_small"></div>
              </div>
            ) : (
              <p className="money font-bold-custom" id="amount_estimado">
                {numberToMoney(estimatedamount)}{' '}
                <span className="green-text">{estPorc}%</span>
              </p>
            )}
          </div>

          <div className="amount-container">
            {loading ? (
              <div className="centered" id="waiting_conservador">
                <div className="loader_small"></div>
              </div>
            ) : (
              <p className="money font-bold-custom" id="amount_conservador">
                {numberToMoney(scenarioConservative)}
              </p>
            )}
            <p>Escenario conservador</p>
          </div>

          <div className="amount-container">
            {loading ? (
              <div className="centered" id="waiting_optimista">
                <div className="loader_small"></div>
              </div>
            ) : (
              <p className="money font-bold-custom" id="amount_optimista">
                {numberToMoney(scenarioOptimistic)}
              </p>
            )}
            <p>Escenario optimista</p>
          </div>
        </div>

        <div className="img-container torre">
          <img
            src="https://www.principal.com.mx/sites/default/files/2022-10/stack.png"
            alt="Torre"
            width="231"
            height="224"
          />
          <div className="amount-container first">
            <p id="towerRendimiento">
              {numberToMoney(yieldAmount)}
            </p>
            <p>
              <span className="font-bold-custom">Rendimiento</span>
            </p>
          </div>
          <div className="amount-container second">
            <p id="towerCapitalInvertido">
              {numberToMoney(capitalInvested)}
            </p>
            <p>
              <span className="font-bold-custom">Capital invertido</span>
            </p>
          </div>
        </div>

        {onGetInversionFormUrl && (
          <form 
            action={onGetInversionFormUrl()} 
            id="forminvertir" 
            method="post"
            onSubmit={handleFormSubmit}
          >
            <p>
              <input
                id="user"
                name="user"
                type="hidden"
                value={sessionStorage.getItem('uuid_principal_user') || safeUUID()}
              />
              <input
                id="sourceonboarding"
                name="sourceonboarding"
                type="hidden"
                value="F"
              />
              <input
                id="tipoperfilamiento"
                name="tipoperfilamiento"
                type="hidden"
                value="A"
              />
            </p>
            <div className="small-text">
              <p>
                <small>Podrás hacer los cambios que prefieras al momento de invertir.</small>
              </p>
            </div>
            <p>
              <button
                className="sc-ezWOiH kpaUaa"
                id="Simulador_Ya_quiero_invertir"
                type="submit"
              >
                Empezar a invertir
              </button>
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default SimulationResults;

