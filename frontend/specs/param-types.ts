import type { OperationType } from './api-types'

/**
 * Fecha en formato ISO corto para query params de la API.
 *
 * Formato esperado: YYYY-MM-DD (ejemplo: 2026-07-21).
 */
export type YYYYMMDDString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`

// Query params compartidos por filtros de rango de fechas.
export interface DateRangeFilter {
	/**
	 * Fecha de inicio del filtro (inclusive).
	 *
	 * Valores validos: fecha ISO corta con formato YYYY-MM-DD.
	 * Si no se envia, no se aplica limite inferior al rango.
	 */
	start_date?: YYYYMMDDString
	/**
	 * Fecha de fin del filtro (inclusive).
	 *
	 * Valores validos: fecha ISO corta con formato YYYY-MM-DD.
	 * Si no se envia, no se aplica limite superior al rango.
	 */
	end_date?: YYYYMMDDString
}

// Query params para GET /api/metrics/alerts.
export interface AlertsParams extends DateRangeFilter {
	/**
	 * Umbral de deteccion de anomalias en gasto.
	 *
	 * Valores validos: numero decimal entre 0.01 y 1.0.
	 * Ejemplo: 0.3 equivale a un incremento del 30% sobre la linea base.
	 */
	threshold: number
}

// Query params para GET /api/metrics/categories/top.
export interface TopCategoriesParams extends DateRangeFilter {
	/**
	 * Tipo de operacion financiera a consultar.
	 *
	 * Valores validos: 'income' o 'outcome'.
	 * Para la comparativa B2B vs B2C se usa 'income'.
	 */
	operation_type: OperationType
	/**
	 * Cantidad maxima de categorias a devolver.
	 *
	 * Valores validos segun API backend: entero entre 1 y 20.
	 * En la funcionalidad comparativa se usa 5.
	 */
	limit: number
}
