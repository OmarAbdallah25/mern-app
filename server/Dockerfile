# ---------- Image du serveur Express : mern-server ----------
# 1. Image de base légère
FROM node:lts-alpine

# 2. Répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier uniquement les fichiers de dépendances (meilleur cache Docker)
COPY package*.json ./

# 4. Installer les dépendances (npm ci si package-lock.json existe)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 5. Copier le reste du code du serveur
COPY . .

# 6. Variables par défaut (MONGO_URI est surchargée par docker run / compose)
ENV PORT=9000 \
    NODE_ENV=production

# 7. Port exposé
EXPOSE 9000

# 8. Démarrage (le script "start" doit lancer "node <fichier>", pas nodemon)
CMD ["npm", "start"]
