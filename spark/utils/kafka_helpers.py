from pyspark.sql import SparkSession

def create_kafka_stream(spark: SparkSession, topic_name: str, kafka_servers: str):
    """
    Crée un flux de lecture Spark Streaming depuis un topic Kafka.
    """
    return spark \
        .readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", kafka_servers) \
        .option("subscribe", topic_name) \
        .option("startingOffsets", "latest") \
        .load()

def write_stream_to_console(df, query_name: str):
    """
    Écrit le résultat d'un DataFrame agrégé dans la console.
    """
    return df \
        .writeStream \
        .outputMode("update") \
        .format("console") \
        .option("truncate", "false") \
        .queryName(query_name) \
        .start()

def write_stream_to_kafka(df, topic_name: str, kafka_servers: str, checkpoint_dir: str):
    """
    Convertit le DataFrame en JSON et l'envoie vers un topic Kafka.
    """
    from pyspark.sql.functions import to_json, struct

    # Kafka attend une colonne "value" contenant le message en chaîne de caractères (JSON)
    kafka_df = df.select(to_json(struct("*")).alias("value"))

    return kafka_df \
        .writeStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", kafka_servers) \
        .option("topic", topic_name) \
        .option("checkpointLocation", checkpoint_dir) \
        .outputMode("update") \
        .start()
