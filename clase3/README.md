# Aplicación Multi-Contenedor con Docker Compose

**Curso:** Docker & Kubernetes - Clase 3  
**Estudiante:** Luis Ossio   

Esta es una aplicación web simple que utiliza un servidor Nginx y una base de datos PostgreSQL, orquestados mediante Docker Compose.

---

## Stack

- **Web:** Nginx sirviendo HTML estático  
- **Base de Datos:** PostgreSQL 15  
- **Red:** app-network  
- **Volumen persistente:** db-data  

---

## Ejecución

1. Clonar:
   ```bash
   git clone https://github.com/lossio86/curso-docker-kubernetes-tareas/tree/main/clase3.git
   cd clase3
