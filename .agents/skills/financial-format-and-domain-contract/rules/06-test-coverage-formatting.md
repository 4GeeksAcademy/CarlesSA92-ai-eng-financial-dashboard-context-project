# Regla 06: Cobertura minima de formato

## Objetivo
Reducir regresiones en reglas financieras visibles para usuario final.

## Validaciones
- Tests de formato para moneda y porcentaje.
- Casos limite cubiertos: cero, negativo, valores grandes, frontera de redondeo.
- Pruebas de idioma/locale para labels temporales.

## Incumplimientos tipicos
- Helpers sin tests.
- Tests solo de caso feliz.

## Severidad sugerida
- Alta cuando se cambian utilidades compartidas.
- Media en ajustes de presentacion menor.
