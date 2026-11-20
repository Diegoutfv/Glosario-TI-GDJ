# ==========================================
# ETAPA 1: Compilación (Build)
# ==========================================
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usando npm ci para builds reproducibles)
# Si no tienes package-lock.json, cambia esto a: RUN npm install
RUN npm install

# Copiar el resto del código fuente
COPY . .

# URL de la API incrustada en el build (nginx hace proxy de /api al backend)
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Compilar la aplicación React para producción
# (Esto generará la carpeta /app/build)
RUN npm run build

# ==========================================
# ETAPA 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:stable-alpine

# Copiar nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la Etapa 1
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]