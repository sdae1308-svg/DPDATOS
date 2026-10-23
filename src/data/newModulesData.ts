import type { EIPD, ARCORequest, ActionPlan, SystemAlert } from './newModulesTypes';

export const demoEIPDs: EIPD[] = [
  {
    id: 'EIPD-001',
    nombre: 'Evaluación de Impacto - Sistema Biométrico',
    tratamientoRelacionado: 'RAT-005',
    descripcion: 'Evaluación del tratamiento de datos biométricos para control de asistencia mediante huella dactilar',
    responsable: 'Roberto Salazar Espinoza',
    fechaEvaluacion: '2025-11-15',
    datosEspeciales: true,
    transferenciasInternacionales: false,
    monitoreoSistematico: true,
    decisionesAutomatizadas: false,
    granEscala: false,
    riesgosIdentificados: [
      { id: 'R1', descripcion: 'Acceso no autorizado a templates biométricos', probabilidad: 3, impacto: 5, medidas: 'Cifrado de templates, control de acceso estricto' },
      { id: 'R2', descripcion: 'Uso indebido de datos biométricos', probabilidad: 2, impacto: 5, medidas: 'Política de uso, auditoría de accesos' },
      { id: 'R3', descripcion: 'Fuga de información biométrica', probabilidad: 2, impacto: 5, medidas: 'DLP, monitoreo de red' }
    ],
    medidasImplementadas: ['Cifrado AES-256 de templates', 'Control de acceso por roles', 'No almacenamiento de imágenes faciales', 'Auditoría trimestral'],
    medidasPropuestas: ['Implementar autenticación multifactor', 'Realizar pentest anual', 'Capacitación específica al personal'],
    riesgoResidual: 'Medio',
    conclusion: 'El tratamiento presenta riesgos que pueden ser mitigados con las medidas implementadas. Se recomienda mantener las medidas propuestas para reducir el riesgo residual.',
    estado: 'Aprobada'
  },
  {
    id: 'EIPD-002',
    nombre: 'Evaluación de Impacto - App Móvil',
    tratamientoRelacionado: 'RAT-001',
    descripcion: 'Evaluación del tratamiento de datos personales a través de la aplicación móvil para clientes',
    responsable: 'Roberto Salazar Espinoza',
    fechaEvaluacion: '2025-12-01',
    datosEspeciales: true,
    transferenciasInternacionales: true,
    monitoreoSistematico: true,
    decisionesAutomatizadas: true,
    granEscala: true,
    riesgosIdentificados: [
      { id: 'R1', descripcion: 'Robo o pérdida de dispositivo móvil', probabilidad: 4, impacto: 4, medidas: 'Cifrado en dispositivo, borrado remoto' },
      { id: 'R2', descripcion: 'Interceptación de comunicaciones', probabilidad: 3, impacto: 5, medidas: 'Cifrado end-to-end, certificados SSL' },
      { id: 'R3', descripcion: 'Acceso no autorizado a cuenta', probabilidad: 3, impacto: 4, medidas: 'Autenticación biométrica, MFA' }
    ],
    medidasImplementadas: ['Cifrado end-to-end', 'Biometría para acceso', 'Borrado remoto', 'Code signing'],
    medidasPropuestas: ['Implementar detección de jailbreak/root', 'Análisis de malware en tiempo real', 'Notificaciones de acceso desde nuevos dispositivos'],
    riesgoResidual: 'Medio',
    conclusion: 'La aplicación presenta riesgos significativos que requieren medidas adicionales. Se debe implementar el plan de mejora antes de continuar con el tratamiento.',
    estado: 'Requiere revisión'
  }
];

