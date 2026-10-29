# TP2 : Docker et Docker Compose — Application MERN

Application MERN (MongoDB, Express, React, Node.js) conteneurisée avec Docker puis orchestrée avec Docker Compose.

| Service   | Image         | Port  | Rôle                       |
|-----------|---------------|-------|----------------------------|
| `mongodb` | `mongo`       | 27017 (interne) | Base de données   |
| `server`  | `mern-server` | 9000  | API Express                |
| `client`  | `mern-client` | 3000  | Interface React (`serve`)  |

## Structure

```
mern-app/
├── client/              # React
│   ├── Dockerfile
│   └── .dockerignore
├── server/              # API Express
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── README.md
```

## 1. Fork et clone

```bash
git clone git@github.com:OmarAbdallah25/mern-app.git
cd mern-app
```

## 2. Dockerfiles

- `server/Dockerfile` : `node:lts-alpine`, `npm ci`, port 9000, `npm start`.
  Le script `start` a été ajouté dans `server/package.json` (`node server.js`).
- `client/Dockerfile` : `node:lts-alpine`, `npm install`, `npm run build`, `serve`, port 3000.
  `REACT_APP_API_URL` est passée en `ARG` car React l'intègre **au moment du build**.

```bash
cd server
docker build -t mern-server .
cd ../client
docker build -t mern-client .
cd ..
```

## 3. Réseau Docker

```bash
docker network create mern-network
```

## 4. MongoDB avec volume

```bash
docker volume create mern-data
docker run -d --name mongodb --network mern-network -v mern-data:/data/db mongo
```

## 5. Serveur et client

```bash
docker run -d --name server --network mern-network -p 9000:9000 -e MONGO_URI=mongodb://mongodb:27017/mern mern-server
docker run -d --name client --network mern-network -p 3000:3000 mern-client
```

Vérification :

```bash
docker ps
docker logs server            # "Successfully connected to MongoDB."
curl http://localhost:9000/   # "App is running"
```

Puis ouvrir http://localhost:3000.

> **localhost vs nom de service** : le serveur joint MongoDB via `mongodb` (nom du conteneur dans le réseau Docker).
> Le client React s'exécute dans le **navigateur** de la machine hôte, il joint donc l'API via `http://localhost:9000`
> et non `http://server:9000`.

Nettoyage avant Compose :

```bash
docker rm -f client server mongodb
```

## 6. Docker Compose

Le fichier `docker-compose.yml` définit :
- `mongodb` : volume nommé `mern-data`, `restart: unless-stopped`, `healthcheck` (`mongosh ping`).
- `server` : build `./server`, port 9000, `MONGO_URI`, `depends_on: mongodb (condition: service_healthy)`.
- `client` : build `./client`, port 3000, `depends_on: server`.
- Réseau `mern-network` (driver `bridge`).

```bash
docker compose up --build
```

## 7. Tests et diagnostic

```bash
docker compose ps
docker compose logs --tail=50 server
```

**Test de bout en bout** : créer un enregistrement dans l'interface (Create Record) → il s'affiche dans la liste →
il est présent dans MongoDB :

```bash
docker exec -it mongodb mongosh employees --eval "db.records.find()"
```

**Test de persistance** :

```bash
docker compose down        # sans -v : le volume est conservé
docker compose up -d
```

Les enregistrements sont toujours présents.

**Diagnostiquer un service qui échoue au démarrage** :
1. `docker compose ps` : état du service (`Exited`, `Restarting`, `unhealthy`).
2. `docker compose logs <service>` : lire le message d'erreur.
3. `docker inspect --format "{{json .State.Health}}" mongodb` : résultat du healthcheck.
4. `docker compose exec server sh` puis `env` : vérifier les variables d'environnement.
5. `docker compose config` : valider le fichier YAML.
6. `netstat -ano | findstr :9000` : vérifier qu'un port n'est pas déjà utilisé.
7. `docker compose build --no-cache` : reconstruire les images.

**Arrêt** :

```bash
docker compose down        # arrête et supprime les conteneurs
docker compose down -v     # supprime aussi le volume (perte des données)
```

## Difficultés résolues

- `server/package.json` n'avait pas de script `start` → ajout de `"start": "node server.js"`.
- Le serveur démarrait l'API sans attendre MongoDB → `server.js` se connecte d'abord à MongoDB puis lance `app.listen`,
  et quitte en cas d'échec (le conteneur est relancé grâce à la politique de redémarrage).
- Ordre de démarrage : `depends_on` avec `condition: service_healthy` pour attendre que MongoDB soit prêt.
- `REACT_APP_API_URL` doit valoir `http://localhost:9000` (URL vue par le navigateur) et être fournie au build.

## Variables d'environnement

Voir `.env.example`. Aucun secret n'est publié dans le dépôt.

## Captures d'écran

Les captures sont dans le dossier `screenshots/`.
