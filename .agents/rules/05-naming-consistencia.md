# Regla: Naming y consistencia funcional

## Nombre
Lenguaje y nomenclatura de dominio consistentes

## Alcance
- Aplica a: frontend/src/**/*.{ts,tsx}, backend/app/**/*.py, mensajes de UI/API
- Etapa: diseño de dominio, implementación y revisión de UX textual
- Responsable: quien introduzca nuevos términos, tipos o mensajes

## Razon
Mejora comprensión del dominio y reduce ambigüedades entre equipo técnico y negocio.

## Parametros claros
- idioma_ui_principal: es|en (definir uno por proyecto)
- mezcla_idiomas_en_mensajes: discouraged
- glosario_terminos_dominio: required
- nombres_funcion_intencion_clara: required
- nombres_campos_cross_layer_consistentes: required

## Criterios de cumplimiento
1. UI y errores usan un idioma principal definido.
2. Términos clave de negocio están normalizados en glosario.
3. Tipos/campos equivalentes mantienen coherencia entre frontend y backend.

## Evidencia recomendada
- Convención de idioma documentada.
- Glosario breve de términos financieros.
- Revisión de nombres en PR.
