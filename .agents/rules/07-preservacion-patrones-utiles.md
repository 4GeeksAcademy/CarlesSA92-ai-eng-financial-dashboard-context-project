# Regla: Preservación de patrones útiles

## Nombre
Mantener patrones de diseño que ya funcionan

## Alcance
- Aplica a: frontend/src/lib/**/*.ts, frontend/src/components/**/*.tsx, backend/app/routes.py y servicios
- Etapa: nuevas features y refactors
- Responsable: quien cambie cálculos, contratos o componentes base

## Razon
Protege la mantenibilidad existente y evita degradación arquitectónica incremental.

## Parametros claros
- separacion_logica_vs_presentacion: required
- funciones_puras_calculo_financiero: required
- tipado_estricto_y_validacion_declarativa: required
- componentes_base_reutilizables: required
- pruebas_deterministas_con_mock_seed: required

## Criterios de cumplimiento
1. Cálculos financieros permanecen fuera de componentes visuales.
2. Se reutilizan componentes base en lugar de duplicar estructura UI.
3. Datos mock usados en pruebas deben ser estables y reproducibles.

## Evidencia recomendada
- Utilidades puras reutilizadas.
- Componentes base compartidos.
- Semillas/fixtures deterministas en tests.

## Proceso
- Validada.