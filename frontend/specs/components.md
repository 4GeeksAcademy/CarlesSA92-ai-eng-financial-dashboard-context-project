# Especificaciones de Nuevos Componentes del Dashboard

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Objetivo
Permitir que el usuario filtre todos los datos visibles del dashboard principal por un rango de fechas opcional (`start_date`, `end_date`) en formato `YYYY-MM-DD`, mostrando ademas el rango minimo y maximo disponible del dataset como referencia.

### Alcance
Incluido:
- Inputs de fecha (inicio y fin) en la parte superior del dashboard principal.
- Consulta de rango disponible via `GET /api/metrics/facets`.
- Aplicacion del filtro de fechas a todos los datos actuales del dashboard principal (KPIs y graficos existentes).
- Envio de parametros `start_date` y `end_date` solo cuando tengan valor.
- Estado visual de carga y error para la carga de facetas y metricas filtradas.

Excluido:
- Cambios de estilo global fuera del dashboard.
- Persistencia del filtro en URL, localStorage o backend.
- Cambios de agrupacion temporal (`day`, `week`, `month`) no solicitados.

### Restricciones
- Formato de fecha obligatorio para API: `YYYY-MM-DD`.
- Ambos campos son opcionales e independientes.
- Si `start_date` y `end_date` estan vacios, se debe cargar data completa sin filtros de fecha.
- Si `start_date > end_date`, no se debe disparar request; se muestra error de validacion en UI.
- El rango valido mostrado al usuario debe provenir de `GET /api/metrics/facets` (`min_date`, `max_date`), no de valores hardcodeados.
- Mantener separacion entre logica de datos y presentacion (calculo/transformacion fuera de componentes visuales).

### Contexto
- El dashboard actual consume `GET /api/metrics` y calcula KPIs/series en frontend.
- El backend ya soporta `start_date` y `end_date` en endpoints de metricas.
- El endpoint `GET /api/metrics/facets` devuelve `min_date` y `max_date` para acotar entradas validas.
- La UI actual usa React + TypeScript + componentes del directorio `components/dashboard`.

### Componentes a implementar

#### 1) `DateRangeFilter`
Responsabilidad: capturar y validar el rango de fechas, mostrar el rango disponible de referencia, y notificar cambios al contenedor.

Props:
```ts
export interface DateRangeFilterProps {
	value: {
		startDate: string | null
		endDate: string | null
	}
	availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null
	loading?: boolean
	disabled?: boolean
	validationError?: string | null
	onChange: (next: { startDate: string | null; endDate: string | null }) => void
	onClear: () => void
}
```

Renderizado condicional:
- Si `loading === true`, mostrar skeleton para inputs y rango.
- Si `availableRange === null` y no hay error, mostrar texto de ayuda "Rango disponible no cargado".
- Si existe `validationError`, renderizar mensaje inline bajo los inputs.
- Si ambos valores son `null`, el estado visual debe indicar "Sin filtro" (badge o texto).

#### 2) `DashboardDateRangeSection`
Responsabilidad: componer encabezado + filtro + mensaje de error de consulta de facetas.

Props:
```ts
export interface DashboardDateRangeSectionProps {
	periodLabel: string
	dateFilter: {
		startDate: string | null
		endDate: string | null
	}
	availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null
	facetsLoading: boolean
	facetsError: string | null
	validationError: string | null
	onDateFilterChange: (next: { startDate: string | null; endDate: string | null }) => void
	onClearDateFilter: () => void
}
```

Renderizado condicional:
- Si `facetsError` tiene valor, mostrar alerta no bloqueante y mantener inputs habilitados.
- Si `facetsLoading`, deshabilitar interaccion del filtro hasta obtener rango.

### Criterios de aceptacion
1. Con ambos inputs vacios, se realiza carga de dashboard sin `start_date` ni `end_date`.
2. Al definir solo inicio, la API recibe exclusivamente `start_date`.
3. Al definir solo fin, la API recibe exclusivamente `end_date`.
4. Al definir ambos, la API recibe ambos y toda la pantalla (KPIs y graficos) refleja el filtro.
5. Si `start_date > end_date`, se muestra validacion y no se actualiza la consulta.
6. Se muestra en UI el rango valido (`min_date` y `max_date`) obtenido de `GET /api/metrics/facets`.
7. Existe accion para limpiar filtros y volver al estado sin rango.

---

## Funcionalidad 2: Tabla de alertas de anomalias en dashboard principal

