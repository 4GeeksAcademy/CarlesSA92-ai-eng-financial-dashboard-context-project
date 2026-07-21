# Stack tecnologico del repositorio

Fecha de corte: 2026-07-21

Este documento resume el stack del proyecto usando solo hechos observables en el codigo y configuraciones del repositorio.

## 1. Frontend

### Framework, runtime y build

- Next.js 15 (App Router): [frontend/package.json](../frontend/package.json#L18), [frontend/app/page.tsx](../frontend/app/page.tsx)
- React 19 (libreria de UI): [frontend/package.json](../frontend/package.json#L19)
- React DOM 19 (render web): [frontend/package.json](../frontend/package.json#L20)
- next dev / next build / next start: [frontend/package.json](../frontend/package.json#L7)
- TypeScript 6 (tipado estatico): [frontend/package.json](../frontend/package.json#L39)
- Node base en contenedor: node:24-alpine: [frontend/Dockerfile](../frontend/Dockerfile#L1)

### UI y visualizacion

- Recharts para graficas: [frontend/package.json](../frontend/package.json#L21)
- Lucide React para iconografia: [frontend/package.json](../frontend/package.json#L18)
- Tailwind CSS 4 + plugin PostCSS para Next.js: [frontend/package.json](../frontend/package.json#L38), [frontend/postcss.config.mjs](../frontend/postcss.config.mjs)
- Utilidades de clases: clsx, tailwind-merge, class-variance-authority: [frontend/package.json](../frontend/package.json#L16), [frontend/package.json](../frontend/package.json#L22), [frontend/package.json](../frontend/package.json#L17)
- Fuentes optimizadas con next/font: [frontend/app/layout.tsx](../frontend/app/layout.tsx)

### Configuracion tecnica relevante

- Alias de import "@" hacia src: [frontend/tsconfig.json](../frontend/tsconfig.json)
- Rewrite de /api hacia backend: [frontend/next.config.ts](../frontend/next.config.ts)
- Scripts de trabajo: dev, build, lint, test, coverage: [frontend/package.json](../frontend/package.json#L7)
- Compilacion TS orientada a Next.js con plugin next: [frontend/tsconfig.json](../frontend/tsconfig.json)

### Calidad en frontend

- ESLint con base JS + TypeScript ESLint + React Hooks: [frontend/eslint.config.js](../frontend/eslint.config.js)
- Vitest como runner de pruebas y cobertura V8: [frontend/package.json](../frontend/package.json#L11), [frontend/package.json](../frontend/package.json#L13), [frontend/package.json](../frontend/package.json#L31)

## 2. Backend

### Framework, runtime y servidor

- FastAPI como framework HTTP: [backend/requirements.txt](../backend/requirements.txt#L1), [backend/app/main.py](../backend/app/main.py#L1)
- Uvicorn como servidor ASGI: [backend/requirements.txt](../backend/requirements.txt#L2), [backend/Dockerfile](../backend/Dockerfile#L12)
- Python base en contenedor: python:3.13-slim: [backend/Dockerfile](../backend/Dockerfile#L1)

### API y configuracion relevante

- App FastAPI titulada "Financial Metrics API": [backend/app/main.py](../backend/app/main.py#L6)
- CORS habilitado en la app (actualmente permisivo): [backend/app/main.py](../backend/app/main.py#L7), [backend/app/main.py](../backend/app/main.py#L9)
- Router principal incluido desde app.routes: [backend/app/main.py](../backend/app/main.py#L4), [backend/app/main.py](../backend/app/main.py#L14)

### Debug y pruebas

- Debug remoto con debugpy declarado en dependencias y comando de arranque: [backend/requirements.txt](../backend/requirements.txt#L3), [backend/Dockerfile](../backend/Dockerfile#L12)
- Pytest y pytest-cov presentes: [backend/requirements.txt](../backend/requirements.txt#L4), [backend/requirements.txt](../backend/requirements.txt#L5)
- httpx declarado para soporte de pruebas/cliente: [backend/requirements.txt](../backend/requirements.txt#L6)

### Gestion de dependencias Python

- requirements.txt presente (sin pins de version): [backend/requirements.txt](../backend/requirements.txt#L1)
- Pipfile presente (paquetes con wildcard): [backend/Pipfile](../backend/Pipfile#L7)
- Version Python declarada en Pipfile: 3.12: [backend/Pipfile](../backend/Pipfile#L17)

## 3. Infraestructura y tooling transversal

### Contenedores y orquestacion

- Docker Compose con dos servicios: frontend y backend: [docker-compose.yml](../docker-compose.yml#L2), [docker-compose.yml](../docker-compose.yml#L14)
- Mapeo de puertos:
  - Frontend 5173: [docker-compose.yml](../docker-compose.yml#L7)
  - Backend API 8000: [docker-compose.yml](../docker-compose.yml#L19)
  - Backend debug 5678: [docker-compose.yml](../docker-compose.yml#L20)
- Volumenes para desarrollo en caliente: [docker-compose.yml](../docker-compose.yml#L9), [docker-compose.yml](../docker-compose.yml#L22)

### Flujo de ejecucion local documentado

- Comando recomendado: docker compose up --build: [README.md](../README.md#L42)
- URLs esperadas en local: [README.md](../README.md#L48)

### Estandares de agentes (repositorio)

- Reglas de agentes definidas en .agents/rules: [.agents/rules/01-arquitectura-modularidad.md](../.agents/rules/01-arquitectura-modularidad.md#L1)
- AGENTS.md indica revisar .agents/rules y .agents/skills: [AGENTS.md](../AGENTS.md#L5), [AGENTS.md](../AGENTS.md#L9)

## 4. Dependencias clave (resumen ejecutivo)

### Frontend (produccion)

- next ^15.5.0: [frontend/package.json](../frontend/package.json#L18)
- react ^19.2.4: [frontend/package.json](../frontend/package.json#L19)
- react-dom ^19.2.4: [frontend/package.json](../frontend/package.json#L20)
- recharts ^3.8.1: [frontend/package.json](../frontend/package.json#L21)
- lucide-react ^1.8.0: [frontend/package.json](../frontend/package.json#L18)
- class-variance-authority ^0.7.1: [frontend/package.json](../frontend/package.json#L16)
- clsx ^2.1.1: [frontend/package.json](../frontend/package.json#L17)
- tailwind-merge ^3.5.0: [frontend/package.json](../frontend/package.json#L22)

### Frontend (desarrollo/calidad)

- typescript ~6.0.2: [frontend/package.json](../frontend/package.json#L39)
- eslint ^9.39.4: [frontend/package.json](../frontend/package.json#L33)
- typescript-eslint ^8.58.0: [frontend/package.json](../frontend/package.json#L40)
- vitest ^4.1.4: [frontend/package.json](../frontend/package.json#L42)
- @vitest/coverage-v8 ^4.1.4: [frontend/package.json](../frontend/package.json#L31)
- tailwindcss ^4.2.2: [frontend/package.json](../frontend/package.json#L38)
- @tailwindcss/postcss ^4.2.2: [frontend/package.json](../frontend/package.json#L26)

### Backend

- fastapi: [backend/requirements.txt](../backend/requirements.txt#L1)
- uvicorn[standard]: [backend/requirements.txt](../backend/requirements.txt#L2)
- debugpy: [backend/requirements.txt](../backend/requirements.txt#L3)
- pytest: [backend/requirements.txt](../backend/requirements.txt#L4)
- pytest-cov: [backend/requirements.txt](../backend/requirements.txt#L5)
- httpx: [backend/requirements.txt](../backend/requirements.txt#L6)

## 5. Notas de interpretacion (hechos observables)

- El repositorio usa stack full-stack React + FastAPI con orquestacion Docker Compose.
- El frontend esta preparado para desarrollo con rewrite /api a backend mediante Next.js.
- El backend esta configurado para ejecución con uvicorn y debugpy en el CMD del contenedor.
- Existen dos fuentes de dependencias Python (requirements.txt y Pipfile) y no están pinneadas por version exacta.
- No se ha añadido en este documento ninguna tecnologia no presente en archivos del repositorio.
