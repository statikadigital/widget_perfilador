import React, { useState, useEffect, useRef, ChangeEvent, FocusEvent } from 'react';
import { moneyToNumber, numberToMoney } from '../utils';
import { SimulationData } from '../types';
import './SimulatorForm.css';

interface SimulatorFormProps {
  initialData?: SimulationData | null;
  onDataChange?: (data: SimulationData) => void;
  isMobile?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const SimulatorForm: React.FC<SimulatorFormProps> = ({ 
  initialData, 
  onDataChange,
  isMobile = false,
  isExpanded = false,
  onToggleExpand 
}) => {
  const [inversionInicial, setInversionInicial] = useState<string>('');
  const [inversionMensual, setInversionMensual] = useState<string>('');
  const [duracionPlazo, setDuracionPlazo] = useState<number>(0);
  const [period, setPeriod] = useState<'anios' | 'meses'>('anios');
  const [liquidez, setLiquidez] = useState<'SI' | 'NO'>('NO');
  
  const [inversionInicialValid, setInversionInicialValid] = useState<boolean>(true);
  const [inversionMensualValid, setInversionMensualValid] = useState<boolean>(true);
  
  const isInitialMount = useRef<boolean>(true);
  const lastNotifiedData = useRef<string | null>(null);
  const lastInitialData = useRef<string | null>(null);

  // Inicializar desde props o queryParams (solo cuando initialData cambia externamente)
  useEffect(() => {
    if (!initialData) return;
    
    const initialDataString = JSON.stringify(initialData);
    // Solo actualizar si initialData realmente cambió
    if (lastInitialData.current === initialDataString) return;
    
    lastInitialData.current = initialDataString;
    
    const newInversionInicial = initialData.inversionInicial || '';
    const newInversionMensual = initialData.inversionMensual || '';
    const newDuracionPlazo = initialData.duracionPlazo || 0;
    const newPeriod = initialData.period === 'years' ? 'anios' : (initialData.period || 'anios') as 'anios' | 'meses';
    const newLiquidez = initialData.selected === 'option1' ? 'SI' : 'NO';
    
    setInversionInicial(newInversionInicial);
    setInversionMensual(newInversionMensual);
    setDuracionPlazo(newDuracionPlazo);
    setPeriod(newPeriod);
    setLiquidez(newLiquidez);
    
    isInitialMount.current = true;
  }, [initialData]);

  // Notificar cambios al padre (solo cuando cambian los valores, no en cada render)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // No notificar en el primer render después de inicializar
    }

    if (!onDataChange) return;

    const data: SimulationData = {
      inversionInicial,
      inversionMensual,
      duracionPlazo,
      period: period === 'anios' ? 'years' : 'meses',
      selected: liquidez === 'SI' ? 'option1' : 'option2'
    };
    
