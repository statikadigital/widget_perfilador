import React, { useState, useEffect, useCallback } from 'react';
import { getSimulatorResource } from '../api';
import { moneyToNumber, numberToMoney, getParam, safeUUID } from '../utils';
import SimulatorForm from './SimulatorForm';
import EmailForm from './EmailForm';
import SimulationResults from './SimulationResults';
import PortfolioChart from './PortfolioChart';
import PortfolioList from './PortfolioList';
import './Simulator.css';

const Simulator = ({ initialData = null }) => {
  const [formData, setFormData] = useState({
    inversionInicial: '',
    inversionMensual: '',
    duracionPlazo: 0,
    period: 'anios',
    selected: 'option2'
  });
  
  const [profile, setProfile] = useState('Moderado');
  const [simulationResult, setSimulationResult] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 699);

  // Detectar si es mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 699);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inicializar desde queryParams o props
  useEffect(() => {
    const amount = Number(getParam('amount') || 0);
    const extra = Number(getParam('extra') || 0);
    const noperiod = Number(getParam('noperiod') || 0);
    const periodParam = (getParam('period') || '').toLowerCase();
    const risk = getParam('risklevel') || initialData?.profile || 'Moderado';
    const selected = getParam('selected') || 'option2';

    setFormData({
      inversionInicial: amount > 0 ? numberToMoney(amount) : (initialData?.inversionInicial || ''),
      inversionMensual: extra > 0 ? numberToMoney(extra) : (initialData?.inversionMensual || ''),
      duracionPlazo: noperiod || initialData?.duracionPlazo || 0,
      period: periodParam === 'years' ? 'anios' : (initialData?.period === 'years' ? 'anios' : 'anios'),
      selected: selected || initialData?.selected || 'option2'
    });
    
    setProfile(risk);
  }, [initialData]);

  // Función para procesar la simulación
  const processSimulation = useCallback(async (data) => {
    setLoading(true);
    
    try {
      const invIni = moneyToNumber(data.inversionInicial || '0');
      const invMen = moneyToNumber(data.inversionMensual || '0');
      const periodo = data.period === 'years' ? 'anios' : 'meses';
      const dur = Number(data.duracionPlazo || 0);
      const currentProfile = profile;
      const liquidity = data.selected === 'option1' ? 'Si' : 'No';
      
      const uuid = safeUUID();
      let storedUuid = sessionStorage.getItem('uuid_principal_user');
      if (!storedUuid) {
        sessionStorage.setItem('uuid_principal_user', uuid);
        storedUuid = uuid;
      }

      const payload = {
        idSession: storedUuid,
        initialInvestment: invIni,
        monthlyContribution: invMen,
        inversionDuracionTipo: periodo,
        term: dur,
        liquidity,
        profile: currentProfile
      };

      const response = await getSimulatorResource(payload);
      const responseApi = response?.Message?.responseApi ?? {};
      const nivel = response?.Message?.nivel_portafolio ?? {};

      setSimulationResult(responseApi);
      setPortfolio(nivel);

      // Extraer nombre del portafolio
      const portafolio_1 = nivel.portafolio_1 || '';
      const portafolio_2 = nivel.portafolio_2 ? (' + ' + nivel.portafolio_2) : '';
      setPortfolioName(portafolio_1 + portafolio_2);

    } catch (error) {
      console.error('Error en simulación:', error);
      alert('Ocurrió un error al calcular la simulación. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Procesar simulación cuando cambian los datos del formulario
  useEffect(() => {
    if (formData.inversionInicial && moneyToNumber(formData.inversionInicial) >= 1000) {
      processSimulation(formData);
    }
  }, [formData, processSimulation]);

  const handleFormDataChange = useCallback((data) => {
    setFormData(prevData => {
      // Solo actualizar si los valores realmente cambiaron
      if (
        prevData.inversionInicial !== data.inversionInicial ||
        prevData.inversionMensual !== data.inversionMensual ||
        prevData.duracionPlazo !== data.duracionPlazo ||
        prevData.period !== data.period ||
        prevData.selected !== data.selected
      ) {
        return data;
      }
      return prevData;
    });
  }, []);

  const handleToggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  // Preparar datos para el gráfico
  const chartLabels = [];
  const chartValues = [];
  
  if (portfolio) {
    Object.entries(portfolio).forEach(([key, raw]) => {
      if (key === 'portafolio_1' || key === 'portafolio_2' || key === 'perfil') return;
      const num = parseFloat(String(raw).replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        chartLabels.push(key.replace(/_/g, ' '));
        chartValues.push(Number(num.toFixed(2)));
      }
    });
  }

  // Construir URL para el formulario de inversión
  const getInversionFormUrl = () => {
    const uuid = sessionStorage.getItem('uuid_principal_user') || safeUUID();
    const base = new URL('https://principal.com.mx/inversion/FondosE2E');
    base.searchParams.set('org', uuid);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(k => {
      const v = getParam(k);
      if (v) base.searchParams.set(k, v);
    });
    return base.pathname + base.search;
  };

  return (
    <section className="perfil">
      <div className="container">
        <div className="d-md-flex box-border">
          <div className="col-md-4 p-0">
            <SimulatorForm
              initialData={formData}
              onDataChange={handleFormDataChange}
              isMobile={isMobile}
              isExpanded={isFormExpanded}
              onToggleExpand={handleToggleForm}
            />
            
            <EmailForm
              simulationData={formData}
              profile={profile}
              portfolioName={portfolioName}
              isMobile={false}
            />
          </div>

          <div className="col-md-8 d-flex wrap">
            <SimulationResults
              data={simulationResult}
              loading={loading}
              profile={profile}
              onGetInversionFormUrl={getInversionFormUrl}
            />

            <PortfolioList
              portfolio={portfolio}
              portfolioName={portfolioName}
              show={!!portfolio}
            />

            <PortfolioChart
              labels={chartLabels}
              values={chartValues}
            />

            <EmailForm
              simulationData={formData}
              profile={profile}
              portfolioName={portfolioName}
              isMobile={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Simulator;

