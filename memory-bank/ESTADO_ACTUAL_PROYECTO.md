# Estado actual del proyecto y repositorio

Fecha de corte: 2026-07-07
Fuente base: [memory-bank/PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md), [memory-bank/REVISION_PROYECTO.md](REVISION_PROYECTO.md), [memory-bank/STACK_TECNOLOGICO.md](STACK_TECNOLOGICO.md), reglas en [.agents/rules](../.agents/rules/01-arquitectura-modularidad.md).

Este documento funciona como tablero operativo con checks para ir marcando avances reales.

## 1) Features implementadas (estado actual)

### 1.1 Frontend

- [x] Dashboard financiero con layout principal y secciones KPI + gráficos: [frontend/src/App.tsx](../frontend/src/App.tsx#L45)
- [x] Fila de KPIs (Total Income, Total Outcome, Profit, Profit Margin): [frontend/src/components/dashboard/kpi-row.tsx](../frontend/src/components/dashboard/kpi-row.tsx#L11)
- [x] Gráfico Income vs Outcome: [frontend/src/components/dashboard/income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx#L45)
- [x] Gráfico Profit Margin %: [frontend/src/components/dashboard/profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx#L45)
- [x] Estados de carga con skeletons en KPIs y charts: [frontend/src/components/dashboard/kpi-card.tsx](../frontend/src/components/dashboard/kpi-card.tsx#L35)
- [x] Consumo API desde frontend (endpoint /api/metrics): [frontend/src/App.tsx](../frontend/src/App.tsx#L16)
- [x] Cálculo de KPIs y agregación mensual en utilidades puras: [frontend/src/lib/financial-utils.ts](../frontend/src/lib/financial-utils.ts#L21)

### 1.2 Backend

- [x] API FastAPI inicializada y enrutador montado: [backend/app/main.py](../backend/app/main.py#L6)
- [x] Endpoint health: [backend/app/routes.py](../backend/app/routes.py#L243)
- [x] Endpoint base de métricas con filtros: [backend/app/routes.py](../backend/app/routes.py#L248)
- [x] Endpoint de facets para filtros: [backend/app/routes.py](../backend/app/routes.py#L262)
- [x] Endpoint summary por periodo: [backend/app/routes.py](../backend/app/routes.py#L268)
- [x] Endpoint top categories: [backend/app/routes.py](../backend/app/routes.py#L287)
- [x] Endpoint comparison entre periodos: [backend/app/routes.py](../backend/app/routes.py#L305)
- [x] Endpoint alerts de outcome: [backend/app/routes.py](../backend/app/routes.py#L342)
- [x] Endpoints por segmento B2B/B2C: [backend/app/routes.py](../backend/app/routes.py#L362), [backend/app/routes.py](../backend/app/routes.py#L378)
- [x] Generación de datos mock determinista (seed=42): [backend/app/routes.py](../backend/app/routes.py#L94)

### 1.3 Infraestructura y tooling

- [x] Orquestación con Docker Compose (frontend + backend): [docker-compose.yml](../docker-compose.yml#L2)
- [x] Vite proxy de /api hacia backend: [frontend/vite.config.ts](../frontend/vite.config.ts#L12)
- [x] Scripts de desarrollo, build, lint y test en frontend: [frontend/package.json](../frontend/package.json#L7)
- [x] Reglas de agentes definidas en .agents/rules: [.agents/rules/01-arquitectura-modularidad.md](../.agents/rules/01-arquitectura-modularidad.md#L1)

### 1.4 Calidad y pruebas

- [x] Tests backend sobre rutas y filtros: [backend/tests/test_routes.py](../backend/tests/test_routes.py#L12)
- [x] Tests frontend de utilidades financieras: [frontend/src/lib/financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts#L35)
- [x] Lint configurado para frontend: [frontend/eslint.config.js](../frontend/eslint.config.js#L8)

## 2) Gaps conocidos (pendientes)

### 2.1 Seguridad

- [ ] CORS restringido por entorno (actualmente permisivo): [backend/app/main.py](../backend/app/main.py#L9)
- [ ] Debug remoto deshabilitado por defecto en configuración general: [backend/Dockerfile](../backend/Dockerfile#L12), [docker-compose.yml](../docker-compose.yml#L20)

### 2.2 Arquitectura

- [ ] Modularizar backend/app/routes.py (separar rutas, modelos y lógica): [backend/app/routes.py](../backend/app/routes.py#L1)
- [ ] Reducir duplicación de rutas b2b/b2c mediante filtro parametrizable: [backend/app/routes.py](../backend/app/routes.py#L362)

### 2.3 Testing

- [ ] Añadir tests de componentes React (App, KPIRow, charts): [frontend/src/App.tsx](../frontend/src/App.tsx#L23)
- [ ] Añadir tests de escenarios inválidos 4xx/422 en backend: [backend/tests/test_routes.py](../backend/tests/test_routes.py#L1)
- [ ] Resolver warning de deprecación asociado a stack de test backend (httpx/testclient): [backend/requirements.txt](../backend/requirements.txt#L6)

### 2.4 Dependencias y reproducibilidad

- [ ] Fijar versiones explícitas en dependencias Python (sin wildcard): [backend/requirements.txt](../backend/requirements.txt#L1), [backend/Pipfile](../backend/Pipfile#L7)
- [ ] Unificar versión de Python entre Dockerfile y Pipfile: [backend/Dockerfile](../backend/Dockerfile#L1), [backend/Pipfile](../backend/Pipfile#L17)

### 2.5 Documentación y DX

- [ ] Corregir referencia a frontend/.env.example inexistente o crear archivo: [README.md](../README.md#L46)
- [ ] Definir guía de contribución técnica (convenciones, calidad, flujo): [memory-bank/REVISION_PROYECTO.md](REVISION_PROYECTO.md#L149)
- [ ] Definir idioma principal de UI y glosario de dominio: [memory-bank/REVISION_PROYECTO.md](REVISION_PROYECTO.md#L95)

### 2.6 Producto/uso funcional

- [ ] Integrar en frontend endpoints ya disponibles en backend (facets, summary, top, comparison, alerts) o retirar alcance no usado: [memory-bank/PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md#L248)

## 3) Prioridades a resolver (checklist activable)

## P0 - Alto impacto / alta urgencia

- [ ] P0.1 Endurecer CORS por entorno y credenciales
- [ ] P0.2 Quitar exposición de debugpy fuera de perfil dev
- [ ] P0.3 Definir y aplicar estrategia de dependencias reproducibles en backend

## P1 - Estabilidad técnica

- [ ] P1.1 Alinear versión de Python entre Docker y gestor de dependencias
- [ ] P1.2 Añadir pruebas de error para endpoints críticos
- [ ] P1.3 Resolver warning de deprecación en pruebas backend

## P2 - Mantenibilidad y escalabilidad

- [ ] P2.1 Dividir backend/app/routes.py por responsabilidades
- [ ] P2.2 Unificar variantes b2b/b2c con filtro de negocio
- [ ] P2.3 Definir capa de datos para evolucionar más allá de mock

## P3 - DX y gobernanza

- [ ] P3.1 Corregir README con referencia real de entorno
- [ ] P3.2 Documentar convenciones de naming e idioma
- [ ] P3.3 Definir checklist de merge: lint + tests frontend + tests backend

## 4) Estado de adopción de reglas (.agents/rules)

### Arquitectura y modularidad

- [x] Regla definida: [.agents/rules/01-arquitectura-modularidad.md](../.agents/rules/01-arquitectura-modularidad.md#L1)
- [ ] Cumplimiento completo en código actual

### Seguridad por entorno

- [x] Regla definida: [.agents/rules/02-seguridad-entornos.md](../.agents/rules/02-seguridad-entornos.md#L1)
- [ ] Cumplimiento completo en código actual

### Dependencias y reproducibilidad

- [x] Regla definida: [.agents/rules/03-dependencias-reproducibilidad.md](../.agents/rules/03-dependencias-reproducibilidad.md#L1)
- [ ] Cumplimiento completo en código actual

### Testing y calidad

- [x] Regla definida: [.agents/rules/04-testing-calidad.md](../.agents/rules/04-testing-calidad.md#L1)
- [ ] Cumplimiento completo en código actual

### Naming y consistencia

- [x] Regla definida: [.agents/rules/05-naming-consistencia.md](../.agents/rules/05-naming-consistencia.md#L1)
- [ ] Cumplimiento completo en código actual

### Documentación y DX

- [x] Regla definida: [.agents/rules/06-documentacion-dx.md](../.agents/rules/06-documentacion-dx.md#L1)
- [ ] Cumplimiento completo en código actual

### Preservación de patrones útiles

- [x] Regla definida: [.agents/rules/07-preservacion-patrones-utiles.md](../.agents/rules/07-preservacion-patrones-utiles.md#L1)
- [ ] Cumplimiento completo en código actual

### Adopción gradual y excepciones

- [x] Regla definida: [.agents/rules/08-adopcion-gradual-y-excepciones.md](../.agents/rules/08-adopcion-gradual-y-excepciones.md#L1)
- [ ] Registro de excepciones activo y mantenido

## 5) Registro de avance (actualizable)

- [ ] Sprint/iteración actual iniciada
- [ ] P0 completado
- [ ] P1 completado
- [ ] P2 completado
- [ ] P3 completado
- [ ] Revisión de estado actualizada con nueva fecha de corte
