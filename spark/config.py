# Configuration Kafka et Spark

# Adresse du broker Kafka
KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"

# Noms des topics d'entrée
TOPICS = {
    "ENVIRONMENT": "smartcity.environment.readings",
    "WATER": "smartcity.water.readings",
    "TRAFFIC": "smartcity.traffic.readings"
}

# Noms des topics de sortie (résultats Spark)
SPARK_TOPICS = {
    "ENVIRONMENT": "smartcity.spark.environment",
    "WATER": "smartcity.spark.water",
    "TRAFFIC": "smartcity.spark.traffic"
}

# Configuration du Watermarking (pour gérer les données en retard)
WATERMARK_DELAY = "5 minutes"

# Fenêtre d'agrégation (ex: moyenne sur les 2 dernières minutes, mise à jour chaque minute)
WINDOW_DURATION = "2 minutes"
SLIDING_INTERVAL = "1 minute"