### Objetivo
Agregar una tabla debajo de los graficos actuales que destaque periodos con incremento inesperado de gasto (`outcome`) usando un umbral configurable por el usuario, respetando el rango de fechas activo.

### Alcance
Incluido:
- Input numerico para umbral (`threshold`) con rango permitido `0.01` a `1.0` y valor por defecto `0.3`.
- Consulta de alertas con `GET /api/metrics/alerts?threshold=<ratio>` y filtros de fecha activos.
- Tabla con 4 columnas: periodo, outcome registrado, media movil de los 3 periodos anteriores, incremento porcentual.
- Estado vacio explicito cuando no existan anomalias para el umbral actual.

Excluido:
- Configuracion persistente del umbral entre sesiones.
- Exportacion CSV/PDF.
- Edicion manual de alertas.

### Restricciones
- `threshold` debe validarse en frontend y backend como numero decimal en `[0.01, 1.0]`.
- Debe respetar el rango de fechas activo de la Funcionalidad 1 (`start_date`, `end_date`).
- La tabla no se oculta cuando no hay resultados; se muestra estado vacio explicito.
- Mostrar incremento porcentual como porcentaje legible (`increase_ratio * 100` con 1-2 decimales).
- Para mostrar "media movil de 3 periodos anteriores", usar el valor entregado por API (`baseline_average`) y etiquetarlo claramente en UI.

### Contexto
- El backend expone `GET /api/metrics/alerts` con `threshold`, `group_by`, `start_date`, `end_date` y opcional `business_type`.
- Respuesta actual: `period`, `outcome_total`, `baseline_average`, `increase_ratio`.
- La pantalla principal ya contiene KPIs y dos graficos; esta tabla se agrega debajo de esa seccion.

### Componentes a implementar

#### 1) `AlertsThresholdControl`
Responsabilidad: editar y validar umbral, con debounce o apply explicito para evitar requests excesivos.

Props:
```ts
export interface AlertsThresholdControlProps {
	value: number
	min?: number // default 0.01
	max?: number // default 1.0
	step?: number // default 0.01
	disabled?: boolean
	validationError?: string | null
	onChange: (next: number) => void
}
```

Renderizado condicional:
- Si `disabled`, input no editable.
- Si `validationError`, mostrar mensaje inline y no propagar valor invalido.

#### 2) `OutcomeAlertsTable`
Responsabilidad: mostrar alertas de anomalias y estado vacio.

Props:
```ts
// AlertEntry viene de specs/api-types.ts y conserva el contrato API (snake_case).
// Si la UI requiere camelCase, la transformacion se hace en la capa de adaptacion, no en el contrato.

export interface OutcomeAlertsTableProps {
	rows: AlertEntry[]
	loading?: boolean
	error?: string | null
	emptyMessage?: string
}
```

Renderizado condicional:
- Si `loading`, mostrar skeleton de tabla.
- Si `error`, mostrar alerta de error y mantener estructura de contenedor.
- Si `rows.length === 0` y sin error, mostrar `emptyMessage` (por defecto: "No se detectaron anomalias para el umbral actual.").
- Si hay filas, renderizar tabla completa con 4 columnas obligatorias.

#### 3) `DashboardAlertsSection`
Responsabilidad: coordinar threshold + fetch + tabla, reutilizando filtro de fecha global.

Props:
```ts
export interface DashboardAlertsSectionProps {
	threshold: number
	dateFilter: {
		startDate: string | null
		endDate: string | null
	}
	onThresholdChange: (next: number) => void
}
```

### Criterios de aceptacion
1. El umbral inicial visible es `0.3`.
2. No se permite introducir valores fuera de `[0.01, 1.0]`.
3. Cada cambio valido de umbral dispara consulta de alertas con el nuevo `threshold`.
4. Si hay rango de fechas activo, la consulta incluye `start_date` y/o `end_date`.
5. La tabla siempre renderiza uno de estos estados: `loading`, `error`, `vacia`, `con datos`.
6. Con datos, las 4 columnas requeridas aparecen en el orden solicitado.
7. Si no hay anomalias, se muestra mensaje explicito y comprobable de estado vacio.

---

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Objetivo
Crear una nueva pagina del dashboard que compare ingresos entre B2B y B2C con dos tablas laterales de top categorias (top 5 por grupo) y un grafico unico inferior con total de ingresos B2B vs B2C, filtrable por rango de fechas.

