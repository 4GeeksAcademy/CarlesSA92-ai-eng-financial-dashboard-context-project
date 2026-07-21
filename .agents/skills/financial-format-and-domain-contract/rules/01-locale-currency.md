# Regla 01: Locale y moneda unificados

## Objetivo
Evitar salidas inconsistentes de moneda entre modulos del dashboard.

## Validaciones
- Todo formateo de moneda usa una utilidad compartida.
- La utilidad aplica locale y currencyCode definidos en inputs.
- precision de moneda alineada con currencyPrecision.

## Incumplimientos tipicos
- Uso directo de Intl.NumberFormat con parametros distintos.
- Hardcode de simbolo de moneda en strings.

## Severidad sugerida
- Alta cuando afecta KPIs o montos principales.
- Media cuando afecta labels secundarios.
