// ============================================
// DATOS DEMO - Sistema de Cumplimiento LOPDP Ecuador
// ============================================

export interface Company {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  domicilioLegal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  sectorEconomico: string;
  tamanoEmpresa: string;
  actividadPrincipal: string;
  representanteLegal: string;
  responsableCumplimiento: string;
  delegadoProteccionDatos: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  politicaConservacion: string;
  fechaActualizacion: string;
}

export interface Employee {
  id: string;
  nombre: string;
  cedula: string;
  cargo: string;
  area: string;
  fechaIngreso: string;
  tipoRelacion: string;
  accesoActivos: string[];
  nivelAccesoDatos: string;
  confidencialidadFirmada: boolean;
  consentimientoFirmado: boolean;
  capacitaciones: { fecha: string; tema: string; estado: string }[];
  incidentesAsociados: string[];
  observaciones: string;
  estado: string;
}

export interface Asset {
  id: string;
  nombre: string;
  tipo: string;
  propietario: string;
  custodio: string;
  ubicacion: string;
  criticidad: string;
  confidencialidad: number;
  integridad: number;
  disponibilidad: number;
  relacionDatosPersonales: boolean;
  categoriasDatos: string[];
  soporte: string;
  sistemaAsociado: string;
  dependenciaTecnologica: string;
  estado: string;
  amenazas: string[];
  vulnerabilidades: string[];
  controles: string[];
  valor: number;
  observaciones: string;
}

export interface RAT {
  id: string;
  nombre: string;
  unidadResponsable: string;
  responsableTratamiento: string;
  encargadoTratamiento: string;
  delegadoProteccionDatos: string;
  finalidad: string;
  baseLegitimadora: string;
  categoriasTitulares: string[];
  categoriasDatos: string[];
  categoriasEspeciales: string[];
  destinatarios: string[];
  transferencias: string;
  decisionesAutomatizadas: boolean;
  plazoConservacion: string;
  ubicacionBD: string;
  sistemaAplicacion: string;
  medidasSeguridad: string[];
  activosRelacionados: string[];
  estado: string;
  fechaCreacion: string;
  fechaRevision: string;
  fechaAprobacion: string;
  nivelRiesgo: string;
}

export interface Incident {
  id: string;
  codigo: string;
  fechaDeteccion: string;
  fechaEvento: string;
  reportante: string;
  activoAfectado: string;
  tratamientoAfectado: string;
  tipo: string;
  descripcion: string;
  causaRaiz: string;
  datosComprometidos: string[];
  titularesAfectados: number;
  impacto: number;
  probabilidad: number;
  severidad: string;
  estado: string;
  accionesContencion: string;
  accionesCorrectivas: string;
  accionesPreventivas: string;
  responsableRespuesta: string;
  necesidadNotificacion: boolean;
  fechaLimiteNotificacion: string;
  estadoCierre: string;
}

export interface Risk {
  id: string;
  nombre: string;
  proceso: string;
  activo: string;
  tratamiento: string;
  probabilidad: number;
  impacto: number;
  riesgoInherente: number;
  controlesExistentes: string[];
  eficaciaControles: number;
  riesgoResidual: number;
  nivelAceptacion: string;
  tratamientoRiesgo: string;
  responsable: string;
  fechaRevision: string;
  estado: string;
}

export interface Audit {
  id: string;
  nombre: string;
  tipo: string;
  auditor: string;
  fechaInicio: string;
  fechaFin: string;
  alcance: string;
  criterios: { id: string; descripcion: string; cumplimiento: string; evidencia: string; hallazgo: string; recomendacion: string }[];
  scoring: number;
  estado: string;
  hallazgos: { id: string; descripcion: string; severidad: string; responsable: string; fechaCompromiso: string; estado: string }[];
}

export interface Document {
  id: string;
  nombre: string;
  tipo: string;
  version: string;
  fechaEmision: string;
  fechaRevision: string;
  responsable: string;
  estado: string;
  contenido: string;
}

export interface MaturityDimension {
  nombre: string;
  nivel: number;
  descripcion: string;
  evidencias: string[];
}

// ============ DATOS DEMO ============

export const demoCompany: Company = {
  id: 'EMP-001',
  razonSocial: 'TECNOLOGÍA Y SERVICIOS FINANCIEROS S.A.',
  nombreComercial: 'TecServiFin',
  ruc: '1792345678001',
  domicilioLegal: 'Av. Amazonas N36-127 y Av. Naciones Unidas',
  ciudad: 'Quito',
  provincia: 'Pichincha',
  pais: 'Ecuador',
  sectorEconomico: 'Servicios Financieros y Tecnológicos',
  tamanoEmpresa: 'Mediana (51-250 empleados)',
  actividadPrincipal: 'Procesamiento de pagos digitales y servicios financieros tecnológicos',
  representanteLegal: 'Dr. Carlos Mendoza Villacís',
  responsableCumplimiento: 'Lcda. María Fernanda Andrade',
  delegadoProteccionDatos: 'Ab. Roberto Salazar Espinoza',
  telefono: '+593 2 2456789',
  email: 'cumplimiento@tecservifin.com.ec',
  sitioWeb: 'www.tecservifin.com.ec',
  politicaConservacion: 'Conservación de datos personales durante el tiempo necesario para cumplir la finalidad, máximo 7 años según normativa sectorial.',
  fechaActualizacion: '2026-01-15'
};

