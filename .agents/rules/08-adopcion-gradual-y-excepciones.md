# Regla: Adopción gradual y manejo de excepciones

## Nombre
Implementación por fases con control de excepciones

## Alcance
- Aplica a: planificación técnica, PRs y roadmap de mejoras
- Etapa: priorización e implementación de estándares
- Responsable: mantenedores y autores de cambios estructurales

## Razon
Permite elevar estándares sin bloquear el avance del proyecto.

## Parametros claros
- estrategia_adopcion: faseada
- orden_prioridad_recomendado: seguridad > reproducibilidad > modularidad > testing
- excepciones_permitidas: true
- excepcion_requiere_justificacion: true
- excepcion_requiere_fecha_y_alcance: true

## Criterios de cumplimiento
1. Aplicar reglas por fases priorizando mitigación de riesgo alto.
2. Toda excepción debe incluir motivo, alcance temporal y plan de cierre.
3. Revisar excepciones activas en cada ciclo de trabajo relevante.

## Evidencia recomendada
- Lista de pendientes por fase.
- Registro de excepciones con fecha.
- Seguimiento de cierre de excepciones.

## Proceso
- Validada.