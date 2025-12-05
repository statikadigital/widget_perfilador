import React, { useState, useEffect, useRef } from 'react';
import './QuestionForm.css';

const QuestionForm = ({
  questions,
  currentQuestion,
  questionIndex,
  totalSteps,
  selectedAnswer,
  onAnswerChange,
  onBack,
  onContinue,
  showContinueButton,
  onShowBlocker
}) => {
  const [error, setError] = useState('');
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const timeoutRef = useRef(null);

  const handleRadioChange = (questionId, answerValue) => {
    setError('');
    
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Actualizar la respuesta seleccionada
    onAnswerChange(questionId, answerValue);
    
    // Si es la última pregunta, mostrar botón de continuar
    if (questionIndex === totalSteps - 1) {
      setShowContinueBtn(true);
    } else {
      // Para preguntas 1-4, avanzar automáticamente después de 2 segundos
      if (onShowBlocker) {
        onShowBlocker(true);
      }
      timeoutRef.current = setTimeout(() => {
        onContinue(answerValue);
      }, 2000);
    }
  };

  // Limpiar timeout al desmontar o cambiar de pregunta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [questionIndex]);

  const handleContinue = () => {
    if (!selectedAnswer) {
      setError('Selecciona una respuesta para continuar');
      return;
    }
    onContinue(selectedAnswer);
  };

  // Resetear el botón de continuar cuando cambia la pregunta
  useEffect(() => {
    setShowContinueBtn(false);
    setError('');
  }, [questionIndex]);

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="container formulario">
      <div className="links-area">
        <button
          type="button"
          className="btn-regresa"
          onClick={onBack}
        >
          <img
            src="https://www.principal.com.mx/sites/default/files/2022-10/rowl.png"
            alt=""
            style={{ width: 'auto', marginRight: '10px' }}
          />
          {questionIndex === 0 ? 'Regresar' : 'Pregunta anterior'}
        </button>
      </div>

      <div className="title-form-area">
        ¿Qué tipo de inversionista eres?
      </div>

      <form>
        <div className="col indicacion">
          <p>{currentQuestion.question}</p>
        </div>

        <div className="col buttons">
          {currentQuestion.answerOptions && currentQuestion.answerOptions.map((option) => {
            const radioId = `customRadio${option.id}`;
            const isChecked = selectedAnswer === option.order;

            return (
              <div key={option.id} className="custom-control custom-radio button">
                <input
                  type="radio"
                  className="custom-control-input"
                  id={radioId}
                  name={`customRadio${currentQuestion.id}`}
                  value={option.order}
                  checked={isChecked}
                  onChange={() => handleRadioChange(currentQuestion.id, option.order)}
                />
                <label className="custom-control-label" htmlFor={radioId}>
                  {option.answerText}
                </label>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="chk-error" style={{ color: 'rgb(192, 0, 0)', textAlign: 'center' }}>
            {error}
          </div>
        )}
      </form>

      <div className="current-page">
        {questionIndex + 1}/{totalSteps}
      </div>

      {(showContinueButton || showContinueBtn) && (
        <button
          type="button"
          className="continueLink btn main-btn"
          onClick={handleContinue}
        >
          Continuar
        </button>
      )}
    </div>
  );
};

export default QuestionForm;

