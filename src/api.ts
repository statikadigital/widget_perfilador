// Funciones para llamadas API

import { CatalogResourceResponse, SimulatorResourceResponse, SimulatorResourcePayload, RegisterAnswersPayload, EmailData, OAuth2EmailData } from './types';

const API_BASE = 'https://principal.com.mx';

export async function fetchCatalogResource(): Promise<CatalogResourceResponse> {
  try {
    const response = await fetch(`${API_BASE}/rest-api/catalog-resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as CatalogResourceResponse;
    return data;
  } catch (error) {
    console.error('Error cargando catálogo:', error);
    throw error;
  }
}

export async function registerAnswers(
  id_user: string, 
  question: string, 
  answer: string | number
): Promise<{ Message?: { profile?: string } }> {
  try {
    const payload: RegisterAnswersPayload = { id_user, question, answer };
    const response = await fetch(`${API_BASE}/getPerfilador`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registrando respuestas:', error);
    throw error;
  }
}

// Obtener token CSRF de Drupal
export async function getDrupalCsrf(): Promise<string> {
  const KEY = 'drupal_csrf_token';
  const cached = sessionStorage.getItem(KEY);
  if (cached) return cached;
  
  try {
    const response = await fetch(`${API_BASE}/session/token`, {
      credentials: 'same-origin',
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error('No se pudo obtener CSRF token');
    }
    
    const token = await response.text();
    sessionStorage.setItem(KEY, token);
    return token;
  } catch (error) {
    console.error('Error obteniendo CSRF token:', error);
    throw error;
  }
}

// Llamar al simulador
export async function getSimulatorResource(payload: SimulatorResourcePayload): Promise<SimulatorResourceResponse> {
  try {
    const csrf = await getDrupalCsrf();
    
    const response = await fetch(`${API_BASE}/getSimulatorResource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrf
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000)
    });
    
    if (!response.ok) {
      const txt = await response.text().catch(() => '');
      console.error('Simulator error', response.status, txt);
      throw new Error(`Simulator error: ${response.status}`);
    }
    
    const data = await response.json() as SimulatorResourceResponse;
    return data;
  } catch (error) {
    console.error('Error en simulador:', error);
    throw error;
  }
}

// Enviar email
export async function sendEmail(emailData: EmailData): Promise<Response> {
  try {
    const response = await fetch(`${API_BASE}/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(emailData),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
}

// Enviar email OAuth2
export async function sendOauth2Emails(formattedData: OAuth2EmailData): Promise<Response> {
  try {
    const response = await fetch(`${API_BASE}/sendOauth2Emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error enviando email OAuth2:', error);
    throw error;
  }
}

