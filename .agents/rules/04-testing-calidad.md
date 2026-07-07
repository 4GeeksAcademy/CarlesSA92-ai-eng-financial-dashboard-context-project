# Regla: Testing y calidad mínima

## Nombre
Cobertura funcional mínima y puertas de calidad

## Alcance
- Aplica a: backend/tests/**/*.py, frontend/src/**/*.test.ts, scripts de validación
- Etapa: desarrollo, revisión y merge
- Responsable: quien añada endpoints, funciones de negocio o flujos UI críticos

## Razon
Aumenta confianza en cambios y reduce regresiones funcionales.

## Parametros claros
- endpoint_nuevo_test_caso_feliz: required
- endpoint_nuevo_test_caso_invalido: required
- funcion_negocio_nueva_test_unitario: required
- flujo_ui_critico_test_componente_o_integracion: required
- merge_gate_lint_and_tests: required

## Criterios de cumplimiento
1. Todo endpoint nuevo incluye pruebas positivas y negativas.
2. Toda función de cálculo/transformación incluye test unitario.
3. Lint y tests de frontend/backend deben estar en verde para aprobar cambios.

## Evidencia recomendada
- Casos de prueba añadidos junto con la funcionalidad.
- Logs de ejecución de lint y tests.
- Corrección planificada de warnings deprecados.
