# Regla 02: Porcentaje y redondeo consistentes

## Objetivo
Asegurar que porcentajes y redondeo sigan una unica convencion visual y numerica.

## Validaciones
- Todo porcentaje usa utilidad compartida.
- precision de porcentaje alineada con percentPrecision.
- Regla de signo consistente para positivos/negativos.

## Incumplimientos tipicos
- Uso de toFixed en componentes.
- Mezcla de precision (ej. 0, 1 y 2 decimales) en la misma vista.

## Severidad sugerida
- Alta si altera lectura de tendencias o comparativas.
- Media en tooltips o textos auxiliares.
