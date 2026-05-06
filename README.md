# Smart City

Ce projet contient plusieurs parties :

- Kafka
- Node-RED
- Backend Node.js
- Frontend Next.js

## Ordre de démarrage du projet

Avant de commencer, il faut installer et démarrer **Kafka**.

Il est recommandé d’utiliser **Docker** pour installer et lancer Kafka plus facilement.

## 1. Démarrer Kafka

Démarrez Kafka avant Node-RED, car Node-RED utilise Kafka pour communiquer avec les autres services.

Si vous utilisez Docker, lancez Kafka avec votre fichier `docker-compose.yml` :

```bash
docker compose up -d
```

ou, selon votre version de Docker :

```bash
docker-compose up -d
```

## 2. Démarrer Node-RED

Après le démarrage de Kafka, lancez Node-RED :

```bash
node-red
```

Puis ouvrez l’interface dans le navigateur :

```text
http://127.0.0.1:1880/
```

(suirve README.md | node-red/README.md)

## 3. Démarrer le backend
(suirve README.md | backend/README.md)

## 4. Démarrer le frontend
(suirve README.md | frontend/README.md)

## Résumé

L’ordre recommandé est le suivant :

```text
1. Démarrer Kafka
2. Démarrer Node-RED
3. Démarrer le backend
4. Démarrer le frontend
```
