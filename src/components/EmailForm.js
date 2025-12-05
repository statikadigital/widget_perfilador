import React, { useState, useEffect } from 'react';
import { sendEmail, sendOauth2Emails } from '../api';
import { moneyToNumber, numberToMoney, safeUUID } from '../utils';
import './EmailForm.css';

const EmailForm = ({ 
  simulationData, 
  profile, 
  portfolioName,
  isMobile = false 
}) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailInput = document.querySelector(`#${isMobile ? 'mobile' : 'desktop'}-email-input`);
    if (emailInput) {
      setIsValid(emailInput.checkValidity());
    }
  }, [email, isMobile]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValid(e.target.checkValidity());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const invInicial = moneyToNumber(simulationData?.inversionInicial || '0');
      const invMensual = moneyToNumber(simulationData?.inversionMensual || '0');
      const plazoVal = Number(simulationData?.duracionPlazo || 0);
      const plazoTipo = simulationData?.period === 'years' ? 'años' : 'meses';
      const clave = safeUUID();

      const correoData = {
        NumContrato: "1",
        email: email,
        perfil: profile || 'Moderado',
        invInicial: numberToMoney(invInicial),
        invMensual: numberToMoney(invMensual),
        plazo: `${plazoVal} ${plazoVal === 1 ? plazoTipo.slice(0, -1) : plazoTipo}`,
        fondo: portfolioName || '',
        clave: clave,
        esceConservador: simulationData?.scenarioConservative || '',
      };

      const formattedData = {
        email: correoData.email,
        perfil: correoData.perfil,
        invInicial: correoData.invInicial,
        invMensual: correoData.invMensual,
        plazo: correoData.plazo,
        NumContrato: correoData.NumContrato,
        fondo: correoData.fondo,
        clave: correoData.clave,
        esceConservador: correoData.esceConservador,
        nameTemplateEcommerce: "ecommerce_invest",
        versionTemplateEcommerce: "1",
        hrefEcommerce: "https://principal.com.mx/inversion/FondosE2E?utm_source=Mailing&utm_medium=Salesforce&utm_campaign=ResultadosSimulador",
      };

      await sendEmail(correoData);
      await sendOauth2Emails(formattedData);

      alert('El correo se envió correctamente.');
      setEmail('');
    } catch (error) {
      console.error('Error enviando email:', error);
      alert('Ocurrió un error al enviar el correo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formClass = isMobile 
    ? 'form-email input-container mobile simulator-email-form' 
    : 'form-email input-container desktop simulator-email-form';

  return (
    <div className={formClass}>
      <form className="form-area-email" onSubmit={handleSubmit}>
        <div className="label">
          <p>
            <span>
              {isMobile 
                ? '¿A qué correo quieres que te enviemos los resultados de tu simulación?'
                : '¿A qué correo quieres que te enviemos tus resultados?'
              }
            </span>
            {!isMobile && <br />}
            {!isMobile && 'Correo electrónico'}
            {isMobile && (
              <p>Correo electrónico</p>
            )}
          </p>
        </div>
        <p>
          <input
            id={isMobile ? 'mobile-email-input' : 'desktop-email-input'}
            name="email"
            required
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            id={isMobile ? 'mobile-email-btn' : 'desktop-email-btn'}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mis resultados'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default EmailForm;