export const demoEmployees: Employee[] = [
  { id: 'EMP-001', nombre: 'Ana Lucía Paredes Guamán', cedula: '1712345678', cargo: 'Gerente de Operaciones', area: 'Operaciones', fechaIngreso: '2019-03-15', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-001', 'ACT-003'], nivelAccesoDatos: 'Alto', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }, { fecha: '2025-11-20', tema: 'Seguridad de la Información', estado: 'Aprobado' }], incidentesAsociados: [], observaciones: 'Acceso a bases de datos de clientes', estado: 'Activo' },
  { id: 'EMP-002', nombre: 'José Miguel Torres Herrera', cedula: '1723456789', cargo: 'Desarrollador Senior', area: 'Tecnología', fechaIngreso: '2020-01-10', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-004', 'ACT-005'], nivelAccesoDatos: 'Alto', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }], incidentesAsociados: ['INC-002'], observaciones: 'Administrador de bases de datos', estado: 'Activo' },
  { id: 'EMP-003', nombre: 'Carmen Rosa Vega López', cedula: '1734567890', cargo: 'Analista de RRHH', area: 'Recursos Humanos', fechaIngreso: '2021-05-20', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-006'], nivelAccesoDatos: 'Medio', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }, { fecha: '2026-01-15', tema: 'Gestión de Incidentes', estado: 'Pendiente' }], incidentesAsociados: [], observaciones: 'Maneja datos sensibles de empleados', estado: 'Activo' },
  { id: 'EMP-004', nombre: 'Fernando Alejandro Ruiz', cedula: '1745678901', cargo: 'Analista Comercial', area: 'Comercial', fechaIngreso: '2022-02-14', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-007'], nivelAccesoDatos: 'Medio', confidencialidadFirmada: true, consentimientoFirmado: false, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }], incidentesAsociados: [], observaciones: 'Pendiente firma de consentimiento actualizado', estado: 'Activo' },
  { id: 'EMP-005', nombre: 'Patricia Isabel Moreno', cedula: '1756789012', cargo: 'Contadora', area: 'Financiero', fechaIngreso: '2018-09-01', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-008'], nivelAccesoDatos: 'Medio', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }], incidentesAsociados: [], observaciones: '', estado: 'Activo' },
  { id: 'EMP-006', nombre: 'Luis Eduardo Castillo', cedula: '1767890123', cargo: 'Soporte Técnico', area: 'Tecnología', fechaIngreso: '2023-01-09', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-004', 'ACT-009'], nivelAccesoDatos: 'Bajo', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [], incidentesAsociados: [], observaciones: 'Pendiente capacitación en protección de datos', estado: 'Activo' },
  { id: 'EMP-007', nombre: 'María José Salinas', cedula: '1778901234', cargo: 'Ejecutiva de Cuentas', area: 'Comercial', fechaIngreso: '2022-08-15', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-007'], nivelAccesoDatos: 'Medio', confidencialidadFirmada: false, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Reprobado' }], incidentesAsociados: [], observaciones: 'Requiere repetición de capacitación', estado: 'Activo' },
  { id: 'EMP-008', nombre: 'Andrés Felipe Bravo', cedula: '1789012345', cargo: 'Coordinador de Seguridad', area: 'Seguridad', fechaIngreso: '2020-11-01', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-001', 'ACT-002', 'ACT-009'], nivelAccesoDatos: 'Alto', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }, { fecha: '2025-11-20', tema: 'Seguridad de la Información', estado: 'Aprobado' }, { fecha: '2026-01-10', tema: 'Gestión de Incidentes', estado: 'Aprobado' }], incidentesAsociados: ['INC-001'], observaciones: 'Responsable de respuesta a incidentes', estado: 'Activo' },
  { id: 'EMP-009', nombre: 'Diana Carolina Núñez', cedula: '1790123456', cargo: 'Asistente Administrativa', area: 'Administración', fechaIngreso: '2023-06-01', tipoRelacion: 'Indefinido', accesoActivos: ['ACT-006'], nivelAccesoDatos: 'Bajo', confidencialidadFirmada: true, consentimientoFirmado: true, capacitaciones: [{ fecha: '2025-06-10', tema: 'LOPDP y Protección de Datos', estado: 'Aprobado' }], incidentesAsociados: [], observaciones: '', estado: 'Activo' },
  { id: 'EMP-010', nombre: 'Roberto Carlos Espinoza', cedula: '1701234567', cargo: 'Pasante', area: 'Tecnología', fechaIngreso: '2025-09-01', tipoRelacion: 'Temporal', accesoActivos: [], nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false, capacitaciones: [], incidentesAsociados: [], observaciones: 'Pendiente firma de confidencialidad y consentimiento', estado: 'Activo' }
];

export const demoAssets: Asset[] = [
  { id: 'ACT-001', nombre: 'Base de Datos de Clientes', tipo: 'Base de Datos', propietario: 'Gerencia de Operaciones', custodio: 'Tecnología', ubicacion: 'Servidor principal - Datacenter Quito', criticidad: 'Alta', confidencialidad: 5, integridad: 5, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto', 'Financieros'], soporte: 'Digital', sistemaAsociado: 'CRM Principal', dependenciaTecnologica: 'Alta', estado: 'Activo', amenazas: ['Acceso no autorizado', 'Fuga de datos', 'Ransomware'], vulnerabilidades: ['Contraseñas débiles en accesos remotos', 'Falta de cifrado en reposo'], controles: ['Firewall perimetral', 'Control de acceso por roles', 'Backup diario'], valor: 95000, observaciones: 'Contiene datos personales de 15,000+ clientes' },
  { id: 'ACT-002', nombre: 'Servidor de Correo Corporativo', tipo: 'Hardware', propietario: 'Tecnología', custodio: 'Soporte Técnico', ubicacion: 'Datacenter Quito', criticidad: 'Media', confidencialidad: 3, integridad: 4, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto'], soporte: 'Digital', sistemaAsociado: 'Microsoft 365', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Phishing', 'Suplantación de identidad'], vulnerabilidades: ['Configuración SPF incompleta'], controles: ['Filtro antispam', 'Autenticación multifactor', 'Política de contraseñas'], valor: 25000, observaciones: '' },
  { id: 'ACT-003', nombre: 'Sistema de Procesamiento de Pagos', tipo: 'Software', propietario: 'Gerencia de Operaciones', custodio: 'Tecnología', ubicacion: 'Nube AWS - Región us-east-1', criticidad: 'Alta', confidencialidad: 5, integridad: 5, disponibilidad: 5, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Financieros', 'Transaccionales'], soporte: 'Digital', sistemaAsociado: 'Plataforma de Pagos v3.2', dependenciaTecnologica: 'Crítica', estado: 'Activo', amenazas: ['Inyección SQL', 'Ataques DDoS', 'Explotación de APIs'], vulnerabilidades: ['API sin rate limiting', 'Logs con datos sensibles'], controles: ['WAF', 'Cifrado TLS 1.3', 'Monitoreo 24/7', 'PCI DSS compliance'], valor: 150000, observaciones: 'Sistema crítico de negocio' },
  { id: 'ACT-004', nombre: 'Servidor de Base de Datos PostgreSQL', tipo: 'Hardware', propietario: 'Tecnología', custodio: 'Administrador BD', ubicacion: 'Datacenter Quito', criticidad: 'Alta', confidencialidad: 5, integridad: 5, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto', 'Financieros', 'Transaccionales'], soporte: 'Digital', sistemaAsociado: 'PostgreSQL 15', dependenciaTecnologica: 'Crítica', estado: 'Activo', amenazas: ['Acceso no autorizado', 'Corrupción de datos', 'Desastre natural'], vulnerabilidades: ['Parches de seguridad pendientes', 'Replicación sin cifrar'], controles: ['Acceso restringido', 'Backup en caliente', 'Replicación geográfica'], valor: 120000, observaciones: 'Almacena datos de producción' },
  { id: 'ACT-005', nombre: 'Repositorio de Código Fuente', tipo: 'Software', propietario: 'Tecnología', custodio: 'Desarrollo', ubicacion: 'GitHub Enterprise', criticidad: 'Media', confidencialidad: 4, integridad: 4, disponibilidad: 3, relacionDatosPersonales: false, categoriasDatos: [], soporte: 'Digital', sistemaAsociado: 'GitHub Enterprise', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Robo de propiedad intelectual', 'Inyección de código malicioso'], vulnerabilidades: ['Secrets en repositorio'], controles: ['Escaneo de secrets', 'Code review obligatorio', 'Branch protection'], valor: 35000, observaciones: '' },
  { id: 'ACT-006', nombre: 'Expedientes de Empleados', tipo: 'Documento', propietario: 'Recursos Humanos', custodio: 'Analista RRHH', ubicacion: 'Archivo físico - Oficina RRHH', criticidad: 'Media', confidencialidad: 4, integridad: 3, disponibilidad: 3, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Laborales', 'Salud', 'Financieros'], soporte: 'Físico', sistemaAsociado: 'N/A', dependenciaTecnologica: 'N/A', estado: 'Activo', amenazas: ['Acceso no autorizado', 'Pérdida por incendio', 'Robo'], vulnerabilidades: ['Archivo sin llave biométrica', 'Sin inventario actualizado'], controles: ['Acceso restringido a RRHH', 'Armario con llave', 'Inventario semestral'], valor: 15000, observaciones: 'Contiene datos de salud de empleados' },
  { id: 'ACT-007', nombre: 'CRM Comercial', tipo: 'Software', propietario: 'Gerencia Comercial', custodio: 'Equipo Comercial', ubicacion: 'Nube Salesforce', criticidad: 'Media', confidencialidad: 4, integridad: 3, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto', 'Comerciales'], soporte: 'Digital', sistemaAsociado: 'Salesforce CRM', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Acceso no autorizado', 'Exfiltración de datos'], vulnerabilidades: ['Permisos excesivos de usuarios'], controles: ['SSO', 'Control de permisos', 'Auditoría de accesos'], valor: 45000, observaciones: '' },
  { id: 'ACT-008', nombre: 'Sistema Contable', tipo: 'Software', propietario: 'Financiero', custodio: 'Contabilidad', ubicacion: 'Servidor local', criticidad: 'Media', confidencialidad: 3, integridad: 5, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Financieros'], soporte: 'Digital', sistemaAsociado: 'SAP Business One', dependenciaTecnologica: 'Alta', estado: 'Activo', amenazas: ['Manipulación de registros', 'Ransomware'], vulnerabilidades: ['Software desactualizado'], controles: ['Backup diario', 'Control de cambios', 'Licencia vigente'], valor: 55000, observaciones: '' },
  { id: 'ACT-009', nombre: 'Red de Área Local (LAN)', tipo: 'Hardware', propietario: 'Tecnología', custodio: 'Infraestructura', ubicacion: 'Oficinas centrales Quito', criticidad: 'Alta', confidencialidad: 4, integridad: 4, disponibilidad: 5, relacionDatosPersonales: false, categoriasDatos: [], soporte: 'Digital', sistemaAsociado: 'Cisco Catalyst', dependenciaTecnologica: 'Crítica', estado: 'Activo', amenazas: ['Ataques de red', 'Interceptación de tráfico', 'Dispositivos no autorizados'], vulnerabilidades: ['Segmentación insuficiente', 'Puertos sin deshabilitar'], controles: ['VLANs', 'NAC', 'IDS/IPS', 'Monitoreo de red'], valor: 80000, observaciones: '' },
  { id: 'ACT-010', nombre: 'Plataforma de Nómina', tipo: 'Software', propietario: 'Recursos Humanos', custodio: 'RRHH', ubicacion: 'Nube - Proveedor local', criticidad: 'Alta', confidencialidad: 5, integridad: 5, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Laborales', 'Financieros', 'Salud'], soporte: 'Digital', sistemaAsociado: 'Nómina Plus v5', dependenciaTecnologica: 'Alta', estado: 'Activo', amenazas: ['Acceso no autorizado', 'Manipulación de nómina', 'Fuga de datos sensibles'], vulnerabilidades: ['Proveedor sin certificación ISO 27001'], controles: ['Acceso por roles', 'Cifrado en tránsito', 'Logs de auditoría'], valor: 40000, observaciones: 'Contiene datos biométricos de asistencia' },
  { id: 'ACT-011', nombre: 'Cámaras de Videovigilancia', tipo: 'Hardware', propietario: 'Seguridad', custodio: 'Seguridad Física', ubicacion: 'Oficinas centrales', criticidad: 'Baja', confidencialidad: 4, integridad: 3, disponibilidad: 3, relacionDatosPersonales: true, categoriasDatos: ['Imagen', 'Identificación'], soporte: 'Digital', sistemaAsociado: 'Hikvision NVR', dependenciaTecnologica: 'Baja', estado: 'Activo', amenazas: ['Acceso no autorizado a grabaciones', 'Destrucción de evidencia'], vulnerabilidades: ['Contraseñas por defecto en cámaras'], controles: ['Acceso restringido', 'Retención de 30 días', 'Aviso de videovigilancia'], valor: 20000, observaciones: 'Requiere señalización conforme LOPDP' },
  { id: 'ACT-012', nombre: 'Portal Web Corporativo', tipo: 'Software', propietario: 'Marketing', custodio: 'Tecnología', ubicacion: 'Nube - Hosting Ecuador', criticidad: 'Media', confidencialidad: 3, integridad: 4, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto', 'Navegación'], soporte: 'Digital', sistemaAsociado: 'WordPress + Plugin personalizado', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Defacement', 'Inyección de código', 'Robo de cookies'], vulnerabilidades: ['Plugins sin actualizar', 'Política de cookies incompleta'], controles: ['SSL/TLS', 'WAF', 'Actualizaciones mensuales'], valor: 30000, observaciones: '' },
  { id: 'ACT-013', nombre: 'Laptop Corporativas (Lote)', tipo: 'Hardware', propietario: 'Tecnología', custodio: 'Soporte Técnico', ubicacion: 'Oficinas / Remoto', criticidad: 'Media', confidencialidad: 4, integridad: 3, disponibilidad: 3, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Contacto', 'Comerciales'], soporte: 'Digital', sistemaAsociado: 'Windows 11 Pro', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Robo', 'Pérdida', 'Malware'], vulnerabilidades: ['Sin cifrado de disco en 30% de equipos'], controles: ['BitLocker', 'MDM', 'Antivirus corporativo'], valor: 75000, observaciones: '45 equipos en total' },
  { id: 'ACT-014', nombre: 'Servicio de Tercerización de Cobranzas', tipo: 'Tercero', propietario: 'Financiero', custodio: 'Agente externo - CobrExpress S.A.', ubicacion: 'Oficinas CobrExpress - Guayaquil', criticidad: 'Alta', confidencialidad: 4, integridad: 4, disponibilidad: 3, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Financieros', 'Contacto'], soporte: 'Digital/Físico', sistemaAsociado: 'Sistema CobrExpress', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: ['Uso indebido por tercero', 'Fuga de datos del proveedor'], vulnerabilidades: ['Sin auditoría al proveedor en 2 años', 'Contrato sin cláusulas LOPDP actualizadas'], controles: ['Contrato de encargado de tratamiento', 'Cláusula de confidencialidad'], valor: 35000, observaciones: 'Requiere actualización de contrato conforme art. 23 LOPDP' },
  { id: 'ACT-015', nombre: 'App Móvil para Clientes', tipo: 'Software', propietario: 'Tecnología', custodio: 'Desarrollo Móvil', ubicacion: 'AWS + Google Play / App Store', criticidad: 'Alta', confidencialidad: 5, integridad: 4, disponibilidad: 4, relacionDatosPersonales: true, categoriasDatos: ['Identificación', 'Financieros', 'Biometría', 'Ubicación'], soporte: 'Digital', sistemaAsociado: 'App TecServiFin v2.1', dependenciaTecnologica: 'Alta', estado: 'Activo', amenazas: ['Reverse engineering', 'Man-in-the-middle', 'Almacenamiento inseguro en dispositivo'], vulnerabilidades: ['Datos en caché sin cifrar', 'Permisos excesivos'], controles: ['Cifrado end-to-end', 'Biometría para acceso', 'Code signing'], valor: 95000, observaciones: 'Datos biométricos requieren evaluación de impacto' }
];

export const demoRATs: RAT[] = [
  { id: 'RAT-001', nombre: 'Gestión de relación contractual con clientes', unidadResponsable: 'Operaciones', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Ana Lucía Paredes', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Ejecutar, administrar y dar seguimiento a la relación contractual con los clientes para la prestación de servicios financieros', baseLegitimadora: 'Ejecución de contrato', categoriasTitulares: ['Clientes', 'Potenciales clientes'], categoriasDatos: ['Identificación', 'Contacto', 'Financieros', 'Transaccionales'], categoriasEspeciales: [], destinatarios: ['Departamento interno de cobranzas', 'Entidades financieras aliadas'], transferencias: 'Sin transferencias internacionales', decisionesAutomatizadas: true, plazoConservacion: 'Durante la relación contractual + 7 años', ubicacionBD: 'Servidor local - Datacenter Quito / AWS us-east-1', sistemaAplicacion: 'CRM + Sistema de Pagos', medidasSeguridad: ['Cifrado en tránsito y reposo', 'Control de acceso por roles', 'Backup diario', 'Monitoreo de accesos'], activosRelacionados: ['ACT-001', 'ACT-003', 'ACT-004'], estado: 'Vigente', fechaCreacion: '2024-03-01', fechaRevision: '2025-12-15', fechaAprobacion: '2025-01-10', nivelRiesgo: 'Medio' },
  { id: 'RAT-002', nombre: 'Gestión de nómina y obligaciones laborales', unidadResponsable: 'Recursos Humanos', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Carmen Rosa Vega', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Administrar la nómina, beneficios laborales y obligaciones con el IESS de los trabajadores', baseLegitimadora: 'Relación laboral / Obligación legal', categoriasTitulares: ['Empleados', 'Ex empleados'], categoriasDatos: ['Identificación', 'Laborales', 'Financieros', 'Salud'], categoriasEspeciales: ['Datos de salud (incapacidades)'], destinatarios: ['IESS', 'SRI', 'Ministerio de Trabajo'], transferencias: 'Comunicación a entidades públicas por obligación legal', decisionesAutomatizadas: false, plazoConservacion: 'Relación laboral + 10 años', ubicacionBD: 'Nube - Plataforma de Nómina', sistemaAplicacion: 'Nómina Plus v5', medidasSeguridad: ['Acceso restringido a RRHH', 'Cifrado', 'Logs de auditoría'], activosRelacionados: ['ACT-006', 'ACT-010'], estado: 'Vigente', fechaCreacion: '2024-03-01', fechaRevision: '2025-11-20', fechaAprobacion: '2025-01-10', nivelRiesgo: 'Alto' },
  { id: 'RAT-003', nombre: 'Videovigilancia de instalaciones', unidadResponsable: 'Seguridad', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Andrés Felipe Bravo', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Garantizar la seguridad física de las instalaciones, empleados y visitantes', baseLegitimadora: 'Interés legítimo', categoriasTitulares: ['Empleados', 'Visitantes', 'Proveedores'], categoriasDatos: ['Imagen', 'Identificación'], categoriasEspeciales: [], destinatarios: ['Departamento de Seguridad', 'Fuerzas del orden (solo requerimiento)'], transferencias: 'Sin transferencias', decisionesAutomatizadas: false, plazoConservacion: '30 días', ubicacionBD: 'NVR local - Oficina de Seguridad', sistemaAplicacion: 'Hikvision NVR', medidasSeguridad: ['Acceso restringido', 'Retención limitada', 'Señalización'], activosRelacionados: ['ACT-011'], estado: 'Vigente', fechaCreacion: '2024-06-15', fechaRevision: '2025-10-01', fechaAprobacion: '2024-07-01', nivelRiesgo: 'Bajo' },
  { id: 'RAT-004', nombre: 'Gestión de cobranza tercerizada', unidadResponsable: 'Financiero', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Patricia Isabel Moreno', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Gestionar el proceso de cobranza de Cartera vencida a través de tercero autorizado', baseLegitimadora: 'Ejecución de contrato / Interés legítimo', categoriasTitulares: ['Clientes morosos'], categoriasDatos: ['Identificación', 'Financieros', 'Contacto'], categoriasEspeciales: [], destinatarios: ['CobrExpress S.A. (encargado)'], transferencias: 'Comunicación a encargado de tratamiento nacional', decisionesAutomatizadas: false, plazoConservacion: 'Durante gestión + 5 años', ubicacionBD: 'Sistema CobrExpress - Guayaquil', sistemaAplicacion: 'Sistema CobrExpress', medidasSeguridad: ['Contrato de encargado', 'Confidencialidad', 'Auditoría anual'], activosRelacionados: ['ACT-014'], estado: 'Vigente', fechaCreacion: '2024-04-10', fechaRevision: '2025-09-15', fechaAprobacion: '2024-05-01', nivelRiesgo: 'Medio' },
  { id: 'RAT-005', nombre: 'Registro biométrico de asistencia', unidadResponsable: 'Recursos Humanos', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Carmen Rosa Vega', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Control de asistencia y puntualidad del personal mediante datos biométricos', baseLegitimadora: 'Relación laboral', categoriasTitulares: ['Empleados'], categoriasDatos: ['Identificación', 'Biometría'], categoriasEspeciales: ['Datos biométricos'], destinatarios: ['Departamento de RRHH'], transferencias: 'Sin transferencias', decisionesAutomatizadas: false, plazoConservacion: 'Relación laboral + 5 años', ubicacionBD: 'Servidor local RRHH', sistemaAplicacion: 'Control Biométrico ZKTeco', medidasSeguridad: ['Acceso restringido', 'Cifrado de templates', 'Sin almacenamiento de imagen facial'], activosRelacionados: ['ACT-010'], estado: 'Vigente', fechaCreacion: '2024-05-20', fechaRevision: '2025-12-01', fechaAprobacion: '2024-06-01', nivelRiesgo: 'Alto' },
  { id: 'RAT-006', nombre: 'Marketing y comunicaciones comerciales', unidadResponsable: 'Comercial', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Fernando Alejandro Ruiz', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Enviar comunicaciones comerciales, promociones y newsletters a clientes y prospectos', baseLegitimadora: 'Consentimiento', categoriasTitulares: ['Clientes', 'Prospectos', 'Suscriptores web'], categoriasDatos: ['Identificación', 'Contacto', 'Preferencias', 'Navegación'], categoriasEspeciales: [], destinatarios: ['Departamento de Marketing', 'Plataforma de email marketing'], transferencias: 'Proveedor de email marketing en EE.UU. (con cláusulas estándar)', decisionesAutomatizadas: true, plazoConservacion: 'Hasta revocación del consentimiento', ubicacionBD: 'Salesforce + Mailchimp', sistemaAplicacion: 'CRM + Mailchimp', medidasSeguridad: ['Consentimiento explícito', 'Mecanismo de baja', 'Cifrado'], activosRelacionados: ['ACT-007', 'ACT-012'], estado: 'Vigente', fechaCreacion: '2024-07-01', fechaRevision: '2025-11-15', fechaAprobacion: '2024-07-15', nivelRiesgo: 'Medio' },
  { id: 'RAT-007', nombre: 'Gestión de proveedores y contratistas', unidadResponsable: 'Administración', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'Diana Carolina Núñez', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Administrar la relación contractual con proveedores, gestionar pagos y evaluaciones', baseLegitimadora: 'Ejecución de contrato / Obligación legal', categoriasTitulares: ['Proveedores', 'Representantes de proveedores'], categoriasDatos: ['Identificación', 'Contacto', 'Financieros'], categoriasEspeciales: [], destinatarios: ['Departamento Financiero', 'SRI'], transferencias: 'Sin transferencias', decisionesAutomatizadas: false, plazoConservacion: 'Relación contractual + 7 años', ubicacionBD: 'Servidor local SAP', sistemaAplicacion: 'SAP Business One', medidasSeguridad: ['Control de acceso', 'Backup', 'Cifrado'], activosRelacionados: ['ACT-008'], estado: 'Vigente', fechaCreacion: '2024-03-15', fechaRevision: '2025-10-20', fechaAprobacion: '2024-04-01', nivelRiesgo: 'Bajo' },
  { id: 'RAT-008', nombre: 'Atención de derechos ARCO', unidadResponsable: 'Cumplimiento', responsableTratamiento: 'Carlos Mendoza Villacís', encargadoTratamiento: 'María Fernanda Andrade', delegadoProteccionDatos: 'Roberto Salazar Espinoza', finalidad: 'Gestionar las solicitudes de Acceso, Rectificación, Cancelación y Oposición de los titulares', baseLegitimadora: 'Obligación legal (LOPDP)', categoriasTitulares: ['Todos los titulares'], categoriasDatos: ['Identificación', 'Contacto', 'Solicitud'], categoriasEspeciales: [], destinatarios: ['Departamento de Cumplimiento'], transferencias: 'Sin transferencias', decisionesAutomatizadas: false, plazoConservacion: 'Registro permanente de solicitudes', ubicacionBD: 'Sistema de gestión de cumplimiento', sistemaAplicacion: 'Plataforma interna de cumplimiento', medidasSeguridad: ['Acceso restringido', 'Trazabilidad', 'Plazos de respuesta'], activosRelacionados: [], estado: 'Vigente', fechaCreacion: '2024-06-01', fechaRevision: '2025-12-20', fechaAprobacion: '2024-06-15', nivelRiesgo: 'Bajo' }
];

export const demoIncidents: Incident[] = [
  { id: 'INC-001', codigo: 'INC-2025-001', fechaDeteccion: '2025-08-15', fechaEvento: '2025-08-14', reportante: 'Andrés Felipe Bravo', activoAfectado: 'ACT-003', tratamientoAfectado: 'RAT-001', tipo: 'Acceso no autorizado', descripcion: 'Se detectaron intentos de acceso no autorizado al sistema de procesamiento de pagos desde IPs no reconocidas. El WAF bloqueó los intentos pero se requiere investigación.', causaRaiz: 'Intento de ataque externo - Fuerza bruta en API', datosComprometidos: ['Ningún dato comprometido - intento bloqueado'], titularesAfectados: 0, impacto: 3, probabilidad: 2, severidad: 'Media', estado: 'Cerrado', accionesContencion: 'Bloqueo de IPs, activación de protocolo de respuesta', accionesCorrectivas: 'Implementación de rate limiting en APIs, fortalecimiento de WAF', accionesPreventivas: 'Monitoreo 24/7, pentest trimestral', responsableRespuesta: 'Andrés Felipe Bravo', necesidadNotificacion: false, fechaLimiteNotificacion: '', estadoCierre: 'Cerrado satisfactoriamente' },
  { id: 'INC-002', codigo: 'INC-2025-002', fechaDeteccion: '2025-10-22', fechaEvento: '2025-10-20', reportante: 'José Miguel Torres', activoAfectado: 'ACT-004', tratamientoAfectado: 'RAT-001', tipo: 'Fuga de datos', descripcion: 'Un desarrollador envió accidentalmente un archivo de base de datos con datos de prueba que contenía datos reales de 23 clientes a un repositorio público de GitHub durante 4 horas.', causaRaiz: 'Error humano - Falta de procedimiento de sanitización de datos de prueba', datosComprometidos: ['Identificación', 'Contacto', 'Financieros'], titularesAfectados: 23, impacto: 4, probabilidad: 3, severidad: 'Alta', estado: 'En seguimiento', accionesContencion: 'Eliminación del repositorio público, notificación a GitHub, verificación de clonaciones', accionesCorrectivas: 'Implementación de DLP, procedimiento de datos de prueba anonimizados', accionesPreventivas: 'Capacitación obligatoria en manejo de datos, revisión de commits', responsableRespuesta: 'Andrés Felipe Bravo', necesidadNotificacion: true, fechaLimiteNotificacion: '2025-10-29', estadoCierre: 'Notificación a SPDP realizada - Plan correctivo en ejecución' },
  { id: 'INC-003', codigo: 'INC-2025-003', fechaDeteccion: '2025-11-05', fechaEvento: '2025-11-05', reportante: 'Monitoreo automático', activoAfectado: 'ACT-002', tratamientoAfectado: '', tipo: 'Phishing', descripcion: 'Se detectó campaña de phishing dirigida a 5 empleados. 2 empleados hicieron clic en enlace malicioso pero no ingresaron credenciales.', causaRaiz: 'Campaña de phishing externa - Falta de concienciación', datosComprometidos: ['Ningún dato comprometido'], titularesAfectados: 0, impacto: 2, probabilidad: 4, severidad: 'Baja', estado: 'Cerrado', accionesContencion: 'Bloqueo de URLs maliciosas, alerta a todos los empleados', accionesCorrectivas: 'Simulacro de phishing mensual', accionesPreventivas: 'Programa de concienciación continua', responsableRespuesta: 'Andrés Felipe Bravo', necesidadNotificacion: false, fechaLimiteNotificacion: '', estadoCierre: 'Cerrado' },
  { id: 'INC-004', codigo: 'INC-2026-001', fechaDeteccion: '2026-01-10', fechaEvento: '2026-01-09', reportante: 'Proveedor hosting', activoAfectado: 'ACT-012', tratamientoAfectado: 'RAT-006', tipo: 'Vulneración de seguridad', descripcion: 'El proveedor de hosting reportó una vulnerabilidad en un plugin de WordPress que podría haber permitido acceso a la base de datos del portal web. Se aplica parche inmediatamente.', causaRaiz: 'Plugin desactualizado - Vulnerabilidad CVE-2026-0123', datosComprometidos: ['Posible acceso a cookies de sesión'], titularesAfectados: 500, impacto: 3, probabilidad: 3, severidad: 'Media', estado: 'Abierto', accionesContencion: 'Parche aplicado, rotación de sesiones, auditoría de accesos', accionesCorrectivas: 'Automatización de actualizaciones de plugins', accionesPreventivas: 'Revisión mensual de plugins, WAF adicional', responsableRespuesta: 'José Miguel Torres', necesidadNotificacion: true, fechaLimiteNotificacion: '2026-01-17', estadoCierre: 'En investigación' },
  { id: 'INC-005', codigo: 'INC-2026-002', fechaDeteccion: '2026-01-20', fechaEvento: '2026-01-18', reportante: 'Auditoría interna', activoAfectado: 'ACT-014', tratamientoAfectado: 'RAT-004', tipo: 'Incumplimiento contractual', descripcion: 'Se detectó que el proveedor de cobranzas CobrExpress S.A. no renovó su contrato de encargado de tratamiento conforme a los requisitos del art. 23 LOPDP y art. 32 RGLOPDP.', causaRaiz: 'Falta de seguimiento contractual - Vencimiento no monitoreado', datosComprometidos: ['Riesgo potencial - Sin evidencia de uso indebido'], titularesAfectados: 150, impacto: 3, probabilidad: 2, severidad: 'Media', estado: 'Abierto', accionesContencion: 'Notificación formal al proveedor, solicitud de regularización', accionesCorrectivas: 'Actualización de contrato conforme LOPDP', accionesPreventivas: 'Sistema de alertas de vencimiento contractual', responsableRespuesta: 'María Fernanda Andrade', necesidadNotificacion: false, fechaLimiteNotificacion: '', estadoCierre: 'Pendiente regularización' }
];

export const demoRisks: Risk[] = [
  { id: 'RSK-001', nombre: 'Acceso no autorizado a base de datos de clientes', proceso: 'Operaciones', activo: 'ACT-001', tratamiento: 'RAT-001', probabilidad: 3, impacto: 5, riesgoInherente: 15, controlesExistentes: ['Firewall', 'Control de acceso por roles', 'Monitoreo'], eficaciaControles: 70, riesgoResidual: 10, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Andrés Felipe Bravo', fechaRevision: '2026-03-01', estado: 'En tratamiento' },
  { id: 'RSK-002', nombre: 'Fuga de datos por error humano', proceso: 'Tecnología', activo: 'ACT-004', tratamiento: 'RAT-001', probabilidad: 3, impacto: 4, riesgoInherente: 12, controlesExistentes: ['Capacitación', 'DLP'], eficaciaControles: 50, riesgoResidual: 8, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'José Miguel Torres', fechaRevision: '2026-02-15', estado: 'En tratamiento' },
  { id: 'RSK-003', nombre: 'Ransomware en servidores críticos', proceso: 'Tecnología', activo: 'ACT-004', tratamiento: 'RAT-001', probabilidad: 2, impacto: 5, riesgoInherente: 10, controlesExistentes: ['Backup diario', 'Antivirus', 'Segmentación de red'], eficaciaControles: 75, riesgoResidual: 5, nivelAceptacion: 'Aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Andrés Felipe Bravo', fechaRevision: '2026-04-01', estado: 'Controlado' },
  { id: 'RSK-004', nombre: 'Uso indebido de datos por tercero (cobranzas)', proceso: 'Financiero', activo: 'ACT-014', tratamiento: 'RAT-004', probabilidad: 2, impacto: 4, riesgoInherente: 8, controlesExistentes: ['Contrato de encargado', 'Confidencialidad'], eficaciaControles: 40, riesgoResidual: 6, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Patricia Isabel Moreno', fechaRevision: '2026-02-01', estado: 'En tratamiento' },
  { id: 'RSK-005', nombre: 'Phishing a empleados con acceso a datos', proceso: 'Todos', activo: 'ACT-002', tratamiento: 'RAT-001', probabilidad: 4, impacto: 3, riesgoInherente: 12, controlesExistentes: ['Filtro antispam', 'MFA', 'Capacitación'], eficaciaControles: 60, riesgoResidual: 7, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Andrés Felipe Bravo', fechaRevision: '2026-03-15', estado: 'En tratamiento' },
  { id: 'RSK-006', nombre: 'Pérdida o robo de laptop con datos de clientes', proceso: 'Comercial', activo: 'ACT-013', tratamiento: 'RAT-006', probabilidad: 2, impacto: 4, riesgoInherente: 8, controlesExistentes: ['BitLocker', 'MDM', 'Política de trabajo remoto'], eficaciaControles: 80, riesgoResidual: 3, nivelAceptacion: 'Aceptable', tratamientoRiesgo: 'Aceptar', responsable: 'Fernando Alejandro Ruiz', fechaRevision: '2026-06-01', estado: 'Aceptado' },
  { id: 'RSK-007', nombre: 'Vulnerabilidad en app móvil con datos biométricos', proceso: 'Tecnología', activo: 'ACT-015', tratamiento: 'RAT-001', probabilidad: 3, impacto: 5, riesgoInherente: 15, controlesExistentes: ['Cifrado E2E', 'Code signing', 'Pentest'], eficaciaControles: 65, riesgoResidual: 8, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'José Miguel Torres', fechaRevision: '2026-02-28', estado: 'En tratamiento' },
  { id: 'RSK-008', nombre: 'Acceso no autorizado a expedientes físicos de empleados', proceso: 'RRHH', activo: 'ACT-006', tratamiento: 'RAT-002', probabilidad: 2, impacto: 3, riesgoInherente: 6, controlesExistentes: ['Acceso restringido', 'Armario con llave'], eficaciaControles: 60, riesgoResidual: 4, nivelAceptacion: 'Aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Carmen Rosa Vega', fechaRevision: '2026-05-01', estado: 'Controlado' },
  { id: 'RSK-009', nombre: 'Incumplimiento de plazos de respuesta ARCO', proceso: 'Cumplimiento', activo: '', tratamiento: 'RAT-008', probabilidad: 2, impacto: 3, riesgoInherente: 6, controlesExistentes: ['Procedimiento documentado', 'Alertas de plazos'], eficaciaControles: 70, riesgoResidual: 3, nivelAceptacion: 'Aceptable', tratamientoRiesgo: 'Aceptar', responsable: 'María Fernanda Andrade', fechaRevision: '2026-06-01', estado: 'Aceptado' },
  { id: 'RSK-010', nombre: 'Videovigilancia sin señalización adecuada', proceso: 'Seguridad', activo: 'ACT-011', tratamiento: 'RAT-003', probabilidad: 3, impacto: 2, riesgoInherente: 6, controlesExistentes: ['Señalización parcial'], eficaciaControles: 50, riesgoResidual: 4, nivelAceptacion: 'Aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Andrés Felipe Bravo', fechaRevision: '2026-03-01', estado: 'En tratamiento' },
  { id: 'RSK-011', nombre: 'Proveedor de nómina sin certificación de seguridad', proceso: 'RRHH', activo: 'ACT-010', tratamiento: 'RAT-002', probabilidad: 2, impacto: 4, riesgoInherente: 8, controlesExistentes: ['Contrato con cláusulas de seguridad'], eficaciaControles: 45, riesgoResidual: 5, nivelAceptacion: 'Aceptable condicional', tratamientoRiesgo: 'Transferir', responsable: 'Carmen Rosa Vega', fechaRevision: '2026-04-01', estado: 'En tratamiento' },
  { id: 'RSK-012', nombre: 'Consentimientos desactualizados de titulares', proceso: 'Comercial', activo: 'ACT-007', tratamiento: 'RAT-006', probabilidad: 3, impacto: 3, riesgoInherente: 9, controlesExistentes: ['Revisión anual'], eficaciaControles: 40, riesgoResidual: 6, nivelAceptacion: 'No aceptable', tratamientoRiesgo: 'Mitigar', responsable: 'Fernando Alejandro Ruiz', fechaRevision: '2026-02-15', estado: 'En tratamiento' }
];

export const demoAudits: Audit[] = [
  { id: 'AUD-001', nombre: 'Auditoría de Cumplimiento LOPDP - 2025', tipo: 'Cumplimiento LOPDP', auditor: 'Lcda. María Fernanda Andrade', fechaInicio: '2025-09-01', fechaFin: '2025-10-15', alcance: 'Evaluación integral del cumplimiento de la LOPDP y su Reglamento en todos los tratamientos de datos personales', scoring: 72, estado: 'Cerrada con hallazgos', criterios: [
    { id: 'C-001', descripcion: 'Existencia de política de protección de datos personales documentada y vigente', cumplimiento: 'Cumple', evidencia: 'Política PD-001 v3.0 aprobada el 2025-01-15', hallazgo: 'Sin hallazgos', recomendacion: 'Mantener revisión anual' },
    { id: 'C-002', descripcion: 'Registro de Actividades de Tratamiento (RAT) completo y actualizado', cumplimiento: 'Cumple parcial', evidencia: 'RAT con 8 tratamientos registrados, faltan 2 tratamientos menores', hallazgo: 'Tratamientos de acceso a oficinas y gestión de visitas no registrados en RAT', recomendacion: 'Completar RAT con todos los tratamientos identificados' },
    { id: 'C-003', descripcion: 'Consentimientos obtenidos conforme a la LOPDP', cumplimiento: 'Cumple parcial', evidencia: '85% de consentimientos actualizados, 15% pendientes de renovación', hallazgo: '4 empleados sin consentimiento actualizado conforme nueva política', recomendacion: 'Plan de regularización de consentimientos pendientes' },
    { id: 'C-004', descripcion: 'Evaluación de impacto realizada para tratamientos de alto riesgo', cumplimiento: 'No cumple', evidencia: 'No se encontró EIPD documentada para tratamiento biométrico ni app móvil', hallazgo: 'Falta EIPD para RAT-005 (biometría) y RAT-001 en componente app móvil', recomendacion: 'Realizar EIPD prioritariamente para datos biométricos y app móvil' },
    { id: 'C-005', descripcion: 'Procedimiento de atención de derechos ARCO implementado', cumplimiento: 'Cumple', evidencia: 'Procedimiento PRO-ARCO-001 v2.0, 12 solicitudes atendidas en plazo', hallazgo: 'Sin hallazgos', recomendacion: 'Continuar con monitoreo de plazos' },
    { id: 'C-006', descripcion: 'Contratos con encargados de tratamiento conforme art. 23 LOPDP', cumplimiento: 'No cumple', evidencia: 'Contrato con CobrExpress sin actualizar desde 2022', hallazgo: 'Contrato de encargado de tratamiento con CobrExpress no cumple requisitos del art. 23 LOPDP ni art. 32 RGLOPDP', recomendacion: 'Actualizar contrato inmediatamente conforme normativa vigente' },
    { id: 'C-007', descripcion: 'Notificación de incidentes a la SPDP en plazos establecidos', cumplimiento: 'Cumple', evidencia: 'INC-2025-002 notificado dentro de 72 horas', hallazgo: 'Sin hallazgos', recomendacion: 'Mantener procedimiento de notificación' },
    { id: 'C-008', descripcion: 'Programa de capacitación en protección de datos', cumplimiento: 'Cumple parcial', evidencia: '70% de empleados capacitados, 30% pendiente', hallazgo: '3 empleados sin capacitación, 1 con capacitación reprobada', recomendacion: 'Programa de nivelación obligatorio en 60 días' }
  ], hallazgos: [
    { id: 'H-001', descripcion: 'RAT incompleto - Faltan 2 tratamientos', severidad: 'Menor', responsable: 'María Fernanda Andrade', fechaCompromiso: '2026-02-28', estado: 'En remedición' },
    { id: 'H-002', descripcion: 'Consentimientos pendientes de actualización', severidad: 'Mayor', responsable: 'Carmen Rosa Vega', fechaCompromiso: '2026-03-15', estado: 'En remedición' },
    { id: 'H-003', descripcion: 'Falta EIPD para tratamientos de alto riesgo', severidad: 'Crítico', responsable: 'Roberto Salazar Espinoza', fechaCompromiso: '2026-02-15', estado: 'Abierto' },
    { id: 'H-004', descripcion: 'Contrato de encargado desactualizado', severidad: 'Mayor', responsable: 'Patricia Isabel Moreno', fechaCompromiso: '2026-02-01', estado: 'En remedición' },
    { id: 'H-005', descripcion: 'Empleados sin capacitación en protección de datos', severidad: 'Menor', responsable: 'Carmen Rosa Vega', fechaCompromiso: '2026-04-01', estado: 'Abierto' }
  ] },
  { id: 'AUD-002', nombre: 'Auditoría de Seguridad de la Información - 2025', tipo: 'Seguridad de la Información (ISO 27001)', auditor: 'Ing. Seguridad Externa - AuditSec CIA. LTDA.', fechaInicio: '2025-11-01', fechaFin: '2025-12-20', alcance: 'Evaluación de controles de seguridad de la información alineados a ISO 27001:2022', scoring: 68, estado: 'Cerrada con hallazgos', criterios: [
    { id: 'C-009', descripcion: 'Gestión de accesos - Control de identidad y autenticación', cumplimiento: 'Cumple parcial', evidencia: 'MFA implementado en sistemas críticos, pero no en todos los accesos', hallazgo: '30% de aplicaciones sin MFA', recomendacion: 'Extender MFA a todas las aplicaciones con datos personales' },
    { id: 'C-010', descripcion: 'Cifrado de datos en tránsito y reposo', cumplimiento: 'Cumple parcial', evidencia: 'TLS 1.3 en tránsito, cifrado en reposo solo en BD principal', hallazgo: 'Laptops sin cifrado de disco (30%), backup sin cifrar', recomendacion: 'Implementar BitLocker en 100% de equipos y cifrar backups' },
    { id: 'C-011', descripcion: 'Gestión de incidentes de seguridad', cumplimiento: 'Cumple', evidencia: 'Procedimiento documentado, equipo de respuesta conformado', hallazgo: 'Sin hallazgos', recomendacion: 'Realizar simulacro anual de respuesta' },
    { id: 'C-012', descripcion: 'Copias de seguridad y recuperación', cumplimiento: 'Cumple', evidencia: 'Backup diario, replicación geográfica, RTO/RPO definidos', hallazgo: 'Sin hallazgos', recomendacion: 'Prueba de restauración semestral' },
    { id: 'C-013', descripcion: 'Seguridad en desarrollo de software', cumplimiento: 'No cumple parcial', evidencia: 'Sin proceso formal de desarrollo seguro', hallazgo: 'No existe revisión de seguridad en CI/CD, sin SAST/DAST', recomendacion: 'Implementar pipeline de seguridad (DevSecOps)' },
    { id: 'C-014', descripcion: 'Gestión de vulnerabilidades', cumplimiento: 'Cumple parcial', evidencia: 'Escaneo trimestral, pero sin SLA de remediación', hallazgo: '12 vulnerabilidades críticas sin parchar por más de 90 días', recomendacion: 'Definir SLA de remediación por criticidad' }
  ], hallazgos: [
    { id: 'H-006', descripcion: 'MFA no implementado en todas las aplicaciones', severidad: 'Mayor', responsable: 'Andrés Felipe Bravo', fechaCompromiso: '2026-03-01', estado: 'En remedición' },
    { id: 'H-007', descripcion: 'Laptops sin cifrado de disco', severidad: 'Mayor', responsable: 'José Miguel Torres', fechaCompromiso: '2026-02-15', estado: 'En remedición' },
    { id: 'H-008', descripcion: 'Sin proceso de desarrollo seguro', severidad: 'Crítico', responsable: 'José Miguel Torres', fechaCompromiso: '2026-06-01', estado: 'Abierto' },
    { id: 'H-009', descripcion: 'Vulnerabilidades críticas sin parchar', severidad: 'Crítico', responsable: 'Andrés Felipe Bravo', fechaCompromiso: '2026-01-31', estado: 'Vencido' }
  ] }
];

export const demoDocuments: Document[] = [
  { id: 'DOC-001', nombre: 'Política de Protección de Datos Personales', tipo: 'Política', version: '3.0', fechaEmision: '2025-01-15', fechaRevision: '2026-01-15', responsable: 'Roberto Salazar Espinoza', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nPOLÍTICA DE PROTECCIÓN DE DATOS PERSONALES\nTECNOLOGÍA Y SERVICIOS FINANCIEROS S.A.\n\n1. OBJETO\nEstablecer los lineamientos para el tratamiento de datos personales conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP) y su Reglamento General.\n\n2. ALCANCE\nAplica a todos los tratamientos de datos personales realizados por TecServiFin.\n\n3. PRINCIPIOS\n- Licitud, lealtad y transparencia\n- Finalidad determinada\n- Proporcionalidad\n- Responsabilidad proactiva\n- Privacidad desde el diseño y por defecto\n\n4. OBLIGACIONES\n[Contenido parametrizable según empresa]' },
  { id: 'DOC-002', nombre: 'Consentimiento para Empleados', tipo: 'Consentimiento', version: '2.1', fechaEmision: '2025-03-01', fechaRevision: '2026-03-01', responsable: 'Carmen Rosa Vega', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nFORMATO DE CONSENTIMIENTO PARA TRATAMIENTO DE DATOS PERSONALES - EMPLEADOS\n\nYo, ___________________________, con cédula ____________, declaro haber sido informado/a de manera clara y expresa sobre:\n\n1. Los datos personales que serán tratados\n2. Las finalidades del tratamiento\n3. Los derechos ARCO que me asisten\n4. El tiempo de conservación\n5. Los destinatarios de los datos\n\nFirma: _________________  Fecha: _________________' },
  { id: 'DOC-003', nombre: 'Consentimiento para Clientes', tipo: 'Consentimiento', version: '2.0', fechaEmision: '2025-02-15', fechaRevision: '2026-02-15', responsable: 'Ana Lucía Paredes', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nAVISO DE PRIVACIDAD Y CONSENTIMIENTO - CLIENTES\n\nTecServiFin informa que sus datos personales serán tratados conforme a la LOPDP...\n\n[Contenido parametrizable]' },
  { id: 'DOC-004', nombre: 'Consentimiento para Proveedores', tipo: 'Consentimiento', version: '1.2', fechaEmision: '2025-04-01', fechaRevision: '2026-04-01', responsable: 'Diana Carolina Núñez', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nCONSENTIMIENTO PARA TRATAMIENTO DE DATOS - PROVEEDORES\n\n[Contenido parametrizable]' },
  { id: 'DOC-005', nombre: 'Formato de Registro de Actividades de Tratamiento', tipo: 'Registro', version: '2.0', fechaEmision: '2025-01-10', fechaRevision: '2026-01-10', responsable: 'María Fernanda Andrade', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Conforme art. 38 RGLOPDP\n\nREGISTRO DE ACTIVIDADES DE TRATAMIENTO\n\n[Formato parametrizable según cada tratamiento]' },
  { id: 'DOC-006', nombre: 'Política de Gestión de Incidentes', tipo: 'Política', version: '1.5', fechaEmision: '2025-06-01', fechaRevision: '2026-06-01', responsable: 'Andrés Felipe Bravo', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nPOLÍTICA DE GESTIÓN DE INCIDENTES DE SEGURIDAD Y PROTECCIÓN DE DATOS\n\n1. Objeto\n2. Clasificación de incidentes\n3. Procedimiento de respuesta\n4. Plazos de notificación a la SPDP\n5. Documentación y evidencia\n\n[Contenido parametrizable]' },
  { id: 'DOC-007', nombre: 'Política de Cookies', tipo: 'Aviso', version: '1.0', fechaEmision: '2025-08-15', fechaRevision: '2026-08-15', responsable: 'José Miguel Torres', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nPOLÍTICA DE COOKIES\nwww.tecservifin.com.ec\n\n1. ¿Qué son las cookies?\n2. Cookies utilizadas\n3. Finalidad\n4. Cómo gestionarlas\n5. Consentimiento\n\n[Contenido parametrizable]' },
  { id: 'DOC-008', nombre: 'Aviso Legal', tipo: 'Aviso', version: '1.1', fechaEmision: '2025-07-01', fechaRevision: '2026-07-01', responsable: 'Roberto Salazar Espinoza', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nAVISO LEGAL\nwww.tecservifin.com.ec\n\n1. Datos del titular\n2. Objeto\n3. Propiedad intelectual\n4. Legislación aplicable\n\n[Contenido parametrizable]' },
  { id: 'DOC-009', nombre: 'Informe de Cumplimiento LOPDP 2025', tipo: 'Informe', version: '1.0', fechaEmision: '2025-12-30', fechaRevision: '2026-12-30', responsable: 'María Fernanda Andrade', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nINFORME DE CUMPLIMIENTO DE LA LOPDP - EJERCICIO 2025\nTECNOLOGÍA Y SERVICIOS FINANCIEROS S.A.\n\n1. Resumen ejecutivo\n2. Estado del cumplimiento\n3. Tratamientos registrados\n4. Incidentes gestionados\n5. Hallazgos y acciones correctivas\n6. Plan de mejora\n\n[Generado automáticamente con datos del sistema]' },
  { id: 'DOC-010', nombre: 'Informe de Auditoría de Seguridad 2025', tipo: 'Informe', version: '1.0', fechaEmision: '2025-12-20', fechaRevision: '2026-12-20', responsable: 'Andrés Felipe Bravo', estado: 'Vigente', contenido: 'BORRADOR EDITABLE - Sujeto a validación jurídica y técnica.\n\nINFORME DE AUDITORÍA DE SEGURIDAD DE LA INFORMACIÓN 2025\n\n1. Alcance y metodología\n2. Resultados por dominio\n3. Hallazgos\n4. Plan de acción\n5. Conclusiones\n\n[Generado con datos de auditoría]' }
];

export const demoMaturity: MaturityDimension[] = [
  { nombre: 'Gobierno y Responsabilidad', nivel: 3, descripcion: 'Política documentada, responsable designado, estructura de gobernanza definida', evidencias: ['Política de PD vigente', 'DPO designado', 'Comité de privacidad'] },
  { nombre: 'Información al Titular', nivel: 3, descripcion: 'Avisos de privacidad publicados, información clara y accesible', evidencias: ['Aviso en web', 'Cláusulas informativas', 'Formato estándar'] },
  { nombre: 'Consentimiento', nivel: 2, descripcion: 'Consentimientos obtenidos pero no todos actualizados ni con mecanismo de retiro', evidencias: ['Formato de consentimiento', '85% actualizados', 'Pendiente mecanismo de retiro fácil'] },
  { nombre: 'RAT', nivel: 3, descripcion: 'Registro completo para tratamientos principales, faltan tratamientos menores', evidencias: ['8 tratamientos registrados', 'Formato conforme art. 38 RGLOPDP', 'Pendientes 2 tratamientos'] },
  { nombre: 'Gestión de Riesgos', nivel: 2, descripcion: 'Matriz de riesgos implementada pero sin revisión periódica formal', evidencias: ['12 riesgos identificados', 'Matriz 5x5', 'Pendiente formalizar revisión trimestral'] },
  { nombre: 'Privacidad desde el Diseño', nivel: 1, descripcion: 'Concepto conocido pero no implementado formalmente en proyectos', evidencias: ['Sin EIPD documentada', 'Sin checklist de PbD', 'Capacitación básica realizada'] },
  { nombre: 'Seguridad de la Información', nivel: 3, descripcion: 'Controles básicos implementados, faltan controles avanzados', evidencias: ['Firewall, MFA parcial', 'Backup implementado', 'Pendiente DevSecOps'] },
  { nombre: 'Gestión de Incidentes', nivel: 3, descripcion: 'Procedimiento documentado y equipo de respuesta conformado', evidencias: ['5 incidentes gestionados', 'Notificación a SPDP realizada', 'Plan de mejora continuo'] },
  { nombre: 'Gestión Documental', nivel: 3, descripcion: 'Documentos principales versionados y con control de aprobación', evidencias: ['10 documentos gestionados', 'Versionado', 'Pendiente automatización'] },
  { nombre: 'Auditoría', nivel: 2, descripcion: 'Auditorías realizadas pero sin programa anual formal', evidencias: ['2 auditorías en 2025', 'Hallazgos documentados', 'Pendiente programa anual'] },
  { nombre: 'Formación y Concienciación', nivel: 2, descripcion: 'Programa básico de capacitación, cobertura parcial', evidencias: ['70% empleados capacitados', 'Pendiente programa continuo', 'Sin evaluación de eficacia'] },
  { nombre: 'Mejora Continua', nivel: 1, descripcion: 'Sin mecanismo formal de revisión y mejora del programa de cumplimiento', evidencias: ['Acciones correctivas reactivas', 'Sin indicadores de mejora', 'Pendiente KPIs de eficacia'] }
];

// ============ DERECHOS ARCO (LOPDP Arts. 16-20) ============
export interface ARCORequest {
  id: string;
  codigo: string;
  fechaSolicitud: string;
  fechaLimiteRespuesta: string;
  fechaRespuesta: string;
  titularNombre: string;
  titularCedula: string;
  titularEmail: string;
  titularTelefono: string;
  tipoDerecho: 'Acceso' | 'Rectificación' | 'Cancelación' | 'Oposición' | 'Portabilidad' | 'Limitación';
  tratamientoRelacionado: string;
  descripcion: string;
  estado: 'Recibida' | 'En análisis' | 'En proceso' | 'Respondida' | 'Cerrada' | 'Vencida';
  respuesta: string;
  responsable: string;
  observaciones: string;
  diasTranscurridos: number;
}

// ============ PLAN DE ACCIÓN ============
export interface ActionPlan {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  origen: 'Auditoría' | 'Incidente' | 'Riesgo' | 'Hallazgo' | 'Mejora Continua' | 'Obligación Legal';
  origenReferencia: string;
  prioridad: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  responsable: string;
  fechaCreacion: string;
  fechaCompromiso: string;
  fechaCierre: string;
  estado: 'Pendiente' | 'En progreso' | 'Completada' | 'Vencida' | 'Cancelada';
  progreso: number;
  acciones: { fecha: string; descripcion: string; responsable: string; completada: boolean }[];
  observaciones: string;
}

export interface EIPD {
  id: string;
  nombre: string;
  tratamiento: string;
  descripcion: string;
  responsable: string;
  fechaEvaluacion: string;
  datosEspeciales: boolean;
  transferenciasInternacionales: boolean;
  monitoreoSistematico: boolean;
  decisionesAutomatizadas: boolean;
  granEscala: boolean;
  riesgos: { id: string; descripcion: string; probabilidad: number; impacto: number; medidas: string }[];
  medidasImplementadas: string;
  medidasPropuestas: string;
  riesgoResidual: string;
  conclusion: string;
  estado: 'En evaluación' | 'Aprobada' | 'Requiere revisión' | 'No requerida';
}

// ============ DATOS DEMO ARCO ============
export const demoARCORequests: ARCORequest[] = [
  { id: 'ARCO-001', codigo: 'ARCO-2025-001', fechaSolicitud: '2025-09-15', fechaLimiteRespuesta: '2025-09-30', fechaRespuesta: '2025-09-28', titularNombre: 'Juan Pérez Martínez', titularCedula: '1712345678', titularEmail: 'jperez@email.com', titularTelefono: '+593 99 1234567', tipoDerecho: 'Acceso', tratamientoRelacionado: 'RAT-001', descripcion: 'Solicito conocer qué datos personales míos están siendo tratados y con qué finalidad.', estado: 'Cerrada', respuesta: 'Se proporcionó información completa de los datos tratados, finalidades y plazos de conservación mediante oficio Nro. 2025-001.', responsable: 'María Fernanda Andrade', observaciones: 'Respondido dentro del plazo legal de 15 días', diasTranscurridos: 13 },
  { id: 'ARCO-002', codigo: 'ARCO-2025-002', fechaSolicitud: '2025-10-05', fechaLimiteRespuesta: '2025-10-20', fechaRespuesta: '2025-10-18', titularNombre: 'María González López', titularCedula: '1723456789', titularEmail: 'mgonzalez@email.com', titularTelefono: '+593 98 2345678', tipoDerecho: 'Rectificación', tratamientoRelacionado: 'RAT-001', descripcion: 'Solicito rectificar mi dirección de correo electrónico que aparece incorrecta en sus registros.', estado: 'Cerrada', respuesta: 'Se rectificó el correo electrónico en todos los sistemas conforme a lo solicitado.', responsable: 'Ana Lucía Paredes', observaciones: 'Rectificación aplicada en CRM y BD', diasTranscurridos: 13 },
  { id: 'ARCO-003', codigo: 'ARCO-2025-003', fechaSolicitud: '2025-11-10', fechaLimiteRespuesta: '2025-11-25', fechaRespuesta: '2025-11-22', titularNombre: 'Carlos Rodríguez Silva', titularCedula: '1734567890', titularEmail: 'crodriguez@email.com', titularTelefono: '+593 97 3456789', tipoDerecho: 'Cancelación', tratamientoRelacionado: 'RAT-006', descripcion: 'Solicito la eliminación de mis datos personales de su base de datos de marketing.', estado: 'Cerrada', respuesta: 'Se procedió a la eliminación de los datos personales del titular en la base de datos de marketing, manteniendo únicamente los datos necesarios para obligaciones legales.', responsable: 'Fernando Alejandro Ruiz', observaciones: 'Eliminación confirmada en CRM y Mailchimp', diasTranscurridos: 12 },
  { id: 'ARCO-004', codigo: 'ARCO-2026-001', fechaSolicitud: '2026-01-08', fechaLimiteRespuesta: '2026-01-23', fechaRespuesta: '', titularNombre: 'Patricia Morales Vega', titularCedula: '1745678901', titularEmail: 'pmorales@email.com', titularTelefono: '+593 96 4567890', tipoDerecho: 'Oposición', tratamientoRelacionado: 'RAT-006', descripcion: 'Me opongo al tratamiento de mis datos para fines de marketing directo.', estado: 'En proceso', respuesta: '', responsable: 'Fernando Alejandro Ruiz', observaciones: 'En análisis de procedencia', diasTranscurridos: 14 },
  { id: 'ARCO-005', codigo: 'ARCO-2026-002', fechaSolicitud: '2026-01-18', fechaLimiteRespuesta: '2026-02-02', fechaRespuesta: '', titularNombre: 'Luis Herrera Castro', titularCedula: '1756789012', titularEmail: 'lherrera@email.com', titularTelefono: '+593 95 5678901', tipoDerecho: 'Acceso', tratamientoRelacionado: 'RAT-001', descripcion: 'Solicito información completa sobre el tratamiento de mis datos personales, incluyendo categorías de datos, finalidades y destinatarios.', estado: 'Recibida', respuesta: '', responsable: 'María Fernanda Andrade', observaciones: 'Pendiente análisis inicial', diasTranscurridos: 4 },
  { id: 'ARCO-006', codigo: 'ARCO-2025-004', fechaSolicitud: '2025-08-20', fechaLimiteRespuesta: '2025-09-04', fechaRespuesta: '', titularNombre: 'Andrea Jiménez Ponce', titularCedula: '1767890123', titularEmail: 'ajimenez@email.com', titularTelefono: '+593 94 6789012', tipoDerecho: 'Cancelación', tratamientoRelacionado: 'RAT-001', descripcion: 'Solicito la eliminación completa de mis datos personales.', estado: 'Vencida', respuesta: '', responsable: 'María Fernanda Andrade', observaciones: 'VENCIDA - Requiere atención inmediata', diasTranscurridos: 155 }
];

// ============ DATOS DEMO EVALUACIONES DE IMPACTO (EIPD) ============
export const demoEIPDs: EIPD[] = [
  {
    id: 'EIPD-001',
    nombre: 'Evaluación de Impacto - Sistema Biométrico',
    tratamiento: 'RAT-005',
    descripcion: 'Evaluación del tratamiento de datos biométricos para control de asistencia mediante huella dactilar',
    responsable: 'Roberto Salazar Espinoza',
    fechaEvaluacion: '2025-11-15',
    datosEspeciales: true,
    transferenciasInternacionales: false,
    monitoreoSistematico: true,
    decisionesAutomatizadas: false,
    granEscala: false,
    riesgos: [
      { id: 'R1', descripcion: 'Acceso no autorizado a templates biométricos', probabilidad: 3, impacto: 5, medidas: 'Cifrado de templates, control de acceso estricto' },
      { id: 'R2', descripcion: 'Uso indebido de datos biométricos', probabilidad: 2, impacto: 5, medidas: 'Política de uso, auditoría de accesos' }
    ],
    medidasImplementadas: 'Cifrado AES-256 de templates, control de acceso por roles, no almacenamiento de imágenes faciales',
    medidasPropuestas: 'Implementar autenticación multifactor, realizar pentest anual',
    riesgoResidual: 'Medio',
    conclusion: 'El tratamiento presenta riesgos que pueden ser mitigados con las medidas implementadas. Se recomienda mantener las medidas propuestas para reducir el riesgo residual.',
    estado: 'Aprobada'
  },
  {
    id: 'EIPD-002',
    nombre: 'Evaluación de Impacto - App Móvil',
    tratamiento: 'RAT-001',
    descripcion: 'Evaluación del tratamiento de datos personales a través de la aplicación móvil para clientes',
    responsable: 'Roberto Salazar Espinoza',
    fechaEvaluacion: '2025-12-01',
    datosEspeciales: true,
    transferenciasInternacionales: true,
    monitoreoSistematico: true,
    decisionesAutomatizadas: true,
    granEscala: true,
    riesgos: [
      { id: 'R1', descripcion: 'Robo o pérdida de dispositivo móvil', probabilidad: 4, impacto: 4, medidas: 'Cifrado en dispositivo, borrado remoto' },
      { id: 'R2', descripcion: 'Interceptación de comunicaciones', probabilidad: 3, impacto: 5, medidas: 'Cifrado end-to-end, certificados SSL' }
    ],
    medidasImplementadas: 'Cifrado end-to-end, biometría para acceso, borrado remoto',
    medidasPropuestas: 'Implementar detección de jailbreak/root, análisis de malware en tiempo real',
    riesgoResidual: 'Alto',
    conclusion: 'La aplicación presenta riesgos significativos que requieren medidas adicionales. Se debe implementar el plan de mejora antes de continuar con el tratamiento.',
    estado: 'Requiere revisión'
  }
];

// ============ DATOS DEMO PLAN DE ACCIÓN ============
export const demoActionPlans: ActionPlan[] = [
  { id: 'PA-001', codigo: 'PA-2025-001', titulo: 'Actualizar contrato con encargado de tratamiento CobrExpress', descripcion: 'Actualizar el contrato con CobrExpress S.A. conforme a los requisitos del art. 23 LOPDP y art. 32 RGLOPDP, incluyendo cláusulas de seguridad, confidencialidad y auditoría.', origen: 'Auditoría', origenReferencia: 'AUD-001 / H-004', prioridad: 'Crítica', responsable: 'Patricia Isabel Moreno', fechaCreacion: '2025-10-15', fechaCompromiso: '2026-02-01', fechaCierre: '', estado: 'En progreso', progreso: 60, acciones: [
    { fecha: '2025-11-01', descripcion: 'Revisión de cláusulas contractuales vigentes', responsable: 'Patricia Isabel Moreno', completada: true },
    { fecha: '2025-12-15', descripcion: 'Elaboración de nuevo contrato con asesoría jurídica', responsable: 'Roberto Salazar Espinoza', completada: true },
    { fecha: '2026-01-30', descripcion: 'Negociación con CobrExpress', responsable: 'Patricia Isabel Moreno', completada: false },
    { fecha: '2026-02-01', descripcion: 'Firma del nuevo contrato', responsable: 'Carlos Mendoza Villacís', completada: false }
  ], observaciones: 'En negociación con el proveedor' },
  { id: 'PA-002', codigo: 'PA-2025-002', titulo: 'Implementar EIPD para tratamiento biométrico', descripcion: 'Realizar Evaluación de Impacto de Protección de Datos para el tratamiento de datos biométricos (RAT-005) conforme art. 24 LOPDP.', origen: 'Auditoría', origenReferencia: 'AUD-001 / H-003', prioridad: 'Crítica', responsable: 'Roberto Salazar Espinoza', fechaCreacion: '2025-10-15', fechaCompromiso: '2026-02-15', fechaCierre: '', estado: 'En progreso', progreso: 35, acciones: [
    { fecha: '2025-11-15', descripcion: 'Definición de metodología EIPD', responsable: 'Roberto Salazar Espinoza', completada: true },
    { fecha: '2026-01-15', descripcion: 'Levantamiento de información del tratamiento', responsable: 'Carmen Rosa Vega', completada: false },
    { fecha: '2026-02-01', descripcion: 'Análisis de riesgos y necesidades', responsable: 'Roberto Salazar Espinoza', completada: false },
    { fecha: '2026-02-15', descripcion: 'Documentación y aprobación de EIPD', responsable: 'Roberto Salazar Espinoza', completada: false }
  ], observaciones: 'Metodología definida, pendiente levantamiento' },
  { id: 'PA-003', codigo: 'PA-2025-003', titulo: 'Regularización de consentimientos pendientes', descripcion: 'Obtener consentimientos actualizados de los 4 empleados que no tienen consentimiento vigente conforme a la nueva política.', origen: 'Auditoría', origenReferencia: 'AUD-001 / H-002', prioridad: 'Alta', responsable: 'Carmen Rosa Vega', fechaCreacion: '2025-10-20', fechaCompromiso: '2026-03-15', fechaCierre: '', estado: 'En progreso', progreso: 50, acciones: [
    { fecha: '2025-11-10', descripcion: 'Identificación de empleados pendientes', responsable: 'Carmen Rosa Vega', completada: true },
    { fecha: '2025-12-20', descripcion: 'Notificación a empleados', responsable: 'Carmen Rosa Vega', completada: true },
    { fecha: '2026-02-15', descripcion: 'Recolección de firmas', responsable: 'Carmen Rosa Vega', completada: false },
    { fecha: '2026-03-15', descripcion: 'Verificación y archivo', responsable: 'Carmen Rosa Vega', completada: false }
  ], observaciones: '2 de 4 empleados ya firmaron' },
  { id: 'PA-004', codigo: 'PA-2025-004', titulo: 'Implementar MFA en todas las aplicaciones', descripcion: 'Extender la autenticación multifactor a todas las aplicaciones que manejan datos personales, conforme hallazgo de auditoría ISO 27001.', origen: 'Auditoría', origenReferencia: 'AUD-002 / H-006', prioridad: 'Alta', responsable: 'Andrés Felipe Bravo', fechaCreacion: '2025-12-01', fechaCompromiso: '2026-03-01', fechaCierre: '', estado: 'En progreso', progreso: 40, acciones: [
    { fecha: '2025-12-15', descripcion: 'Inventario de aplicaciones sin MFA', responsable: 'Andrés Felipe Bravo', completada: true },
    { fecha: '2026-01-30', descripcion: 'Implementación en aplicaciones críticas', responsable: 'José Miguel Torres', completada: false },
    { fecha: '2026-02-28', descripcion: 'Implementación en aplicaciones restantes', responsable: 'José Miguel Torres', completada: false },
    { fecha: '2026-03-01', descripcion: 'Verificación y pruebas', responsable: 'Andrés Felipe Bravo', completada: false }
  ], observaciones: 'Inventario completado, 8 aplicaciones identificadas' },
  { id: 'PA-005', codigo: 'PA-2026-001', titulo: 'Atender solicitud ARCO vencida ARCO-2025-004', descripcion: 'Resolver de manera urgente la solicitud de cancelación ARCO-2025-004 que se encuentra vencida desde hace más de 4 meses.', origen: 'Hallazgo', origenReferencia: 'ARCO-2025-004', prioridad: 'Crítica', responsable: 'María Fernanda Andrade', fechaCreacion: '2026-01-15', fechaCompromiso: '2026-01-25', fechaCierre: '', estado: 'Pendiente', progreso: 0, acciones: [
    { fecha: '2026-01-20', descripcion: 'Contactar al titular y disculparse por demora', responsable: 'María Fernanda Andrade', completada: false },
    { fecha: '2026-01-23', descripcion: 'Procesar solicitud de cancelación', responsable: 'María Fernanda Andrade', completada: false },
    { fecha: '2026-01-25', descripcion: 'Enviar respuesta formal al titular', responsable: 'María Fernanda Andrade', completada: false }
  ], observaciones: 'URGENTE - Requiere atención inmediata' },
  { id: 'PA-006', codigo: 'PA-2026-002', titulo: 'Programa de capacitación continua 2026', descripcion: 'Diseñar e implementar programa de capacitación continua en protección de datos y seguridad de la información para todo el personal.', origen: 'Mejora Continua', origenReferencia: 'Dimensión de Madurez: Formación', prioridad: 'Media', responsable: 'Carmen Rosa Vega', fechaCreacion: '2026-01-10', fechaCompromiso: '2026-12-31', fechaCierre: '', estado: 'En progreso', progreso: 15, acciones: [
    { fecha: '2026-01-31', descripcion: 'Diseño del programa anual', responsable: 'Carmen Rosa Vega', completada: false },
    { fecha: '2026-02-28', descripcion: 'Aprobación del programa', responsable: 'Carlos Mendoza Villacís', completada: false },
    { fecha: '2026-03-31', descripcion: 'Primera sesión de capacitación', responsable: 'Roberto Salazar Espinoza', completada: false }
  ], observaciones: 'En fase de diseño' },
  { id: 'PA-007', codigo: 'PA-2026-003', titulo: 'Implementar DevSecOps en pipeline de desarrollo', descripcion: 'Implementar prácticas de seguridad en el ciclo de desarrollo de software, incluyendo SAST, DAST y revisión de seguridad en CI/CD.', origen: 'Auditoría', origenReferencia: 'AUD-002 / H-008', prioridad: 'Alta', responsable: 'José Miguel Torres', fechaCreacion: '2025-12-20', fechaCompromiso: '2026-06-01', fechaCierre: '', estado: 'Pendiente', progreso: 10, acciones: [
    { fecha: '2026-02-01', descripcion: 'Evaluación de herramientas SAST/DAST', responsable: 'José Miguel Torres', completada: false },
    { fecha: '2026-03-15', descripcion: 'Implementación piloto', responsable: 'José Miguel Torres', completada: false },
    { fecha: '2026-05-01', descripcion: 'Despliegue completo', responsable: 'José Miguel Torres', completada: false },
    { fecha: '2026-06-01', descripcion: 'Capacitación del equipo de desarrollo', responsable: 'José Miguel Torres', completada: false }
  ], observaciones: 'Pendiente evaluación de herramientas' },
  { id: 'PA-008', codigo: 'PA-2026-004', titulo: 'Cifrar laptops sin BitLocker', descripcion: 'Implementar cifrado de disco completo en las 13 laptops que actualmente no tienen BitLocker activado.', origen: 'Auditoría', origenReferencia: 'AUD-002 / H-007', prioridad: 'Alta', responsable: 'José Miguel Torres', fechaCreacion: '2025-12-15', fechaCompromiso: '2026-02-15', fechaCierre: '', estado: 'En progreso', progreso: 70, acciones: [
    { fecha: '2025-12-30', descripcion: 'Inventario de equipos sin cifrar', responsable: 'Luis Eduardo Castillo', completada: true },
    { fecha: '2026-01-15', descripcion: 'Cifrado de 5 equipos', responsable: 'Luis Eduardo Castillo', completada: true },
    { fecha: '2026-01-31', descripcion: 'Cifrado de 4 equipos adicionales', responsable: 'Luis Eduardo Castillo', completada: true },
    { fecha: '2026-02-15', descripcion: 'Cifrado de 4 equipos restantes', responsable: 'Luis Eduardo Castillo', completada: false }
  ], observaciones: '9 de 13 equipos ya cifrados' }
];
