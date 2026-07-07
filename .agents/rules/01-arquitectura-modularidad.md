# Regla: Arquitectura y modularidad

## Nombre
Arquitectura modular con responsabilidad única

## Alcance
- Aplica a: backend/**/*.py, frontend/src/**/*.{ts,tsx}
- Etapa: diseño, implementación y refactor
- Responsable: cualquier persona que agregue endpoints, servicios o lógica de negocio

## Razon
Reduce acoplamiento, evita archivos monolíticos y facilita pruebas, mantenimiento y escalabilidad.

## Parametros claros
- max_responsabilidades_por_modulo: 1 principal
- handlers_con_logica_negocio_permitida: false
- duplicacion_endpoints_equivalentes: false
- contratos_tipados_obligatorios: true

## Criterios de cumplimiento
1. Los handlers HTTP solo orquestan entrada/salida; la lógica de negocio vive en servicios o funciones puras.
2. Si un endpoint solo cambia por un filtro, debe resolverse con parámetro, no con ruta duplicada.
3. Todo cambio de contrato API debe actualizar tipos/modelos en ambas capas cuando aplique.

## Evidencia recomendada
- Módulos separados por responsabilidad.
- Endpoints parametrizados para variaciones B2B/B2C.
- Modelos Pydantic y tipos TypeScript alineados.