### Alcance
Incluido:
- Nueva ruta/pagina de comparativa separada del dashboard principal.
- Filtro de fechas reutilizable (mismo formato `YYYY-MM-DD`).
- Dos secciones paralelas: una para B2B y otra para B2C.
- Cada seccion muestra top 5 categorias de ingreso de su grupo con: categoria, total y % sobre total del grupo.
- Grafico comparativo unico bajo ambas tablas con total ingresos B2B vs B2C.
- Obtencion de categorias disponibles desde `GET /api/metrics/facets` para validacion/consistencia.

Excluido:
- Comparativa de outcome o profit.
- Drill-down por categoria.
- Comparacion de mas de dos grupos de negocio.

### Restricciones
- Endpoint principal de tabla por grupo: `GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=<B2B|B2C>`.
- Aplicar `start_date` y `end_date` en ambas consultas de top categorias y en la fuente del grafico total.
- El porcentaje por fila se calcula como: `total_categoria / suma_top5_grupo * 100` (si suma es 0, mostrar `0%`).
- Las dos tablas deben mantener misma estructura y orden para comparacion visual.
- La pagina debe manejar estados independientes de carga/error por bloque (B2B, B2C, grafico).

### Contexto
- El backend ya soporta filtros por `business_type` y fechas en endpoints de resumen/categorias.
- `GET /api/metrics/facets` devuelve `business_types` y `categories` disponibles.
- En frontend actual no existe router declarado; la especificacion debe contemplar agregar una nueva vista y mecanismo de navegacion minimo.

### Componentes a implementar

#### 1) `BusinessComparisonPage`
Responsabilidad: contenedor de la vista, coordinacion de filtros, carga de datos B2B/B2C y composicion general.

Props:
```ts
export interface BusinessComparisonPageProps {
	initialStartDate?: string | null
	initialEndDate?: string | null
}
```

Renderizado condicional:
- Si falla la carga de facetas iniciales, mostrar alerta superior y mantener pagina operable con fallback.
- Si no hay datos de ambos grupos, mostrar estado vacio global en la zona de contenido.

#### 2) `BusinessTopIncomeTable`
Responsabilidad: tabla reutilizable para B2B y B2C.

Props:
```ts
// CategoryEntry y TopCategoriesResponse vienen de specs/api-types.ts.
// percentageOfGroup es valor derivado en UI a partir de total_amount.

export interface BusinessTopIncomeTableProps {
	businessType: 'B2B' | 'B2C'
	rows: TopCategoriesResponse
	totalIncome: number
	loading?: boolean
	error?: string | null
}
```

Renderizado condicional:
- Si `loading`, skeleton de tabla.
- Si `error`, mensaje de error contextual (ej. "No se pudo cargar B2B").
- Si `rows.length === 0`, estado vacio explicito para el grupo.
- Si hay filas, renderizar 5 filas maximo con columnas: categoria, total ingresos, % sobre total grupo.

#### 3) `B2BvsB2CIncomeBarChart`
Responsabilidad: comparar visualmente total de ingresos B2B vs B2C en un unico grafico.

Props:
```ts
export interface B2BvsB2CIncomeBarChartProps {
	values: {
		b2bIncomeTotal: number
		b2cIncomeTotal: number
	}
	loading?: boolean
	error?: string | null
}
```

Renderizado condicional:
- Si `loading`, skeleton de grafico.
- Si `error`, mensaje de error y contenedor reservado.
- Si ambos totales son 0, estado vacio explicito (no ocultar bloque).

#### 4) `ComparisonDateRangeFilter`
Responsabilidad: control de fechas para la vista comparativa.

Props:
```ts
export interface ComparisonDateRangeFilterProps {
	value: {
		startDate: string | null
		endDate: string | null
	}
	availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null
	loading?: boolean
	onChange: (next: { startDate: string | null; endDate: string | null }) => void
	onClear: () => void
}
```

Renderizado condicional:
- Mismas reglas de validacion de rango que la Funcionalidad 1.
- Si el rango ingresado es invalido, bloquear refetch y mostrar mensaje.

### Criterios de aceptacion
1. Existe una nueva vista accesible dentro del dashboard para comparativa B2B vs B2C.
2. La vista muestra dos tablas paralelas, una por grupo, cada una con maximo 5 categorias de ingreso.
3. Cada fila incluye categoria, total y porcentaje sobre el total del grupo.
4. Debajo de ambas tablas se muestra un unico grafico con total B2B vs total B2C.
5. El filtro de fechas aplica en ambos grupos y en el grafico.
6. Las categorias disponibles se obtienen desde `GET /api/metrics/facets` y se usan como referencia valida.
7. Cada bloque (tabla B2B, tabla B2C, grafico) tiene estados de `loading`, `error` y `empty` verificables.
