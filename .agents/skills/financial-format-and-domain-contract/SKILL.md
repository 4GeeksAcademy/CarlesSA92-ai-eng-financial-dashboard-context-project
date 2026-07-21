---
name: financial-format-and-domain-contract
description: Estandariza formato financiero y terminologia de dominio en dashboards. Usar cuando se pida normalizar moneda, porcentaje, fechas, labels, ejes de graficos o consistencia de idioma/terminos en UI y API.
license: MIT
metadata:
  author: ai-eng-financial-dashboard-context-project
  version: "1.0.0"
---

# Financial Format and Domain Contract

Skill para imponer un contrato unico de formato financiero y consistencia semantica de dominio en el dashboard.

## Objetivo

Garantizar que todo dato financiero mostrado al usuario mantenga reglas unicas de:
- locale y moneda,
- precision y redondeo,
- convencion de signos,
- formato de fechas y periodos,
- terminologia de negocio e idioma de interfaz.

## Cuando usar

Usar esta skill cuando se solicite:
- normalizar formato de moneda o porcentaje,
- revisar consistencia de labels y mensajes financieros,
- unificar formato en KPIs, tooltips, tablas y ejes de charts,
- detectar y eliminar formateo inline disperso,
- alinear terminos de dominio entre frontend y backend.

## Cuando no usar

No usar esta skill para:
- optimizacion de performance general,
- accesibilidad WCAG,
- refactors de arquitectura sin relacion con formato o dominio.

## Inputs definidos

| Input | Tipo | Requerido | Descripcion |
|---|---|---|---|
| fileScope | string[] | Si | Rutas a evaluar (ej. frontend/src/**, backend/app/**). |
| uiPrimaryLanguage | string | Si | Idioma principal de UI, ejemplo: en o es. |
| locale | string | Si | Locale de salida numerica y fecha, ejemplo: en-US o es-ES. |
| currencyCode | string | Si | Codigo ISO 4217, ejemplo: USD, EUR. |
| currencyPrecision | number | Si | Decimales para moneda en UI. |
| percentPrecision | number | Si | Decimales para porcentaje en UI. |
| glossaryTerms | Record<string,string> | Si | Mapa de terminos permitidos por concepto de negocio. |
| compactNotation | boolean | No | Si abreviar miles/millones en ejes o labels secundarios. |
| timezone | string | No | Zona horaria para formateo de fechas y cortes de periodo. |
| failOnInlineFormatting | boolean | No | Si marcar como error el formateo directo en componentes. |

## Output esperado

La skill debe devolver un informe estructurado con:

1. Configuracion aplicada
- locale, moneda, precisiones, idioma principal y glosario activo.

2. Hallazgos por archivo
- archivo,
- regla incumplida,
- severidad,
- evidencia concreta,
- correccion sugerida.

3. Plan de remediacion
- cambios minimos propuestos,
- utilidades compartidas a crear o reutilizar,
- puntos de migracion por prioridad.

4. Validacion de cobertura
- modulos revisados,
- modulos pendientes,
- riesgos residuales.

## Criterios de aceptacion

La ejecucion se considera aceptada solo si:

1. No hay formateo financiero inline en componentes de UI para moneda, porcentaje o fechas cuando existe utilidad compartida.
2. Moneda, porcentaje y fechas usan una unica politica de locale/precision por contexto.
3. Los terminos de dominio visibles al usuario respetan el glosario definido.
4. Los mensajes de UI y errores siguen el idioma principal configurado.
5. El informe final incluye evidencias por archivo y acciones concretas.
6. Se incluyen o actualizan tests de formato para casos limite (negativos, cero, valores grandes, rounding boundary).

## Flujo de aplicacion recomendado

1. Levantar politica de formato (inputs).
2. Escanear archivos de alcance.
3. Detectar violaciones contra reglas.
4. Proponer centralizacion en utilidades compartidas.
5. Emitir informe y plan de cambios.
6. Verificar criterios de aceptacion.

## Reglas de referencia

- rules/01-locale-currency.md
- rules/02-percent-and-rounding.md
- rules/03-date-period-format.md
- rules/04-domain-terminology-and-language.md
- rules/05-no-inline-formatting.md
- rules/06-test-coverage-formatting.md

## Plantilla de salida

Usar la plantilla en:
- templates/output-report-template.md
