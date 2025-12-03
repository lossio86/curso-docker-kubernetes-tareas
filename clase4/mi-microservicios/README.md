# docker-microservicios-clase4

## Descripción
Proyecto de ejemplo para la tarea: microservicios con Redis (cache), Nginx como gateway, MongoDB para persistencia y un frontend estático.

### Tecnologías
- Nginx
- Node.js (Express)
- Redis
- MongoDB
- Docker / Docker Compose

## Arquitectura (ASCII)

[Client] -> [Gateway Nginx (8080)] -> /api -> [Service Posts (5000)] -> [MongoDB]
-> cache -> [Redis]
-> / -> [Frontend Nginx (80)]
Docker network: micro_net
Volumes: mongo_data, redis_data, frontend_data

## Servicios

| Servicio | Tecnología | Puerto (host:container) | Descripción |
|---|---:|---:|---|
| gateway | Nginx | 8080:80 | API Gateway, rutea /api y / |
| backend | Node.js (Express) | 5000:5000 | API principal con cache y DB |
| redis | Redis | 6379:6379 | Cache |
| db | MongoDB | 27017:27017 | Persistencia |
| frontend | Nginx | (accesible vía gateway) | Interfaz web estática |

## Uso

1. Clonar repositorio

```bash
git clone <tu-repo>
cd docker-microservicios-clase4
2.	Levantar servicios
docker compose up -d --build
3.	Verificar estado
docker compose ps
4.	Ver logs
docker compose logs -f
5.	Acceder a la app
http://localhost:8080
Endpoints API
•	GET /api/posts — Lista posts. Response: { "source": "cache|database", "data": [...] }
•	GET /api/posts/:id — Ver post por id. Response: { "source": "cache|database", "data": {...} }
•	POST /api/posts — Crear post. Body JSON: { "title":"...", "content":"..." }. Invalida cache.
•	PUT /api/posts/:id — Actualiza post. Invalida cache.
•	DELETE /api/posts/:id — Elimina post. Invalida cache.
•	GET /api/health — Health del backend.
•	GET /gateway/health — Health del gateway.
