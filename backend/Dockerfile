# ---------- Etapa base: dependencias ----------
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Etapa de pruebas ----------
FROM deps AS test
COPY . .
RUN npm test

# ---------- Etapa final (producción) ----------
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
