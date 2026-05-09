#!/bin/bash

# Définir la version du package Kafka pour Spark (doit correspondre à votre version de Spark/Scala)
# La version par défaut 3.5.0 correspond à la version pyspark==3.5.1
KAFKA_PACKAGE="org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0"

# Se déplacer dans le dossier du script pour trouver main.py
cd "$(dirname "$0")" || exit 1

echo "Lancement de PySpark Streaming..."
spark-submit --packages $KAFKA_PACKAGE main.py
