# Dockerisation de My Favorite Places

Lancer toute la stack :

```bash
docker compose up -d --build
```

- Front : http://localhost:8080
- API : http://localhost:3000/api
- Arrêt (et suppression des données) : `docker compose down -v`

## TD 1 — Dockerisation

### Fichiers ajoutés

| Fichier | Rôle |
| --- | --- |
| `server/Dockerfile` | Build du serveur (multi-stage) |
| `client/Dockerfile` | Build du client Vite, servi par nginx (multi-stage) |
| `client/nginx.conf` | Sert le front et relaie `/api` vers le serveur |
| `compose.yml` | Lance `db` (PostgreSQL 17), `server` et `client` |
| `*/.dockerignore` | Exclut `node_modules` et `dist` du contexte de build |

### Modification du code

`server/src/datasource.ts` lit désormais `DB_HOST`, `DB_USER`, `DB_PASSWORD` et `DB_NAME`, avec les anciennes
valeurs en défaut (`localhost`, `postgres`, `supersecret`, `postgres`). `yarn dev` en local fonctionne donc comme
avant. Dans Docker, `DB_HOST=db` est nécessaire : `localhost` désignerait le conteneur du serveur lui-même, pas
la BDD.

### Comment les services communiquent

- **BDD ↔ serveur** : en TCP sur le réseau interne créé par Compose. Le serveur joint la BDD par le nom du
  service (`db`), résolu par le DNS interne de Docker, sur le port 5432. Ce port n'est pas publié sur l'hôte.
- **Front ↔ serveur** : le navigateur appelle `/api/...` en relatif sur le port 8080. nginx relaie vers
  `http://server:3000`, toujours par DNS interne. C'est le même principe que le proxy de `vite.config.ts` en
  dev, et il n'y a pas de CORS à gérer.
- Le port 3000 est publié uniquement pour tester l'API directement (Bruno, curl). Le front n'en a pas besoin.

### Points d'attention

- Le mot de passe de la BDD (`supersecret`) et `SESSION_SECRET` (défaut `superlongstring`) sont en clair, comme
  dans le code d'origine. Pour autre chose qu'un TD, utiliser un fichier `.env`.
- `synchronize: true` crée le schéma automatiquement au démarrage : pratique ici, déconseillé en production.
- Le projet utilise `yarn.lock`, les Dockerfiles utilisent donc `yarn`.

## TD 2 — Fiabilité et optimisation

### 1. Le serveur démarre une fois la BDD prête

La BDD déclare un `healthcheck` (`pg_isready`), et le serveur la référence avec `condition: service_healthy` :

```yaml
db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 2s
    timeout: 3s
    retries: 15

server:
  depends_on:
    db:
      condition: service_healthy
```

`depends_on` seul n'attend que le démarrage du conteneur, pas que PostgreSQL accepte des connexions. Sans le
healthcheck, `datasource.initialize()` échoue et le serveur ne démarre pas (le `catch` de `index.ts` logge
l'erreur mais ne relance rien).

### 2. Redémarrage automatique

`restart: unless-stopped` sur les trois services : ils redémarrent après un crash ou un redémarrage du démon
Docker, sauf s'ils ont été arrêtés manuellement (`docker compose stop`, `docker stop`).

### 3. Build stages et taille de l'image serveur

Un build multi-stage utilise plusieurs `FROM` dans un même Dockerfile. Seul le dernier stage compose l'image
finale, et `COPY --from=build` ne récupère que ce qui est nécessaire.

**Serveur** :
- Stage `build` : installe toutes les dépendances (dont `typescript`) et compile avec `tsc`.
- Stage final : réinstalle uniquement les dépendances de production (`--production`), vide le cache yarn et copie
  `dist/`. Le compilateur, les sources TypeScript et les devDependencies (nodemon, ts-node, types) restent dans
  le stage de build.
- Image de base passée de `node:22-slim` (Debian) à `node:22-alpine`. `argon2` fournit des binaires précompilés
  pour musl, et le hachage de mot de passe a été vérifié sous Alpine.

| Image serveur | Taille |
| --- | --- |
| `node:22-slim`, multi-stage | 550 Mo |
| `node:22-alpine`, multi-stage, cache yarn vidé | 333 Mo |

Gain : ~217 Mo, au-delà des ~100 Mo demandés.

**Client** : le stage `build` (Node + Vite) est jeté, l'image finale est un `nginx:alpine` qui ne contient que
les fichiers statiques de `dist/` (94 Mo).

### Vérification

`docker compose up -d --build` : BDD healthy avant le démarrage du serveur, les trois conteneurs ont la politique
`unless-stopped`, et `POST /api/users` via le front (port 8080) crée bien un utilisateur (hachage argon2 inclus).
