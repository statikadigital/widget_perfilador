// Utilidades para el perfilador

import { ProfileMessages, ProfileType } from './types';

export function moneyToNumber(v: string | number | null | undefined): number {
  if (v == null) return 0;
  const raw = String(v).replace(/[^\d.-]/g, '');
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export function intVal(v: string | number | null | undefined): number {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
}

export function formatMoneyInput(value: string | number | null | undefined): string {
  if (!value || String(value).trim() === '') return '';
  // Si ya está formateado (contiene $), extraer solo los números
  const raw = String(value || '').split('.')[0].replace(/\D/g, '');
  if (!raw) return '';
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return '';
  return "$" + n.toLocaleString("es-MX") + ".00";
}

export function safeUUID(): string {
  if (typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string): string => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getParam(name: string): string {
  const v = new URLSearchParams(window.location.search).get(name);
  return v == null ? '' : v;
}

export function isEmpty(str: string | null | undefined): boolean {
  return !String(str || '').trim().length;
}

export function getProfileMessages(profile: string | null | undefined): ProfileMessages {
  const messages: Record<ProfileType, ProfileMessages> = {
    "Tradicional": {
      ideal: "De acuerdo a tus respuestas hemos calculado que tu perfil ideal es Tradicional; si estás de acuerdo, da clic en continuar o si lo deseas puedes repetir el perfilador.",
      intro: "Súper, con tu resultado nos damos cuenta que quieres empezar a invertir con paso firme.",
      description: "Los inversionistas con este perfil tienen una tolerancia baja al riesgo..."
    },
    "Agresivo": {
      ideal: "De acuerdo a tus respuestas hemos calculado que tu perfil ideal es Agresivo; si estás de acuerdo, da clic en continuar o si lo deseas puedes repetir el perfilador.",
      intro: "¡Aah caray! tu resultado va de acuerdo con un inversionista que busca que su dinero se eleve hasta el cielo. Te podemos ayudar.",
      description: "A los inversionistas con este perfil no les importa ver disminución en el saldo..."
    },
    "Conservador": {
      ideal: "De acuerdo a tus respuestas hemos calculado que tu perfil ideal es Conservador; si estás de acuerdo, da clic en continuar o si lo deseas puedes repetir el perfilador.",
      intro: "¡Qué sorpresa!",
      description: "Los inversionistas con este perfil tienen una tolerancia baja al riesgo..."
    },
    "Moderado": {
      ideal: "De acuerdo a tus respuestas hemos calculado que tu perfil ideal es Moderado; si estás de acuerdo, da clic en continuar o si lo deseas puedes repetir el perfilador.",
      intro: "Wow! Este resultado nos dice que buscas cierta estabilidad, pero cuando ves la oportunidad te atreves a ir por todo.",
      description: "A los inversionistas con este perfil no les importa ver disminuciones..."
    }
  };
  
  return messages[profile as ProfileType] || messages["Moderado"];
}

// Formatear número a moneda mexicana
export function numberToMoney(n: string | number | null | undefined): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  }).format(Number(n || 0));
}

