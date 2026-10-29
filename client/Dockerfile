# ---------- Image du client React : mern-client ----------
# 1. Image de base légère
FROM node:lts-alpine

# 2. Répertoire de travail
WORKDIR /app

# 3. Copier les fichiers de dépendances
COPY package*.json ./

# 4. Installer les dépendances
RUN npm install

# 5. Copier le reste du code du client
COPY . .

# 6. URL de l'API utilisée PAR LE NAVIGATEUR (injectée au moment du build).
#    Le navigateur tourne sur ta machine : il doit viser localhost:9000,
#    PAS http://server:9000 (ce nom n'existe que dans le réseau Docker).
ARG REACT_APP_API_URL=http://localhost:9000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# 7. Construire l'application React (génère le dossier build/)
RUN npm run build

# 8. Installer un serveur HTTP léger
RUN npm install -g serve

# 9. Port exposé
EXPOSE 3000

# 10. Servir les fichiers statiques du build
CMD ["serve", "-s", "build", "-l", "3000"]
