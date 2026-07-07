# Regla: Seguridad por entorno

## Nombre
Configuración segura por entorno (dev, test, prod)

## Alcance
- Aplica a: backend/app/main.py, backend/Dockerfile, docker-compose.yml, variables de entorno
- Etapa: ejecución local, despliegue y revisión de configuración
- Responsable: quien modifique CORS, puertos o debugging remoto

## Razon
Previene exposición innecesaria de servicios y reduce superficie de ataque.

## Parametros claros
- cors_allow_origins_wildcard_en_prod: false
- cors_allow_credentials_con_wildcard: false
- debug_remoto_habilitado_por_defecto: false
- puerto_debug_expuesto_por_defecto: false
- security_decisions_documented: true

## Criterios de cumplimiento
1. CORS debe usar allowlist explícita fuera de desarrollo local.
2. Debug remoto solo puede activarse por flag o variable de entorno en perfil dev.
3. No publicar puertos de depuración en configuraciones de uso general.

## Evidencia recomendada
- Configuración de CORS por entorno.
- Compose override o perfil dev para debug.
- Nota de seguridad en documentación.

## Proceso
- Validada.