export const demoARCO: ARCORequest[] = [
  {
    id: 'ARCO-001',
    codigo: 'ARCO-2025-001',
    fechaSolicitud: '2025-10-15',
    fechaLimite: '2025-10-30',
    fechaRespuesta: '2025-10-25',
    titular: 'Juan Carlos Méndez',
    identificacion: '1712345678',
    tipo: 'Acceso',
    descripcion: 'Solicita conocer qué datos personales se tienen registrados y con qué finalidad',
    tratamientoAfectado: 'RAT-001',
    estado: 'Atendida',
    respuesta: 'Se proporcionó información completa sobre los datos tratados, finalidades y medidas de seguridad mediante oficio Nro. 2025-045',
    responsable: 'María Fernanda Andrade',
    observaciones: 'Atendida dentro del plazo legal'
  },
  {
    id: 'ARCO-002',
    codigo: 'ARCO-2025-002',
    fechaSolicitud: '2025-11-20',
    fechaLimite: '2025-12-05',
    fechaRespuesta: '2025-12-02',
    titular: 'María Elena Rodríguez',
    identificacion: '1723456789',
    tipo: 'Rectificación',
    descripcion: 'Solicita corregir dirección de correo electrónico registrada incorrectamente',
    tratamientoAfectado: 'RAT-001',
    estado: 'Atendida',
    respuesta: 'Se realizó la rectificación del correo electrónico en todos los sistemas donde se encontraba registrado',
    responsable: 'María Fernanda Andrade',
    observaciones: 'Rectificación completada'
  },
  {
    id: 'ARCO-003',
    codigo: 'ARCO-2026-001',
    fechaSolicitud: '2026-01-10',
    fechaLimite: '2026-01-25',
    fechaRespuesta: '',
    titular: 'Carlos Andrés Vega',
    identificacion: '1734567890',
    tipo: 'Cancelación',
    descripcion: 'Solicita eliminación de todos sus datos personales por haber terminado la relación contractual',
    tratamientoAfectado: 'RAT-001',
    estado: 'En análisis',
    respuesta: '',
    responsable: 'María Fernanda Andrade',
    observaciones: 'En proceso de verificación de obligaciones legales pendientes'
  },
  {
    id: 'ARCO-004',
    codigo: 'ARCO-2026-002',
    fechaSolicitud: '2026-01-18',
    fechaLimite: '2026-02-02',
    fechaRespuesta: '',
    titular: 'Ana Lucía Paredes',
    identificacion: '1745678901',
    tipo: 'Oposición',
    descripcion: 'Se opone al tratamiento de sus datos para fines de marketing',
    tratamientoAfectado: 'RAT-006',
    estado: 'Recibida',
    respuesta: '',
    responsable: 'María Fernanda Andrade',
    observaciones: 'Pendiente análisis'
  }
];

export const demoActionPlans: ActionPlan[] = [
  {
    id: 'PA-001',
    titulo: 'Regularización de contratos con encargados de tratamiento',
    descripcion: 'Actualizar todos los contratos con terceros que actúan como encargados de tratamiento conforme al art. 23 LOPDP y art. 32 RGLOPDP',
    origen: 'Auditoría',
    origenId: 'AUD-001',
    responsable: 'Patricia Isabel Moreno',
    fechaCreacion: '2025-10-20',
    fechaCompromiso: '2026-02-01',
    fechaCierre: '',
    prioridad: 'Alta',
    estado: 'En progreso',
    progreso: 60,
    tareas: [
      { id: 'T1', descripcion: 'Identificar todos los encargados de tratamiento', completada: true, fechaLimite: '2025-11-01', responsable: 'Patricia Isabel Moreno' },
      { id: 'T2', descripcion: 'Elaborar nuevo modelo de contrato', completada: true, fechaLimite: '2025-11-15', responsable: 'Roberto Salazar Espinoza' },
      { id: 'T3', descripcion: 'Negociar y firmar contratos actualizados', completada: false, fechaLimite: '2026-01-31', responsable: 'Patricia Isabel Moreno' },
      { id: 'T4', descripcion: 'Verificar cumplimiento de nuevos contratos', completada: false, fechaLimite: '2026-02-01', responsable: 'María Fernanda Andrade' }
    ],
    observaciones: '3 de 5 contratos actualizados'
  },
  {
    id: 'PA-002',
    titulo: 'Implementación de EIPD para tratamientos de alto riesgo',
    descripcion: 'Realizar evaluaciones de impacto para todos los tratamientos que manejen datos especialmente protegidos',
    origen: 'Auditoría',
    origenId: 'AUD-001',
    responsable: 'Roberto Salazar Espinoza',
    fechaCreacion: '2025-10-20',
    fechaCompromiso: '2026-02-15',
    fechaCierre: '',
    prioridad: 'Alta',
    estado: 'En progreso',
    progreso: 40,
    tareas: [
      { id: 'T1', descripcion: 'Identificar tratamientos que requieren EIPD', completada: true, fechaLimite: '2025-11-01', responsable: 'Roberto Salazar Espinoza' },
      { id: 'T2', descripcion: 'Elaborar EIPD para sistema biométrico', completada: true, fechaLimite: '2025-11-30', responsable: 'Roberto Salazar Espinoza' },
      { id: 'T3', descripcion: 'Elaborar EIPD para app móvil', completada: false, fechaLimite: '2026-01-31', responsable: 'Roberto Salazar Espinoza' },
      { id: 'T4', descripcion: 'Aprobación de EIPDs por comité', completada: false, fechaLimite: '2026-02-15', responsable: 'María Fernanda Andrade' }
    ],
    observaciones: '1 de 2 EIPDs completadas'
  },
  {
    id: 'PA-003',
    titulo: 'Programa de capacitación en protección de datos',
    descripcion: 'Capacitar al 100% del personal en protección de datos personales y seguridad de la información',
    origen: 'Auditoría',
    origenId: 'AUD-001',
    responsable: 'Carmen Rosa Vega',
    fechaCreacion: '2025-10-25',
    fechaCompromiso: '2026-04-01',
    fechaCierre: '',
    prioridad: 'Media',
    estado: 'En progreso',
    progreso: 70,
    tareas: [
      { id: 'T1', descripcion: 'Diseñar programa de capacitación', completada: true, fechaLimite: '2025-11-15', responsable: 'Carmen Rosa Vega' },
      { id: 'T2', descripcion: 'Capacitar personal de operaciones', completada: true, fechaLimite: '2025-12-15', responsable: 'Carmen Rosa Vega' },
      { id: 'T3', descripcion: 'Capacitar personal administrativo', completada: false, fechaLimite: '2026-02-15', responsable: 'Carmen Rosa Vega' },
      { id: 'T4', descripcion: 'Capacitar nuevos ingresos', completada: false, fechaLimite: '2026-04-01', responsable: 'Carmen Rosa Vega' }
    ],
    observaciones: '70% del personal capacitado'
  }
];

