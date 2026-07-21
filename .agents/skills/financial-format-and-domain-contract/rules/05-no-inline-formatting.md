# Regla 05: Sin formateo inline en UI

## Objetivo
Forzar centralizacion de reglas de formato para mantenimiento y testeo.

## Validaciones
- No se permite formateo inline de moneda/porcentaje/fecha en componentes.
- Se reutilizan helpers del dominio financiero.
- Todo helper nuevo debe ser exportable y testeable.

## Incumplimientos tipicos
- Concatenar simbolos monetarios en JSX.
- Aplicar toFixed o Date locale directo dentro del render.

## Severidad sugerida
- Alta si hay repeticion en multiples componentes.
- Media en casos aislados.
