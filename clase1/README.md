# Nombre aplicación

mi-apache

# RUN

docker run -d -p 8081:80 --name mi-apache httpd

# Verificación

docker ps
curl localhost:8081

# Limpieza

docker stop mi-apache
docker rm mi-apache

# Explicación

1. Con el comando run se despliega el contenedor, en ese caso una aplicacion web, en el puerto 8081 direccionada al puerto 80 con nombre "mi-apache"
-d : Hace que el contenedor se ejecute en segundo plano
-p 8081:80 : El puerto 8081 del host se conecta al puerto 80 del contenedor
-- name mi-apache : En lugar de un nombre aleatorio, se llamará mi-apache
httpd : es la imagen oficial de Apache HTTP Server

# Evidencia

Docker corriendo (https://github.com/lossio86/curso-docker-kubernetes-tareas/blob/main/clase1/Screenshot/docker_ps.png) 
Logs https://github.com/lossio86/curso-docker-kubernetes-tareas/blob/main/clase1/Screenshot/docker_logs.png
Limpieza de contenedor https://github.com/lossio86/curso-docker-kubernetes-tareas/blob/main/clase1/Screenshot/docker_rm.png
Limpieza de imagen https://github.com/lossio86/curso-docker-kubernetes-tareas/blob/main/clase1/Screenshot/docker_rmi.png
Docker limpio total https://github.com/lossio86/curso-docker-kubernetes-tareas/blob/main/clase1/Screenshot/docker_limpio.png
