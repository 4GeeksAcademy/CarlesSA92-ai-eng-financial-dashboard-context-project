# Revision de buenas practicas, malas practicas y riesgos

Fecha: 2026-07-06

## Resumen rapido

- El proyecto tiene una base solida para aprendizaje y desarrollo local: separacion frontend/backend, tipado en frontend, modelos Pydantic en backend, lint y tests funcionando.
- Los principales riesgos estan en seguridad/configuracion de entorno (CORS abierto + debugpy expuesto), gobernanza de dependencias (versiones no fijadas) y consistencia de arquitectura para escalar (logica y rutas en un solo modulo grande).

## Estado de verificacion ejecutada

- Frontend lint: OK (eslint)
- Frontend tests: OK (vitest, 5/5)
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

## 2) Seguridad

### Buenas practicas

- Uso de FastAPI con validacion de entradas via Query y tipos restringidos (Literal), evitando parametros arbitrarios.

### Malas practicas / riesgos

- Riesgo alto: CORS extremadamente permisivo (allow_origins=["*"] con allow_credentials=True) en backend/app/main.py.
- Riesgo alto: debugpy activo por defecto y puerto 5678 publicado en docker-compose, lo que no deberia estar habilitado fuera de entorno de desarrollo.

### Recomendacion

- Configurar CORS por entorno con lista blanca de dominios.
- Deshabilitar debugpy por defecto y habilitarlo solo en perfil dev (por variable de entorno o compose override).

## 3) Naming y consistencia

### Buenas practicas

- Nombres de funciones descriptivos en backend (summarize_movements, detect_outcome_alerts, calculate_net_value).
- Tipos de dominio explicitos en frontend y backend (OperationType, BusinessType, Category).

### Malas practicas / riesgos

- Riesgo bajo: mezcla de idioma en UI/mensajes (texto en ingles en componentes y mensaje de error en espanol), lo cual afecta consistencia de producto.
- Riesgo bajo: uso del termino outcome (en lugar de expense) puede generar ambiguedad para audiencias no tecnicas.

### Recomendacion

- Definir guia de estilo de naming de dominio e idioma de interfaz (es/en) para todo el proyecto.

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

## 7) Performance y escalabilidad

### Buenas practicas

- Uso de agregaciones simples y estructuras en memoria adecuadas para volumen de demo.

### Malas practicas / riesgos

- Riesgo bajo/medio: recrear dataset completo en cada endpoint no escala bien a escenarios reales.
- Riesgo bajo: algunas transformaciones repiten filtrados en memoria que podrian consolidarse para reducir trabajo por request.

### Recomendacion

- Preparar capa de acceso a datos y cache simple para escenarios de mayor volumen.

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
