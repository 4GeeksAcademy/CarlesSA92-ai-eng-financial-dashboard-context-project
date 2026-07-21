# Revision de buenas practicas, malas practicas y riesgos

Fecha: 2026-07-06

## Actualizacion 2026-07-21: skill performance aplicada (Docker build + arranque)

- Objetivo de la auditoria:
	- Explicar por que el build de Docker era lento.
	- Explicar por que el dashboard podia requerir refresco manual tras build/arranque.

- Cambios aplicados:
	- Se agregaron archivos .dockerignore por servicio para reducir contexto de build:
		- [frontend/.dockerignore](../frontend/.dockerignore)
		- [backend/.dockerignore](../backend/.dockerignore)
	- Se mejoro reproducibilidad de dependencias frontend en Docker:
		- [frontend/Dockerfile](../frontend/Dockerfile#L5) (`npm ci` en lugar de `npm install`).
	- Se agrego readiness real entre servicios en Compose:
		- Healthcheck de backend y dependencia condicionada en [docker-compose.yml](../docker-compose.yml#L11) y [docker-compose.yml](../docker-compose.yml#L23).
	- Se agrego resiliencia de carga inicial en frontend con reintentos controlados:
		- [frontend/src/App.tsx](../frontend/src/App.tsx#L16), [frontend/src/App.tsx](../frontend/src/App.tsx#L65), [frontend/src/App.tsx](../frontend/src/App.tsx#L110).
	- Se documento flujo recomendado de ejecucion diaria sin rebuild continuo:
		- [README.md](../README.md#L42)
		- [README.es.md](../README.es.md#L42)

- Evidencia medida (antes/despues):
	- Contexto Docker de frontend:
		- Antes: 63.47 MB transferidos al build.
		- Despues: 8.22 kB transferidos al build.
	- Estado de servicios tras cambios:
		- Backend en estado healthy y frontend arriba en [docker-compose.yml](../docker-compose.yml#L11).
		- Respuesta OK de API y frontend (HTTP 200 en la raiz).
	- Build de aplicacion frontend:
		- Next.js build de produccion validado (compilacion correcta).

- Justificacion de mejora producida:
	- Menor tiempo muerto en ciclo de desarrollo por eliminar transferencia innecesaria de artefactos pesados al contexto Docker.
	- Menos reconstrucciones innecesarias por recomendacion explicita de usar `docker compose up` en trabajo diario y reservar `--build` para cambios de dependencias.
	- Menos falsos errores en la primera carga del dashboard por sincronizar readiness backend/frontend y reintentar fetch inicial ante ventanas cortas de no disponibilidad.
	- Mayor reproducibilidad de imagen frontend al usar `npm ci`, reduciendo variabilidad de instalaciones entre ejecuciones.

## Actualizacion 2026-07-21: skill accessibility aplicada

- Se aplicaron mejoras de accesibilidad en frontend usando la skill `accessibility` (WCAG 2.2):
	- Navegacion por teclado reforzada con skip link y foco visible.
	- Estados dinamicos anunciables para carga y error (`role=\"status\"`, `aria-live`, `role=\"alert\"`).
	- Secciones del dashboard etiquetadas con `aria-labelledby`.
	- Graficos con `role=\"img\"` y `aria-label` descriptivo.
	- Iconos y marcadores visuales decorativos ocultos para lector de pantalla (`aria-hidden=\"true\"`).
	- Semantica de titulos/descripciones en componente base `Card` mejorada a elementos HTML semanticos.

- Evidencias principales:
	- [frontend/src/App.tsx](../frontend/src/App.tsx#L46)
	- [frontend/src/index.css](../frontend/src/index.css#L116)
	- [frontend/src/components/ui/card.tsx](../frontend/src/components/ui/card.tsx#L31)
	- [frontend/src/components/dashboard/income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx#L80)
	- [frontend/src/components/dashboard/profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx#L81)
	- [frontend/src/components/dashboard/kpi-card.tsx](../frontend/src/components/dashboard/kpi-card.tsx#L60)

- Validaciones ejecutadas:
	- Frontend lint: OK.
	- Frontend tests (Vitest): OK (5/5).
	- Contraste de color: verificado en tokens principales (texto y elementos interactivos) con cumplimiento AA en pares criticos evaluados.
	- Auditoria automatica axe: bloqueada en este contenedor por ausencia de binario Chrome; pendiente repetir en entorno con navegador.

## Actualizacion 2026-07-21: skill vercel-react-best-practices aplicada

- Se aplicaron optimizaciones de React/Next.js enfocadas en rendimiento y estabilidad visual:
	- Migracion del frontend a Next.js App Router.
	- Definicion de title y meta description con Metadata API en layout y paginas.
	- Fuente Inter optimizada con next/font (display swap).
	- Carga dinamica de graficos con next/dynamic para reducir JS inicial.
	- Mitigacion de layout shift percibido en KPIs con `tabular-nums` y altura minima estable.
	- Manejo de fetch client con AbortController para evitar actualizaciones tras unmount.
	- Pipeline de estilos en Next restaurado con PostCSS y @tailwindcss/postcss.

- Evidencias principales:
	- [frontend/app/layout.tsx](../frontend/app/layout.tsx)
	- [frontend/app/page.tsx](../frontend/app/page.tsx)
	- [frontend/app/not-found.tsx](../frontend/app/not-found.tsx)
	- [frontend/src/App.tsx](../frontend/src/App.tsx)
	- [frontend/src/components/dashboard/kpi-card.tsx](../frontend/src/components/dashboard/kpi-card.tsx)
	- [frontend/src/index.css](../frontend/src/index.css)
	- [frontend/postcss.config.mjs](../frontend/postcss.config.mjs)
	- [frontend/next.config.ts](../frontend/next.config.ts)

- Validaciones ejecutadas:
	- Frontend build (Next.js): OK.
	- Frontend lint: OK.
	- Frontend runtime en Docker Compose: OK en puerto 5173.

## Actualizacion 2026-07-21: skill financial-format-and-domain-contract aplicada

- Objetivo de la auditoria:
	- Estandarizar formato financiero en una sola politica reutilizable (moneda, porcentaje y fechas de periodo).
	- Eliminar formateo inline en componentes para reducir inconsistencias.
	- Unificar terminologia de negocio e idioma de UI para alinear frontend con contratos del API.

- Cambios aplicados:
	- Centralizacion de politica financiera en utilidades compartidas:
		- Locale y moneda unificados (`en-US`, `USD`).
		- Helper de moneda compacta para ejes de graficos.
		- Helper de porcentaje con precision configurable.
		- Evidencia: [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts)
	- Normalizacion de ejes y tooltips en charts usando helpers compartidos:
		- Eliminado formateo inline de moneda y porcentaje.
		- Evidencia: [frontend/src/components/dashboard/income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx), [frontend/src/components/dashboard/profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx)
	- Consistencia terminologica en KPIs:
		- Textos ajustados a `income/outcome` para alinearse con el dominio ya tipado.
		- Evidencia: [frontend/src/components/dashboard/kpi-row.tsx](../frontend/src/components/dashboard/kpi-row.tsx)
	- Consistencia de idioma en UI:
		- Mensaje de error de carga alineado al idioma principal en ingles.
		- Evidencia: [frontend/src/App.tsx](../frontend/src/App.tsx)
	- Cobertura de pruebas de formato ampliada:
		- Casos para moneda compacta, precision explicita y porcentaje negativo.
		- Evidencia: [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts)

- Validaciones ejecutadas:
	- Frontend lint: OK.
	- Frontend tests (Vitest): OK (7/7).

- Justificacion de mejora producida:
	- Menor riesgo de discrepancias visuales y numericas al existir una unica fuente de verdad para formato financiero.
	- Menor deuda de mantenimiento al remover logica de formateo duplicada en componentes de presentacion.
	- Mayor coherencia funcional al alinear etiquetas y textos de UI con los contratos del dominio (`income/outcome`).
	- Mayor confianza en cambios futuros por cobertura adicional de pruebas en casos limite de formato.

## Resumen rapido

- El proyecto tiene una base solida para aprendizaje y desarrollo local: separacion frontend/backend, tipado en frontend, modelos Pydantic en backend, lint y tests funcionando.
- Los principales riesgos estan en seguridad/configuracion de entorno (CORS abierto + debugpy expuesto), gobernanza de dependencias (versiones no fijadas) y consistencia de arquitectura para escalar (logica y rutas en un solo modulo grande).

## Estado de verificacion ejecutada

- Frontend lint: OK (eslint)
- Frontend tests: OK (vitest, 7/7)
- Backend tests: OK (pytest, 15/15)
- Warning observado en backend tests: deprecacion de TestClient/httpx en stack actual

## 1) Arquitectura

### Buenas practicas

- Separacion clara por capas y servicios: backend en FastAPI y frontend en React+TypeScript.
- Uso de funciones puras para calculos de negocio en frontend (KPIs, agregaciones mensuales), separadas de la UI.
- Contratos tipados en backend (Pydantic) y en frontend (TypeScript), lo cual mejora legibilidad y reduce errores de datos.

### Malas practicas / riesgos

- Riesgo medio: modulo backend muy concentrado en un solo archivo (rutas, modelos, generacion mock y logica de negocio juntos en backend/app/routes.py).
- Riesgo medio: duplicacion de endpoints /api/metrics/b2b y /api/metrics/b2c que podrian resolverse con un filtro unico (business_type) para evitar codigo repetido.
- Riesgo bajo: fuente de datos mock regenerada en cada request. Es valido para demo, pero limita evolucion a entorno productivo o benchmark real.

### Recomendacion

- Separar en modulos: schemas.py, services.py, routers/metrics.py.
- Unificar filtros por business_type en un endpoint parametrizable.
- Preparar interfaz de repositorio (aunque siga mock) para simplificar migracion futura a DB.

### Ejemplos con enlaces

Buenas practicas

1. Separacion de frontend y backend en servicios distintos: [docker-compose.yml](docker-compose.yml#L2) y [docker-compose.yml](docker-compose.yml#L14).
2. Logica de negocio separada de la vista en frontend: [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L21) y consumo desde [frontend/src/App.tsx](frontend/src/App.tsx#L32).
3. Contratos tipados en ambas capas: [backend/app/routes.py](backend/app/routes.py#L22) y [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L5).

Malas practicas / riesgos

1. Concentracion de responsabilidades en un solo modulo backend: [backend/app/routes.py](backend/app/routes.py#L1).
2. Duplicacion de endpoints por tipo de negocio: [backend/app/routes.py](backend/app/routes.py#L362) y [backend/app/routes.py](backend/app/routes.py#L378).
3. Generacion de dataset mock por request en endpoints: [backend/app/routes.py](backend/app/routes.py#L94) y [backend/app/routes.py](backend/app/routes.py#L248).

## 2) Seguridad

### Buenas practicas

- Uso de FastAPI con validacion de entradas via Query y tipos restringidos (Literal), evitando parametros arbitrarios.

### Malas practicas / riesgos

- Riesgo alto: CORS extremadamente permisivo (allow_origins=["*"] con allow_credentials=True) en backend/app/main.py.
- Riesgo alto: debugpy activo por defecto y puerto 5678 publicado en docker-compose, lo que no deberia estar habilitado fuera de entorno de desarrollo.

### Recomendacion

- Configurar CORS por entorno con lista blanca de dominios.
- Deshabilitar debugpy por defecto y habilitarlo solo en perfil dev (por variable de entorno o compose override).

### Ejemplos con enlaces

Buenas practicas

1. Validacion declarativa de parametros con tipos y Query: [backend/app/routes.py](backend/app/routes.py#L10) y [backend/app/routes.py](backend/app/routes.py#L248).

Malas practicas / riesgos

1. CORS demasiado permisivo: [backend/app/main.py](backend/app/main.py#L9) y [backend/app/main.py](backend/app/main.py#L10).
2. Debug remoto habilitado por defecto y expuesto: [backend/Dockerfile](backend/Dockerfile#L12) y [docker-compose.yml](docker-compose.yml#L20).

## 3) Naming y consistencia

### Buenas practicas

- Nombres de funciones descriptivos en backend (summarize_movements, detect_outcome_alerts, calculate_net_value).
- Tipos de dominio explicitos en frontend y backend (OperationType, BusinessType, Category).

### Malas practicas / riesgos

- Riesgo bajo: mezcla de idioma en UI/mensajes (texto en ingles en componentes y mensaje de error en espanol), lo cual afecta consistencia de producto.
- Riesgo bajo: uso del termino outcome (en lugar de expense) puede generar ambiguedad para audiencias no tecnicas.

### Recomendacion

- Definir guia de estilo de naming de dominio e idioma de interfaz (es/en) para todo el proyecto.

### Ejemplos con enlaces

Buenas practicas

1. Nombres de funciones de negocio descriptivos: [backend/app/routes.py](backend/app/routes.py#L161) y [backend/app/routes.py](backend/app/routes.py#L219).
2. Tipos de dominio explicitos y consistentes: [backend/app/routes.py](backend/app/routes.py#L10) y [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L1).

Malas practicas / riesgos

1. Mezcla de idioma en interfaz y mensajes: [frontend/src/components/dashboard/kpi-row.tsx](frontend/src/components/dashboard/kpi-row.tsx#L15) y [frontend/src/App.tsx](frontend/src/App.tsx#L37).
2. Terminologia de dominio potencialmente ambigua para negocio no tecnico: [frontend/src/lib/financial-types.ts](frontend/src/lib/financial-types.ts#L1).

## 4) Testing

### Buenas practicas

- Cobertura basica funcional en backend para endpoints clave y filtros.
- Pruebas unitarias de utilidades financieras en frontend.
- Ejecucion actual sin fallos (frontend + backend).

### Malas practicas / riesgos

- Riesgo medio: faltan tests de componentes React y de integracion UI-API (solo se testean utilidades).
- Riesgo medio: faltan tests de casos negativos en API (rangos de fecha invalidos, combinaciones de filtros conflictivas, limites de negocio).
- Riesgo bajo: warning deprecado en stack de test backend, potencial deuda tecnica a futuro.

### Recomendacion

- Agregar tests de componentes con React Testing Library.
- Agregar tests de contrato para endpoints no cubiertos por escenarios de error.
- Planificar actualizacion de stack de test backend para resolver warning deprecado.

### Ejemplos con enlaces

Buenas practicas

1. Pruebas backend para generacion y orden de datos: [backend/tests/test_routes.py](backend/tests/test_routes.py#L12).
2. Pruebas backend de filtros de endpoint: [backend/tests/test_routes.py](backend/tests/test_routes.py#L36).
3. Pruebas unitarias frontend de calculos y formateadores: [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L35), [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L63) y [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L106).

Malas practicas / riesgos

1. Falta de pruebas de componentes UI (hay pruebas de utilidades, no de render/comportamiento): [frontend/src/lib/financial-utils.test.ts](frontend/src/lib/financial-utils.test.ts#L35) y [frontend/src/App.tsx](frontend/src/App.tsx#L23).
2. Cobertura limitada de casos negativos/validacion de error en API: [backend/tests/test_routes.py](backend/tests/test_routes.py#L36) y [backend/tests/test_routes.py](backend/tests/test_routes.py#L121).
3. Riesgo de deuda por warning deprecado en stack de pruebas (uso de TestClient + httpx): [backend/tests/test_routes.py](backend/tests/test_routes.py#L3) y [backend/requirements.txt](backend/requirements.txt#L6).

## 5) Documentacion

### Buenas practicas

- README en ingles y espanol.
- Instrucciones de arranque local claras con docker compose.

### Malas practicas / riesgos

- Riesgo bajo: README menciona frontend/.env.example pero ese archivo no existe actualmente.
- Riesgo bajo: no hay guia corta de convenciones de codigo del proyecto (naming, estructura de modulos, criterios de testing).

### Recomendacion

- Crear frontend/.env.example o ajustar README para no referenciar archivos inexistentes.
- Agregar una guia CONTRIBUTING.md o seccion de convenciones tecnicas.

### Ejemplos con enlaces

Buenas practicas

1. Documentacion bilingue: [README.md](README.md#L1) y [README.es.md](README.es.md#L1).
2. Arranque local documentado con Docker: [README.md](README.md#L42) y [README.es.md](README.es.md#L42).

Malas practicas / riesgos

1. Referencia a archivo de entorno no presente: [README.md](README.md#L46) y [README.es.md](README.es.md#L46).
2. Falta de convenciones tecnicas explicitadas en README principal: [README.md](README.md#L20).

## 6) DX (Developer Experience)

### Buenas practicas

- Scripts npm utiles (dev, build, lint, test, coverage).
- Alias @ para imports en frontend, mejora mantenibilidad.
- Reglas de TypeScript que ayudan a higiene de codigo (noUnusedLocals, noUnusedParameters).

### Malas practicas / riesgos

- Riesgo medio: dependencias Python sin version fijada en requirements.txt y Pipfile (drift y builds no deterministas).
- Riesgo medio: discrepancia de version de Python entre Pipfile (3.12) y Dockerfile (3.13).
- Riesgo medio: no se observa pipeline CI en repositorio para ejecutar lint/tests automaticamente.

### Recomendacion

- Fijar versiones de dependencias criticas (al menos major+minor).
- Alinear version de Python entre Dockerfile y Pipfile.
- Agregar CI minimo (lint + tests frontend/backend).

### Ejemplos con enlaces

Buenas practicas

1. Scripts de trabajo claros (dev, build, lint, test): [frontend/package.json](frontend/package.json#L7).
2. Alias de imports para mantenibilidad: [frontend/tsconfig.json](frontend/tsconfig.json) y [frontend/next.config.ts](frontend/next.config.ts).
3. Configuracion de calidad estandar en lint y TypeScript: [frontend/eslint.config.js](frontend/eslint.config.js#L13) y [frontend/tsconfig.app.json](frontend/tsconfig.app.json#L22).

Malas practicas / riesgos

1. Dependencias Python sin version fijada: [backend/requirements.txt](backend/requirements.txt#L1) y [backend/Pipfile](backend/Pipfile#L7).
2. Inconsistencia de version de Python entre herramientas: [backend/Pipfile](backend/Pipfile#L17) y [backend/Dockerfile](backend/Dockerfile#L1).
3. Evidencia de flujo de calidad local pero sin trazabilidad de CI en repo: [frontend/package.json](frontend/package.json#L9) y [frontend/package.json](frontend/package.json#L11).

## 7) Performance y escalabilidad

### Buenas practicas

- Uso de agregaciones simples y estructuras en memoria adecuadas para volumen de demo.

### Malas practicas / riesgos

- Riesgo bajo/medio: recrear dataset completo en cada endpoint no escala bien a escenarios reales.
- Riesgo bajo: algunas transformaciones repiten filtrados en memoria que podrian consolidarse para reducir trabajo por request.

### Recomendacion

- Preparar capa de acceso a datos y cache simple para escenarios de mayor volumen.

### Ejemplos con enlaces

Buenas practicas

1. Agregaciones simples y eficientes para volumen de demo: [frontend/src/lib/financial-utils.ts](frontend/src/lib/financial-utils.ts#L39) y [backend/app/routes.py](backend/app/routes.py#L161).

Malas practicas / riesgos

1. Recalculo recurrente de datos base por endpoint: [backend/app/routes.py](backend/app/routes.py#L94) y [backend/app/routes.py](backend/app/routes.py#L248).
2. Cadena de filtrados en memoria repetida entre rutas: [backend/app/routes.py](backend/app/routes.py#L125) y [backend/app/routes.py](backend/app/routes.py#L287).

## Priorizacion sugerida (top 5)

1. Corregir CORS y exposicion de debugpy (seguridad).
2. Fijar y alinear versiones Python/dependencias (estabilidad de entorno).
3. Modularizar backend/app/routes.py (mantenibilidad).
4. Incorporar tests de UI e integracion (confianza de cambios).
5. Corregir documentacion de .env.example (onboarding y DX).

## 8) Set de reglas propuestas (sin implementacion por ahora)

Estas reglas estan orientadas a mitigar riesgos y conservar los patrones que ya aportan valor.

### A. Reglas de arquitectura y modularidad

1. Cada modulo backend debe tener una sola responsabilidad principal.
2. La logica de negocio no debe vivir dentro de handlers HTTP; debe extraerse a funciones/servicios testeables.
3. Los contratos de entrada/salida deben definirse con modelos tipados (Pydantic/TypeScript) y mantenerse alineados entre frontend y backend.
4. Se debe evitar duplicar endpoints equivalentes cuando un filtro parametrico resuelva el mismo caso.
5. Cualquier nueva funcionalidad debe añadir su ruta, modelo y logica en archivos separados cuando el crecimiento del modulo lo justifique.

### B. Reglas de seguridad por entorno

1. CORS no puede quedar abierto en entornos distintos a desarrollo local.
2. allow_credentials=true solo se permite con lista explicita de origins confiables.
3. Debug remoto (debugpy u otros) debe estar desactivado por defecto y habilitarse solo mediante variable de entorno en perfil dev.
4. No se deben exponer puertos de depuracion en compose de uso general si no hay necesidad activa.
5. Las decisiones de seguridad por entorno deben documentarse en README o archivo de convenciones.

### C. Reglas de dependencias y reproducibilidad

1. Las dependencias Python y Node deben fijar version (al menos major+minor) para evitar drift.
2. La version de Python declarada en herramientas de entorno (Pipfile, Dockerfile, CI) debe ser unica y consistente.
3. Toda actualizacion de dependencias debe venir con validacion minima de lint y tests.
4. No se deben mezclar estrategias de gestion de dependencias sin una regla explicita (por ejemplo, requirements + Pipfile) sin definir fuente de verdad.
5. Se recomienda bloquear versiones en un archivo principal y derivar artefactos secundarios desde ese origen.

### D. Reglas de testing y calidad

1. Todo endpoint nuevo debe incluir al menos un test de caso feliz y uno de caso invalido.
2. Toda funcion de transformacion/calculo de negocio debe tener test unitario.
3. Cada flujo de UI critico debe tener test de componente o integracion (render + datos + estado de error).
4. Los warnings de deprecacion en herramientas de test deben tratarse como deuda tecnica priorizable.
5. El estado minimo de calidad para merge debe ser: lint OK + tests frontend OK + tests backend OK.

### E. Reglas de naming y consistencia funcional

1. Se debe definir un idioma principal para UI y mensajes de error (es o en) y aplicarlo de forma consistente.
2. Los terminos de dominio deben estar normalizados en un glosario breve (por ejemplo: income/outcome vs revenue/expense).
3. Los nombres de funciones deben describir intencion y resultado, evitando abreviaturas ambiguas.
4. Se debe respetar un estilo unico de nombres para tipos y campos entre capas cuando representen la misma entidad.

### F. Reglas de documentacion y DX

1. No debe documentarse un archivo/comando inexistente; README debe reflejar el estado real del repo.
2. Cada variable de entorno usada por el proyecto debe estar documentada en un ejemplo de entorno.
3. El proyecto debe contar con una guia corta de contribucion que incluya estructura de modulos, testing y reglas de calidad.
4. Scripts de desarrollo (lint/test/build) deben mantenerse simples, ejecutables y coherentes con CI.
5. Toda decision tecnica relevante (seguridad, arquitectura, datos mock vs reales) debe dejar trazabilidad en documentacion.

### G. Reglas de preservacion de patrones utiles

1. Mantener la separacion entre logica de negocio y componentes de presentacion en frontend.
2. Mantener funciones puras para agregaciones/calculos financieros y priorizar su testeo aislado.
3. Mantener tipado estricto en frontend y validacion declarativa en backend para reducir errores de contrato.
4. Mantener componentes base reutilizables de UI para consistencia visual y menor duplicacion.
5. Mantener pruebas deterministas cuando se usen datos mock (semillas controladas o fixtures estables).

### H. Criterio de adopcion gradual

1. Estas reglas son de referencia inmediata y no implican implementacion automatica en esta etapa.
2. Se recomienda aplicarlas por fases: seguridad y reproducibilidad primero, luego modularidad y cobertura de tests.
3. Cualquier excepcion debe registrarse con fecha, motivo y alcance.
