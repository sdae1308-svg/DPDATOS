// Datos demo de solicitudes ARCO
export interface ARCORequest {
  id: string;
  codigo: string;
  fechaRecepcion: string;
  fechaLimite: string;
  fechaRespuesta: string;
  titular: string;
  cedulaTitular: string;
  emailTitular: string;
  telefonoTitular: string;
  tipoDerecho: 'Acceso' | 'Rectificación' | 'Cancelación' | 'Oposición';
  descripcion: string;
  tratamientoAfectado: string;
  estado: 'Recibida' | 'En Proceso' | 'Respondida' | 'Cerrada' | 'Vencida';
  respuesta: string;
  responsable: string;
  observaciones: string;
  diasTranscurridos: number;
}

export const demoARCORequests: ARCORequest[] = [
  {
    id: 'ARCO-001',
    codigo: 'ARCO-2025-001',
    fechaRecepcion: '2025-11-10',
    fechaLimite: '2025-11-25',
    fechaRespuesta: '2025-11-20',
    titular: 'Juan Carlos Pérez Mora',
    cedulaTitular: '1712345678',
    emailTitular: 'jcperez@email.com',
    telefonoTitular: '+593 99 1234567',
    tipoDerecho: 'Acceso',
    descripcion: 'Solicita conocer qué datos personales suyos están siendo tratados por la empresa y con qué finalidad.',
    tratamientoAfectado: 'RAT-001',
    estado: 'Cerrada',
    respuesta: 'Se proporcionó información completa sobre los datos tratados, finalidades y medidas de seguridad aplicadas.',
    responsable: 'Roberto Salazar Espinoza',
    observaciones: 'Respondida dentro del plazo legal',
    diasTranscurridos: 10
  },
  {
    id: 'ARCO-002',
    codigo: 'ARCO-2025-002',
    fechaRecepcion: '2025-12-05',
    fechaLimite: '2025-12-20',
    fechaRespuesta: '2025-12-18',
    titular: 'María Elena Rodríguez',
    cedulaTitular: '1723456789',
    emailTitular: 'merodriguez@email.com',
    telefonoTitular: '+593 98 2345678',
    tipoDerecho: 'Rectificación',
    descripcion: 'Solicita corregir su dirección de domicilio registrada en el sistema, que presenta un error.',
    tratamientoAfectado: 'RAT-001',
    estado: 'Cerrada',
    respuesta: 'Se corrigió la dirección en todos los sistemas donde se encontraba registrada.',
    responsable: 'Ana Lucía Paredes',
    observaciones: 'Rectificación completada en todos los sistemas',
    diasTranscurridos: 13
  },
  {
    id: 'ARCO-003',
    codigo: 'ARCO-2026-001',
    fechaRecepcion: '2026-01-08',
    fechaLimite: '2026-01-23',
    fechaRespuesta: '',
    titular: 'Carlos Andrés Villacís',
    cedulaTitular: '1734567890',
    emailTitular: 'cavillacis@email.com',
    telefonoTitular: '+593 97 3456789',
    tipoDerecho: 'Cancelación',
    descripcion: 'Ex-cliente solicita eliminación de todos sus datos personales de las bases de datos de la empresa.',
    tratamientoAfectado: 'RAT-001',
    estado: 'En Proceso',
    respuesta: '',
    responsable: 'Roberto Salazar Espinoza',
    observaciones: 'Verificando obligaciones legales de conservación antes de proceder con eliminación',
    diasTranscurridos: 15
  },
  {
    id: 'ARCO-004',
    codigo: 'ARCO-2026-002',
    fechaRecepcion: '2026-01-18',
    fechaLimite: '2026-02-02',
    fechaRespuesta: '',
    titular: 'Patricia Morales Cevallos',
    cedulaTitular: '1745678901',
    emailTitular: 'pmorales@email.com',
    telefonoTitular: '+593 96 4567890',
    tipoDerecho: 'Oposición',
    descripcion: 'Se opone al tratamiento de sus datos para fines de marketing y comunicaciones comerciales.',
    tratamientoAfectado: 'RAT-006',
    estado: 'Recibida',
    respuesta: '',
    responsable: 'Fernando Alejandro Ruiz',
    observaciones: 'Pendiente análisis de procedencia',
    diasTranscurridos: 5
  },
  {
    id: 'ARCO-005',
    codigo: 'ARCO-2026-003',
    fechaRecepcion: '2026-01-22',
    fechaLimite: '2026-02-06',
    fechaRespuesta: '',
    titular: 'Luis Fernando Aguilar',
    cedulaTitular: '1756789012',
    emailTitular: 'laguilar@email.com',
    telefonoTitular: '+593 95 5678901',
    tipoDerecho: 'Acceso',
    descripcion: 'Solicita copia de todos sus datos personales tratados por la empresa en formato legible.',
    tratamientoAfectado: 'RAT-001',
    estado: 'En Proceso',
    respuesta: '',
    responsable: 'María Fernanda Andrade',
    observaciones: 'Recopilando información de múltiples sistemas',
    diasTranscurridos: 1
  }
];