export const demoAlerts: SystemAlert[] = [
  {
    id: 'ALT-001',
    tipo: 'derecho',
    titulo: 'Solicitud ARCO próxima a vencer',
    descripcion: 'La solicitud ARCO-2026-001 vence en 5 días',
    severidad: 'Alta',
    modulo: 'Derechos ARCO',
    referencia: 'ARCO-003',
    fecha: '2026-01-20',
    leida: false,
    fechaVencimiento: '2026-01-25'
  },
  {
    id: 'ALT-002',
    tipo: 'incidente',
    titulo: 'Incidente abierto requiere atención',
    descripcion: 'El incidente INC-2026-001 tiene fecha límite de notificación próxima',
    severidad: 'Crítica',
    modulo: 'Incidentes',
    referencia: 'INC-004',
    fecha: '2026-01-15',
    leida: false,
    fechaVencimiento: '2026-01-17'
  },
  {
    id: 'ALT-003',
    tipo: 'consentimiento',
    titulo: 'Empleados con consentimiento pendiente',
    descripcion: '4 empleados tienen consentimiento o confidencialidad pendiente de firma',
    severidad: 'Media',
    modulo: 'Empleados',
    referencia: 'EMP-004, EMP-007, EMP-010',
    fecha: '2026-01-18',
    leida: true
  },
  {
    id: 'ALT-004',
    tipo: 'riesgo',
    titulo: 'Riesgos no aceptables sin tratamiento',
    descripcion: '5 riesgos identificados como no aceptables requieren plan de tratamiento',
    severidad: 'Alta',
    modulo: 'Riesgos',
    referencia: 'RSK-001, RSK-002, RSK-004, RSK-005, RSK-007',
    fecha: '2026-01-10',
    leida: true
  },
  {
    id: 'ALT-005',
    tipo: 'auditoria',
    titulo: 'Hallazgo de auditoría vencido',
    descripcion: 'El hallazgo H-009 de la auditoría de seguridad está vencido sin atención',
    severidad: 'Crítica',
    modulo: 'Auditoría',
    referencia: 'H-009',
    fecha: '2026-01-31',
    leida: false,
    fechaVencimiento: '2026-01-31'
  },
  {
    id: 'ALT-006',
    tipo: 'vencimiento',
    titulo: 'Documento próximo a vencer',
    descripcion: 'La Política de Cookies vence en 30 días',
    severidad: 'Baja',
    modulo: 'Documentos',
    referencia: 'DOC-007',
    fecha: '2026-01-25',
    leida: true,
    fechaVencimiento: '2026-08-15'
  }
];
