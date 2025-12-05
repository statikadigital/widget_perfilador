import React, { useState, useEffect } from 'react';
import { safeUUID, moneyToNumber, getParam } from '../utils';
import { fetchCatalogResource, registerAnswers } from '../api';
import { Question, SimulationData } from '../types';
import StepsIndicator from './StepsIndicator';
import SimulationForm from './SimulationForm';
import QuestionForm from './QuestionForm';
import FinalProfile from './FinalProfile';
import Simulator from './Simulator';
import Loader from './Loader';
import ScreenBlocker from './ScreenBlocker';
import '../styles.css';

const Perfilador: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: simulación, 2-6: preguntas, 7: final, 8: simulador
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number>>({});
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBlocker, setShowBlocker] = useState<boolean>(false);
  const [finalProfile, setFinalProfile] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Inicializar UUID de usuario
  useEffect(() => {
    let mode = sessionStorage.getItem('uuid_principal_user');
    if (!mode) {
      mode = safeUUID();
      sessionStorage.setItem('uuid_principal_user', mode);
    }
    setUserId(mode);
  }, []);

  // Cargar preguntas cuando se avanza al paso 2
  useEffect(() => {
    if (currentStep === 2 && questions.length === 0) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const loadQuestions = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchCatalogResource();
      if (data && data.result) {
        setQuestions(data.result);
      }
    } catch (error) {
      alert('No se pudo cargar el perfilador. Intenta de nuevo más tarde.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationContinue = (data: {
    inversionInicial: string;
    inversionMensual: string;
    duracionPlazo: string;
    period: string;
  }): void => {
    const amount = moneyToNumber(data.inversionInicial);
    const extra = moneyToNumber(data.inversionMensual);
    const noperiod = parseInt(data.duracionPlazo) || 0;

    setSimulationData({
      ...data,
      duracionPlazo: noperiod,
      period: data.period as 'anios' | 'years' | 'meses',
      selected: 'option2',
      amount,
      extra,
      noperiod,
      inversionInicial: getParam('iinicial') || data.inversionInicial,
      inversionMensual: getParam('imensual') || data.inversionMensual
    });
    setCurrentStep(2);
  };

  const handleAnswerChange = (questionId: string, answerValue: string | number): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const handleQuestionContinue = async (answerValue: string | number | null = null): Promise<void> => {
    const currentQuestionIndex = currentStep - 2; // currentStep 2 = index 0
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Usar el valor pasado directamente o buscar en el estado
    const answer = answerValue !== null ? answerValue : selectedAnswers[currentQuestion.id];
    if (!answer) {
      // Si no hay respuesta seleccionada, no hacer nada
      return;
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    await processAnswer(currentQuestion.id, answer, isLastQuestion);
  };

  const processAnswer = async (questionId: string, answer: string | number, isLastQuestion: boolean): Promise<void> => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const result = await registerAnswers(userId, questionId, answer);
      
      if (isLastQuestion) {
        // Última pregunta - mostrar perfil final
        const profile = result?.Message?.profile || 'Moderado';
        setFinalProfile(profile);
        setCurrentStep(7);
      } else {
        // Avanzar a siguiente pregunta
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error registrando respuesta:', error);
      setLoading(false);
      setShowBlocker(false);
    } finally {
      setLoading(false);
      setShowBlocker(false);
    }
  };

  const handleQuestionBack = (): void => {
    if (currentStep === 2) {
      // Volver al formulario de simulación
      setCurrentStep(1);
    } else if (currentStep > 2) {
      // Limpiar respuesta de la pregunta actual
      const prevQuestionIndex = currentStep - 3;
      const prevQuestion = questions[prevQuestionIndex];
      if (prevQuestion) {
        const newAnswers = { ...selectedAnswers };
        delete newAnswers[prevQuestion.id];
        setSelectedAnswers(newAnswers);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRetry = (): void => {
    setCurrentStep(2);
    setSelectedAnswers({});
    setFinalProfile(null);
  };

  const renderContent = (): React.ReactElement | null => {
    if (currentStep === 1) {
      return (
        <SimulationForm
          onContinue={handleSimulationContinue}
          onBack={null}
        />
      );
    } else if (currentStep >= 2 && currentStep <= 6) {
      const questionIndex = currentStep - 2;
      const currentQuestion = questions[questionIndex];
      
      if (!currentQuestion && !loading) {
        return <Loader show={true} />;
      }

      if (!currentQuestion) {
        return null;
      }

      return (
        <QuestionForm
          questions={questions}
          currentQuestion={currentQuestion}
          questionIndex={questionIndex}
          totalSteps={questions.length}
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
          onBack={handleQuestionBack}
          onContinue={handleQuestionContinue}
          showContinueButton={questionIndex === questions.length - 1}
          onShowBlocker={setShowBlocker}
        />
      );
    } else if (currentStep === 7) {
      return (
        <FinalProfile
          profile={finalProfile}
          simulationData={simulationData}
          onRetry={handleRetry}
          onContinue={() => setCurrentStep(8)}
        />
      );
    } else if (currentStep === 8) {
      return (
        <Simulator
          initialData={{
            ...simulationData,
            profile: finalProfile || undefined
          } as SimulationData}
        />
      );
    }
    return null;
  };

  return (
    <div id="perfilador" className="block block-pfg-pds-blocks block-pfg-components-text">
      <ScreenBlocker show={showBlocker} />
      <StepsIndicator currentStep={currentStep >= 2 ? 2 : currentStep} />
      {renderContent()}
      <Loader show={loading && currentStep !== 1} />
    </div>
  );
};

export default Perfilador;

