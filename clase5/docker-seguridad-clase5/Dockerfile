FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app ./

RUN addgroup -g 1001 -S appuser && adduser -S appuser -u 1001 -G appuser
RUN chown -R appuser:appuser /app
USER appuser

LABEL maintainer="Luis Ossio" \
      version="1.0-optimizado" \
      description="Backend con mejoras de seguridad" \
      security.scan="trivy" \
      security.non-root="true"

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node","src/app.js"]
