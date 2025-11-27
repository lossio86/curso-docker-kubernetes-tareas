# Clase 2 - Dockerización de mi api

## Aplicación

**Lenguaje:** Node.js
**Framework:** Express
**Descripción:** API REST para gestión de tareas

**Endpoints:**
- GET / - Página de bienvenida
- GET /api/tasks - Lista de tareas
- POST /api/tasks - Crear tarea

## Dockerfile

\`\`\`Dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
...

# Stage 2: Production
FROM node:18-alpine
...
\`\`\`

**Explicación:**

| Stage | Propósito |
|-------|-----------|
| Build | Instalar todas las dependencias... |
| Production | Solo runtime... |

## Build

\`\`\`bash
docker build -t tasks-api:1.0 .
\`\`\`

**Salida:**
\`\`\`
[+] Building 32.5s ...
Successfully tagged tasks-api:1.0
\`\`\`

**Tamaño final:** 145MB

## Testing

![Docker Images](screenshots/docker-images.png)
![Container Running](screenshots/docker-ps.png)
![API Response](screenshots/curl-response.png)

## Docker Hub

**URL:** https://hub.docker.com/r/miusuario/tasks-api

![Docker Hub](screenshots/dockerhub.png)

## Optimizaciones

- Multi-stage build: redujo de 320MB a 145MB
- Usuario non-root
- .dockerignore excluye node_modules

## Conclusiones

Aprendí a optimizar imágenes
