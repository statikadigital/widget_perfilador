import React, { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';
import { formatMoneyInput, moneyToNumber, intVal } from '../utils';
import { FormErrors } from '../types';
import './SimulationForm.css';

interface SimulationFormProps {
  onContinue: (data: {
    inversionInicial: string;
    inversionMensual: string;
    duracionPlazo: string;
    period: string;
  }) => void;
  onBack?: (() => void) | null;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ onContinue, onBack }) => {
  const [inversionInicial, setInversionInicial] = useState<string>('');
  const [inversionMensual, setInversionMensual] = useState<string>('');
  const [duracionPlazo, setDuracionPlazo] = useState<string>('');
  const [period, setPeriod] = useState<string>('years');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInversionInicialChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInversionInicial(value);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  const handleInversionInicialBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const formatted = formatMoneyInput(value);
    setInversionInicial(formatted);
  };

  const handleInversionMensualChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInversionMensual(value);
  };

  const handleInversionMensualBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const formatted = formatMoneyInput(value);
    setInversionMensual(formatted);
  };

  const handleDuracionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    setDuracionPlazo(numericValue);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.noperiod) {
      setErrors({ ...errors, noperiod: '' });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Limpiar errores previos
    const newErrors: FormErrors = {};

    // Formatear campos antes de validar (por si el usuario no hizo blur)
    const formattedInicial = formatMoneyInput(inversionInicial);
    const formattedMensual = formatMoneyInput(inversionMensual);
    
    // Actualizar estado con valores formateados
    if (formattedInicial !== inversionInicial) {
      setInversionInicial(formattedInicial);
    }
    if (formattedMensual !== inversionMensual) {
      setInversionMensual(formattedMensual);
    }

    // Validar con los valores formateados
    const finalInicial = formattedInicial || inversionInicial;
    const amountNum = moneyToNumber(finalInicial);
    const noperiodNum = intVal(duracionPlazo);

    // Validar inversión inicial
    if (!finalInicial || finalInicial.trim() === '' || amountNum === 0) {
      newErrors.amount = 'El monto a invertir es requerido';
    } else if (amountNum < 1000) {
      newErrors.amount = 'El monto a invertir debe ser mayor o igual a $1,000';
    }

    // Validar duración del plazo
    if (!duracionPlazo || duracionPlazo.trim() === '') {
      newErrors.noperiod = 'El plazo a invertir es requerido';
    } else if (noperiodNum <= 0) {
      newErrors.noperiod = 'El plazo a invertir debe ser mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si todo está bien, continuar con valores formateados
    onContinue({
      inversionInicial: finalInicial,
      inversionMensual: formattedMensual || inversionMensual,
      duracionPlazo,
      period
    });
  };

  return (
    <div className="stage on">
      <div className="form-container container">
        <div className="col">
          {onBack && (
            <div className="return-button">
              <button type="button" className="btn" onClick={onBack}>
                Regresar
              </button>
            </div>
          )}
          <div className="title-area">
            <h2>¡Vamos a simular tu inversión!</h2>
          </div>

          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="LPF_Inversion_inicial">
                  <span>¿Cuánto piensas invertir?</span>
                </label>
                <br />
                <label htmlFor="LPF_Inversion_inicial">
                  Este depósito puede ser desde $1,000 pesos.
                </label>
                <input
                  className={`form-control ${errors.amount ? 'error-stepo' : ''}`}
                  id="LPF_Inversion_inicial"
                  required
                  type="text"
                  value={inversionInicial}
                  onChange={handleInversionInicialChange}
                  onBlur={handleInversionInicialBlur}
                  placeholder="$0.00"
                />
                {errors.amount && (
                  <div className="errortext" aria-live="polite">
                    {errors.amount}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="LPF_Inversion_Mensual">
                  <span>
                    Llega más pronto a tu meta aportando más dinero cada mes,
                    ¿cuánto te gustaría?
                  </span>
                </label>
                <input
                  className="form-control"
                  id="LPF_Inversion_Mensual"
                  type="text"
                  value={inversionMensual}
                  onChange={handleInversionMensualChange}
                  onBlur={handleInversionMensualBlur}
                  placeholder="$0.00"
                />
              </div>

              <div className="form-group">
                <p>
                  <label htmlFor="LPF_Duracion_plazo">
                    <span>¿Por cuánto tiempo quieres dejar tu inversión?</span>
                    A mayor plazo la rentabilidad suele ser superior.
                  </label>
                </p>
                <div className="dual-field">
                  <input
                    className={`form-control ${errors.noperiod ? 'error-stepo' : ''}`}
                    id="LPF_Duracion_plazo"
                    required
                    type="text"
                    inputMode="numeric"
                    value={duracionPlazo}
                    onChange={handleDuracionChange}
                    placeholder="0"
                  />
                  <select
                    id="period"
                    name="period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="years">Años</option>
                    <option value="months">Meses</option>
                  </select>
                </div>
                {errors.noperiod && (
                  <div className="errortext" aria-live="polite">
                    {errors.noperiod}
                  </div>
                )}
              </div>

              <div className="small-text">
                <p>
                  <span>
                    Los resultados del cálculo en ningún caso garantiza
                    rendimiento futuros
                  </span>
                </p>
              </div>

              <div className="btns">
                <button type="submit" className="btn main-btn">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationForm;

