<<<<<<< HEAD
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
=======
# server/Dockerfile
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the server port
EXPOSE 9000

# Start the app
CMD ["npm", "start"]
>>>>>>> e2b8d44 (Add Jenkinsfile and Dockerfiles for CI pipeline)