    // Solo notificar si los datos realmente cambiaron
    const dataString = JSON.stringify(data);
    if (lastNotifiedData.current !== dataString) {
      lastNotifiedData.current = dataString;
      onDataChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inversionInicial, inversionMensual, duracionPlazo, period, liquidez]);

  const handleInversionInicialFocus = (e: FocusEvent<HTMLInputElement>): void => {
    const num = moneyToNumber(e.target.value);
    e.target.value = num || '';
  };

  const handleInversionInicialInput = (e: ChangeEvent<HTMLInputElement>): void => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  };

  const handleInversionInicialChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const raw = e.target.value;
    const num = moneyToNumber(raw);
    const isValid = num >= 1000;
    
    setInversionInicialValid(isValid);
    setInversionInicial(numberToMoney(num));
  };

  const handleInversionMensualFocus = (e: FocusEvent<HTMLInputElement>): void => {
    const num = moneyToNumber(e.target.value);
    e.target.value = num || '';
  };

  const handleInversionMensualInput = (e: ChangeEvent<HTMLInputElement>): void => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  };

  const handleInversionMensualChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const raw = e.target.value;
    const num = moneyToNumber(raw);
    const isValid = num === 0 || num >= 500;
    
    setInversionMensualValid(isValid);
    setInversionMensual(numberToMoney(num));
  };

  return (
    <div className={`d-flex form-col ${isExpanded ? 'activated' : ''}`} id="form-col">
      {isMobile && (
        <div className="toggle-button mobile" onClick={onToggleExpand}>
          <p>Editar datos</p>
        </div>
      )}
      
      <div className="form-container simulator-form-container">
        <p className="font-bold-custom">Edita tus datos de simulación</p>
        
        <div className="input-container">
          <div className="label">
            <p>
              <span>Inversión inicial</span>
            </p>
            <p className="small-label">
              Este depósito puede ser desde $1,000 pesos.
            </p>
          </div>
          <div className="input">
            <input
              className="MuiInputBase-input MuiInput-input"
              id="LPF_Cambiar_Inversion_Inicial"
              name="LPF_Cambiar_Inversion_Inicial"
              type="text"
              value={inversionInicial}
              onFocus={handleInversionInicialFocus}
              onInput={handleInversionInicialInput}
              onChange={handleInversionInicialChange}
            />
          </div>
          <svg 
            className={`status status-ok ${inversionInicialValid ? '' : 'd-none'}`}
            aria-hidden="true"
            viewBox="0 0 512 512"
          >
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z" fill="currentColor" />
          </svg>
          <svg 
            className={`status status-not-ok ${inversionInicialValid ? 'd-none' : ''}`}
            aria-hidden="true"
            viewBox="0 0 512 512"
          >
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z" fill="currentColor" />
          </svg>
          <p>
            <small className={`status-msg ${inversionInicialValid ? 'd-none' : ''}`}>
              Mínimo: $1,000
            </small>
          </p>
        </div>

        <div className="input-container">
          <div className="label">
            <p>
              <span>Depósito mensual (opcional)</span>
            </p>
            <p className="small-label">
              Este monto es opcional y se programará en la fecha que tú prefieras.
            </p>
          </div>
          <div className="input">
            <input
              className="MuiInputBase-input MuiInput-input"
              id="LPF_Cambiar_Inversion_Mensual"
              name="LPF_Cambiar_Inversion_Mensual"
              type="text"
              value={inversionMensual}
              onFocus={handleInversionMensualFocus}
              onInput={handleInversionMensualInput}
              onChange={handleInversionMensualChange}
            />
          </div>
          <svg 
            className={`status status-ok ${inversionMensualValid ? '' : 'd-none'}`}
            aria-hidden="true"
            viewBox="0 0 512 512"
          >
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z" fill="currentColor" />
          </svg>
          <svg 
            className={`status status-not-ok ${inversionMensualValid ? 'd-none' : ''}`}
            aria-hidden="true"
            viewBox="0 0 512 512"
          >
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z" fill="currentColor" />
          </svg>
          <p>
            <small className={`status-msg ${inversionMensualValid ? 'd-none' : ''}`}>
              Valor debe ser igual a $0 o mayor a $500
            </small>
          </p>
        </div>

        <div className="input-container input-title">
          <div className="label">
            <p>
              <span>Periodo de tiempo que vas a invertir</span>
            </p>
            <p className="small-label">
              A mayor plazo la rentabilidad suele ser superior.
            </p>
          </div>
        </div>
        
        <div className="jss1">
          <div className="sc-jOrMOR lbatDQ">
            <div className="MuiInputBase-root MuiInput-root MuiInput-underline jss2">
              <input
                className="MuiInputBase-input MuiInput-input"
                id="LPF_Cambiar_Duracion_plazo"
                max="50"
                min="0"
                step="1"
                type="number"
                value={duracionPlazo}
                onChange={(e) => setDuracionPlazo(Number(e.target.value))}
              />
            </div>
            <p>
              <select
                className="sc-jdAMXn bJqQyw"
                id="select"
                name="select"
                style={{ width: '100%' }}
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'anios' | 'meses')}
              >
                <option value="anios">años</option>
                <option value="meses">meses</option>
              </select>
            </p>
          </div>
        </div>

        <p>
          <input
            className="radio"
            hidden
            id="LPF_Cambiar_Si_Liquidez"
            name="liquidez"
            type="radio"
            value="SI"
            checked={liquidez === 'SI'}
            onChange={() => setLiquidez('SI')}
          />
          <input
            className="radio"
            hidden
            id="LPF_Cambiar_No_Liquidez"
            name="liquidez"
            type="radio"
            value="NO"
            checked={liquidez === 'NO'}
            onChange={() => setLiquidez('NO')}
          />
        </p>

        {isMobile && (
          <div className="button-save-form mobile" onClick={onToggleExpand}>
            <p>Guardar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorForm;

