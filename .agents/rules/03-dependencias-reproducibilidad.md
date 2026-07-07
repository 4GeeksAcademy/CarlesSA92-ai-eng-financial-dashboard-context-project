# Regla: Dependencias y reproducibilidad

## Nombre
Versionado consistente y builds deterministas

## Alcance
- Aplica a: backend/requirements.txt, backend/Pipfile, frontend/package.json, imágenes Docker
- Etapa: instalación, actualización de dependencias y CI
- Responsable: quien agregue/actualice paquetes o versiones de runtime

## Razon
Evita drift entre entornos y fallos difíciles de reproducir.

## Parametros claros
- dependencias_sin_version_fija_permitidas: false
- version_python_unica_proyecto: true
- validacion_post_update_lint: required
- validacion_post_update_tests: required
- fuente_de_verdad_dependencias_definida: true

## Criterios de cumplimiento
1. No usar comodines de versión para dependencias críticas.
2. Python en Docker y gestor de dependencias debe coincidir.
3. Toda actualización debe pasar lint y tests antes de merge.

## Evidencia recomendada
- Versiones explícitas en archivos de dependencias.
- Runtime alineado en tooling.
- Registro de validación en PR/CI.
