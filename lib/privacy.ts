/**
 * DATOS DEL AVISO DE PRIVACIDAD — BORRADOR
 * ---------------------------------------------------------------
 * Los campos en `null` están PENDIENTES y deben llenarse con datos reales de PYMEmkt.
 * Mientras exista un campo pendiente:
 *  - la página /aviso-de-privacidad muestra el aviso «Borrador» y no se indexa;
 *  - la compilación de producción (NEXT_PUBLIC_APP_ENV=production) se detiene con un error.
 * Recomendación: que un especialista en protección de datos revise el texto final.
 */

export type PrivacyData = {
  /** Nombre o razón social del responsable del tratamiento. */
  responsable: string | null;
  /** Domicilio completo para oír y recibir notificaciones. */
  domicilio: string | null;
  /** Correo donde se reciben solicitudes de derechos ARCO y revocación del consentimiento. */
  correoArco: string | null;
  /** ¿Se usarán los datos para finalidades secundarias (boletines, promociones)? Describirlas o escribir "Ninguna". */
  finalidadesSecundarias: string | null;
  /** ¿Se comparten los datos con terceros distintos de los proveedores que operan el sitio? Describir o escribir "Ninguna". */
  transferencias: string | null;
  /** Plazo de conservación de las solicitudes (p. ej., "12 meses desde el último contacto"). */
  conservacion: string | null;
  /** Fecha de última actualización, AAAA-MM-DD. */
  ultimaActualizacion: string | null;
};

export const PRIVACY: PrivacyData = {
  responsable: null,
  domicilio: null,
  correoArco: null,
  finalidadesSecundarias: null,
  transferencias: null,
  conservacion: null,
  ultimaActualizacion: null,
};

export const PRIVACY_LABELS: Record<keyof PrivacyData, string> = {
  responsable: "Nombre o razón social del responsable",
  domicilio: "Domicilio del responsable",
  correoArco: "Correo para solicitudes ARCO y revocación",
  finalidadesSecundarias: "Finalidades secundarias (o «Ninguna»)",
  transferencias: "Transferencias a terceros (o «Ninguna»)",
  conservacion: "Plazo de conservación de los datos",
  ultimaActualizacion: "Fecha de última actualización",
};

export const privacyPending = (Object.keys(PRIVACY) as (keyof PrivacyData)[]).filter((k) => !PRIVACY[k]);
export const privacyIsDraft = privacyPending.length > 0;
