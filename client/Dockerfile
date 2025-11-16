<<<<<<< HEAD
# Étape 1 : builder l'app React
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : servir l'app avec Nginx
FROM nginx:alpine

# Copier le build CRA
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
=======
# client/Dockerfile
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Phase finale: serveur statique léger
FROM node:lts-alpine

WORKDIR /app

# installer 'serve' pour servir le build
RUN npm install -g serve

# Copier le build du builder
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
>>>>>>> e2b8d44 (Add Jenkinsfile and Dockerfiles for CI pipeline)
