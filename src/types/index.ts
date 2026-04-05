export interface User {
  cod_emp: string;
  email: string;
  nombre: string;
  apellido: string;
  id_rol: number;
  status: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Interfaces para el Cotizador
export interface Tercero {
  tipo_persona: 'N' | 'J';
  solicitante: string;
  email: string;
  id_sucursal?: number | null;
  id_intermediario?: number | string | null;
  nom_intermediario?: string | null;
}

export interface Vehiculo {
  marca: string; // CODMARCA (3 chars)
  modelo: string; // codmodelo (4 chars)
  anho: number;
  placa: string;
  nro_puesto: number;
  duracion: number;
  tipo_exceso: number | null;
  tipo_vehiculo: number | null;
  tasacion_especial: number | null;
  autorizado_nombre?: string;
  autorizado_sucursal?: number | null;
}

// Tipos para el sistema de cotizaciones
export interface Cobertura {
  id_cobertura: number;
  nombre: string;
  valor_asegurado: number;
  prima: number;
}

export interface SolicitudPayload {
  solicitante: Tercero;
  vehiculo: Vehiculo;
  coberturas: Cobertura[];
  opcionales?: Cobertura[];
  observaciones?: string;
  condiciones?: string;
  status?: number;
  nro_version?: string;
}

export interface SolicitudListItem {
  id: number;
  status: number;
  fecha_emision: string;
  nro_version: string;
  solicitante_nombre: string;
  solicitante_email: string;
  tipo_persona: string;
  vehiculo_placa: string;
  vehiculo_marca: string;
  vehiculo_modelo: string;
  vehiculo_anho: number;
}

export interface PaginacionMeta {
  total_registros: number;
  pagina_actual: number;
  tamano_pagina: number;
  total_paginas: number;
  /** El SP devuelve 1 o 0; se normaliza a boolean en la capa API */
  tiene_filtros: boolean;
}

export interface SolicitudesResponse {
  data: SolicitudListItem[];
  meta: PaginacionMeta;
}

export interface CoberturaDB {
  id: number;
  id_solicitud: number;
  tipo_cobertura: string;
  prima: number;
}

export interface OpcionalDB {
  id: number;
  id_solicitud: number;
  prima_gasto: number;
  prima_invalidez: number;
  prima_muerte: number;
}

export interface SolicitudDetalle {
  id: number;
  status: number;
  fecha_emision: string;
  nro_version: string;
  condiciones?: string;
  observaciones?: string;
  // Solicitante
  solicitante_nombre: string;
  solicitante_email: string;
  tipo_persona: string;
  id_intermediario?: number | string;
  nom_intermediario?: string;
  solicitante_id_sucursal?: number;
  solicitante_sucursal_nombre?: string;
  // Vehículo
  marca: string;
  modelo: string;
  marca_nombre?: string;
  modelo_nombre?: string;
  anho: number;
  placa: string;
  nro_puesto: number;
  duracion?: number;
  tipo_exceso?: number;
  tipo_vehiculo?: number;
  tipo_vehiculo_etiqueta?: string;
  tasacion_especial?: number;
  autorizado_nombre?: string;
  autorizado_sucursal?: number;
  autorizado_sucursal_nombre?: string;
  duracion_viaje_nombre?: string;
  tipo_exceso_nombre?: string;
  tipo_vehiculo_nombre?: string;
  tasacion_especial_nombre?: string;
  // Relaciones
  coberturas: CoberturaDB[];
  opcionales: OpcionalDB[];
}

export interface UpdateSolicitudPayload {
  status: number;
  condiciones?: string;
  observaciones?: string;
  solicitante?: Tercero;
  vehiculo?: Vehiculo;
  coberturas?: Cobertura[];
  opcionales?: Cobertura[];
}

// --- Admin: Tasas Opcionales ---
export interface TasaOpcional {
  id: number;
  id_def_termino: number;
  nombre_cobertura: string;
  etiqueta: string;
  tasa: number;
  id_usuario: string | null;
  fe_us_in: string | null;
}

export interface UpdateTasaOpcionalPayload {
  tasa: number;
}

// --- Admin: Primas y Sumas Aseguradas ---
export interface Tarifa {
  id: number;
  tipo_cobertura: string;
  tipo_exceso: number | null;
  tipo_exceso_nombre: string | null;
  id_tasacion_especial: number | null;
  tasacion_especial_nombre: string | null;
  duracion_viaje: number;
  duracion_viaje_nombre: string;
  tipo_transporte: number;
  tipo_transporte_nombre: string;
  prima: number;
  id_usuario: string;
  fe_us_in: string;
}

export interface SumaAsegurada {
  id: number;
  tipo_cobertura: string;
  id_def_termino: number;
  tipo_exceso: number;
  valor: number;
  tipo_beneficiario?: string | null;
  id_usuario: string;
  fe_us_in: string;
}

export interface UpdateTarifaPayload {
  prima: number;
}

export interface UpdateSumaAseguradaPayload {
  valor: number;
}

export interface DefinicionTermino {
  id: number;
  nombre: string;
  etiqueta: string;
}

// --- Estadísticas Dashboard ---
export interface KpiEstadisticas {
  ingresos_mes_actual: number;
  ingresos_mes_anterior: number;
  porcentaje_crecimiento: number;
  total_borradores: number;
  total_emitidas: number;
  tasa_conversion: number;
  ticket_promedio: number;
}
export interface TopVehiculo {
  marca_modelo: string;
  cantidad_cotizaciones: number;
}
export interface DistribucionTransporte {
  tipo_transporte_nombre: string;
  cantidad: number;
  porcentaje: number;
}
export interface RendimientoSucursal {
  sucursal: string;
  borradores: number;
  solicitudes_generadas: number;
}
export interface RendimientoEmpleado {
  nombre_completo: string;
  total_generadas: number;
  total_borradores: number;
  total_procesadas: number;
  tasa_cierre: number;
}
export interface DashboardEstadisticas {
  kpis: KpiEstadisticas;
  top_vehiculos: TopVehiculo[];
  distribucion_transporte: DistribucionTransporte[];
  rendimiento_sucursales: RendimientoSucursal[];
  rendimiento_empleados: RendimientoEmpleado[];
}
export interface MiniPanelEstadisticas {
  top_vehiculos: TopVehiculo[];
  rendimiento_sucursales: RendimientoSucursal[];
}
