// Tipos para los nuevos módulos

export interface EIPD {
  id: string;
  nombre: string;
  tratamientoRelacionado: string;
  descripcion: string;
  responsable: string;
  fechaEvaluacion: string;
  // Evaluación de necesidad
  datosEspeciales: boolean;
  transferenciasInternacionales: boolean;
  monitoreoSistematico: boolean;
  decisionesAutomatizadas: boolean;
  granEscala: boolean;
  // Evaluación de riesgos
  riesgosIdentificados: { id: string; descripcion: string; probabilidad: number; impacto: number; medidas: string }[];
  // Medidas
  medidasImplementadas: string[];
  medidasPropuestas: string[];
  // Resultado
  riesgoResidual: string;
  conclusion: string;
  estado: 'En evaluación' | 'Aprobada' | 'Requiere revisión' | 'No requerida';
}

export interface ARCORequest {
  id: string;
  codigo: string;
  fechaSolicitud: string;
  fechaLimite: string;
  fechaRespuesta: string;
  titular: string;
  identificacion: string;
  tipo: 'Acceso' | 'Rectificación' | 'Cancelación' | 'Oposición';
  descripcion: string;
  tratamientoAfectado: string;
  estado: 'Recibida' | 'En análisis' | 'Atendida' | 'Rechazada' | 'Vencida';
  respuesta: string;
  responsable: string;
  observaciones: string;
}

export interface ActionPlan {
  id: string;
  titulo: string;
  descripcion: string;
  origen: string; // Auditoría, Incidente, Riesgo, EIPD
  origenId: string;
  responsable: string;
  fechaCreacion: string;
  fechaCompromiso: string;
  fechaCierre: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En progreso' | 'Completada' | 'Vencida' | 'Cancelada';
  progreso: number; // 0-100
  tareas: { id: string; descripcion: string; completada: boolean; fechaLimite: string; responsable: string }[];
  observaciones: string;
}

export interface SystemAlert {
  id: string;
  tipo: 'vencimiento' | 'incidente' | 'riesgo' | 'auditoria' | 'consentimiento' | 'derecho';
  titulo: string;
  descripcion: string;
  severidad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  modulo: string;
  referencia: string;
  fecha: string;
  leida: boolean;
  fechaVencimiento?: string;
}
