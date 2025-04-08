FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Instalar dependencias de compilación
RUN apk add --no-cache make gcc g++ python3

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar todas las dependencias, incluidas devDependencies
RUN npm install

# Copiar el código fuente
COPY src/ ./src/

# Comprobar estructura de directorios
RUN find . -type f | sort

# Compilar la aplicación explícitamente con el CLI de NestJS
RUN npx @nestjs/cli build

# Verificar que los archivos compilados existen
RUN ls -la dist/

# Etapa de producción
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar archivos de producción
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./.env

# Verificar estructura final
RUN ls -la && ls -la dist/

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar (usando node directamente)
CMD ["node", "dist/main.js"]