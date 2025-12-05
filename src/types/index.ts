// Tipos comunes para el proyecto

export interface SimulationData {
  inversionInicial: string;
  inversionMensual: string;
  duracionPlazo: number;
  period: 'anios' | 'years' | 'meses';
  selected: 'option1' | 'option2';
  amount?: number;
  extra?: number;
  noperiod?: number;
  profile?: string;
}

export interface SimulationResult {
  estimatedamount?: number;
  scenarioConservative?: number;
  scenarioOptimistic?: number;
  capitalInvested?: number;
  yield?: number;
}

export interface Portfolio {
  portafolio_1?: string;
  portafolio_2?: string;
  perfil?: string;
  [key: string]: string | number | undefined;
}

export interface SimulatorResourceResponse {
  Message?: {
    responseApi?: SimulationResult;
    nivel_portafolio?: Portfolio;
    profile?: string;
  };
}

export interface EmailData {
  NumContrato: string;
  email: string;
  perfil: string;
  invInicial: string;
  invMensual: string;
  plazo: string;
  fondo: string;
  clave: string;
  esceConservador: string;
}

export interface OAuth2EmailData {
  email: string;
  perfil: string;
  invInicial: string;
  invMensual: string;
  plazo: string;
  NumContrato: string;
  fondo: string;
  clave: string;
  esceConservador: string;
  nameTemplateEcommerce: string;
  versionTemplateEcommerce: string;
  hrefEcommerce: string;
}

export interface Question {
  id: string;
  question: string;
  answerOptions?: Array<{
    id: string;
    answerText: string;
    order: string | number;
  }>;
  options?: Array<{
    id: string;
    text: string;
    value: string;
  }>;
}

export interface CatalogResourceResponse {
  result?: Question[];
}

export interface FormErrors {
  amount?: string;
  noperiod?: string;
  [key: string]: string | undefined;
}

