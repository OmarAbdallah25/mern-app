# Étape 1 : Base Node
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer les dépendances en production
RUN npm install --production

# Copier tout le code
COPY . .

# Exposer le port (adapter si ton backend utilise un autre port)
EXPOSE 5000

# Démarrer le serveur (adapter si ton script est différent)
CMD ["npm", "start"]
