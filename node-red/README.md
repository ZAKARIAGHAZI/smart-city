# Smart City | Node-RED

## Installation de Node-RED

Avant de commencer, assurez-vous que **Node.js** est bien installé sur votre machine.

Vous pouvez vérifier l'installation avec les commandes suivantes :

```bash
node -v
npm -v
```

Ensuite, installez Node-RED avec la commande suivante :

```bash
npm install -g node-red
```

## Démarrage de Node-RED

Pour démarrer Node-RED, lancez :

```bash
node-red
```

Node-RED va afficher une URL comme celle-ci :

```text
http://127.0.0.1:1880/
```

Copiez cette URL dans le navigateur de la même machine pour accéder à l'interface Node-RED.

## Connexion de Node-RED avec Kafka

Pour connecter Node-RED avec Kafka, il faut installer le module KafkaJS.

Dans l'interface Node-RED, ouvrez :

```text
Menu ☰ → Manage palette → Install
```

Recherchez le module suivant :

```text
node-red-contrib-kafkajs
```

Puis cliquez sur **Install**.

Après l'installation, vous trouverez les nœuds suivants dans la palette Node-RED :

```text
kafkajs-producer
kafkajs-consumer
kafkajs-client
```

Le nœud `kafkajs-client` permet de configurer la connexion avec le broker Kafka.

## Exemple de broker Kafka

Si Kafka est installé sur la même machine, vous pouvez utiliser :

```text
localhost:9092
```

**POUR PLUS DE DETAILS CONSULTER LE DOSSIER `images/` QUI CONTIENT DES SCREENSSHOTS**
Si Node-RED est lancé avec Docker, utilisez le nom du service Kafka, par exemple :

```text
kafka:9092
```
