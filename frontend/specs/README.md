# Frontend Specs: Funcionalidades del Dashboard

## Estado de verificacion de endpoints

Validado contra OpenAPI del backend local (ruta /docs y /openapi.json) el 2026-07-21.

Rutas confirmadas:
- /api/metrics/facets
- /api/metrics
- /api/metrics/alerts
- /api/metrics/categories/top

Nota de consistencia funcional:
- En producto se exige threshold entre 0.01 y 1.0.
- En OpenAPI actual de backend, threshold permite minimo 0.0.
- La UI debe aplicar validacion estricta de producto (0.01 a 1.0) aunque el backend acepte 0.0.

---

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Endpoints consumidos
- GET /api/metrics/facets
	- Uso: obtener min_date y max_date del dataset para referencia visual.
- GET /api/metrics
	- Uso: obtener datos financieros filtrados por start_date y end_date cuando corresponda.

### Tipos TypeScript usados

Request params:
- DateRangeFilter (archivo specs/param-types.ts)
	- start_date?: YYYYMMDDString
	- end_date?: YYYYMMDDString

Response:
- FacetsResponse (archivo specs/api-types.ts)
	- operation_types: OperationType[]
	- business_types: BusinessType[]
	- categories: Category[]
	- min_date: string
	- max_date: string

### Parametros validos y restricciones
- start_date
	- Formato: YYYY-MM-DD
	- Tipo: string opcional
	- Regla UI: fecha inicial inclusiva.
- end_date
	- Formato: YYYY-MM-DD
	- Tipo: string opcional
	- Regla UI: fecha final inclusiva.
- Regla de rango
	- Si start_date > end_date, bloquear request y mostrar validacion.
- Regla de omision
	- Si un parametro esta vacio, no se envia en query string.

### Edge cases y comportamiento esperado de UI
1. Ambos campos vacios
	 - Comportamiento: cargar dashboard completo sin filtros de fecha.
	 - UI: estado Sin filtro visible.
2. start_date mayor que end_date
	 - Comportamiento: no ejecutar fetch de metricas.
	 - UI: mensaje de error inline bajo el filtro.
3. Facets no disponible temporalmente
	 - Comportamiento: mostrar error no bloqueante y permitir reintento.
	 - UI: aviso de fallo al cargar rango disponible.

---

## Funcionalidad 2: Tabla de alertas de anomalias

### Endpoints consumidos
- GET /api/metrics/alerts
	- Uso: obtener periodos con incrementos de gasto anomalo.
	- Query soportada: threshold, start_date, end_date.

### Tipos TypeScript usados

Request params:
- AlertsParams (archivo specs/param-types.ts)
	- threshold: number
	- start_date?: YYYYMMDDString
	- end_date?: YYYYMMDDString

Response:
- AlertsResponse (archivo specs/api-types.ts)
	- Alias de AlertEntry[]
- AlertEntry (archivo specs/api-types.ts)
	- period: string
	- outcome_total: number
	- baseline_average: number
	- increase_ratio: number

### Parametros validos y restricciones
- threshold
	- Tipo: number
	- Restriccion de producto UI: 0.01 a 1.0
	- Valor por defecto funcional: 0.3
	- Semantica: ratio de incremento, por ejemplo 0.3 = 30%.
- start_date, end_date
	- Mismas reglas de DateRangeFilter.
- Consistencia adicional
	- La tabla siempre debe renderizar un estado, aunque no existan filas.

### Edge cases y comportamiento esperado de UI
1. threshold fuera de rango (ejemplo -0.2 o 1.7)
	 - Comportamiento: no lanzar request de alertas.
	 - UI: mostrar error de validacion del input y conservar ultimo estado valido.
2. Respuesta vacia de alertas
	 - Comportamiento: no ocultar modulo.
	 - UI: estado vacio explicito indicando que no hay anomalias para el umbral actual.
3. Filtro de fechas activo sin datos
	 - Comportamiento: consulta valida, respuesta posiblemente vacia.
	 - UI: mantener columnas y mostrar estado vacio en lugar de desaparecer.

---

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Endpoints consumidos
- GET /api/metrics/facets
	- Uso: obtener categorias y rango de fechas valido de referencia.
- GET /api/metrics/categories/top
	- Uso: obtener top categorias por grupo de negocio para income.
	- Llamadas esperadas:
		- business_type=B2B
		- business_type=B2C
	- Query soportada: operation_type, limit, start_date, end_date, business_type.

### Tipos TypeScript usados

Request params:
- TopCategoriesParams (archivo specs/param-types.ts)
	- operation_type: OperationType
	- limit: number
	- start_date?: YYYYMMDDString
	- end_date?: YYYYMMDDString
- DateRangeFilter (archivo specs/param-types.ts)
	- Compartido para el control de fechas de la vista comparativa.

Response:
- TopCategoriesResponse (archivo specs/api-types.ts)
	- Alias de CategoryEntry[]
- CategoryEntry (archivo specs/api-types.ts)
	- category: Category
	- operation_type: OperationType
	- total_amount: number
- FacetsResponse (archivo specs/api-types.ts)
	- Para rango valido y categorias disponibles.

### Parametros validos y restricciones
- operation_type
	- Valores validos: income, outcome.
	- Regla de funcionalidad: para esta vista se usa income.
- limit
	- Restriccion segun OpenAPI: entero entre 1 y 20.
	- Regla de funcionalidad: usar 5.
- start_date, end_date
	- Formato YYYY-MM-DD, opcionales.
	- Si invalidos entre si, bloquear refetch y mostrar error.

### Edge cases y comportamiento esperado de UI
1. Un grupo responde con error y el otro con datos
	 - Comportamiento: mantener render parcial.
	 - UI: tabla del grupo con error muestra alerta contextual; la otra tabla y el grafico siguen visibles con la data disponible.
2. Ambos grupos devuelven lista vacia
	 - Comportamiento: mantener layout de comparativa.
	 - UI: estado vacio en ambas tablas y estado vacio global para el grafico.
3. limit fuera de rango al construir query
	 - Comportamiento: normalizar en cliente a 5 o bloquear request invalida.
	 - UI: no romper pantalla; mostrar mensaje de validacion si aplica.
