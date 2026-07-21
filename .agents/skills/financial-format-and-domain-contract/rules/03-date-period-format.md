# Regla 03: Fechas y periodos normalizados

## Objetivo
Unificar como se presentan periodos y fechas para evitar ambiguedad temporal.

## Validaciones
- Formato de fecha depende de locale definido.
- timezone explicita cuando aplica a cierres o agregaciones por periodo.
- Labels de mes/anio usan utilidad compartida.

## Incumplimientos tipicos
- Formateo manual de fechas con strings.
- Mezcla de convenciones de mes (Jan vs Ene) sin criterio.

## Severidad sugerida
- Media en reportes historicos.
- Alta si puede cambiar interpretacion del periodo.
