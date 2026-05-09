#!/bin/bash

# Script d'installation pour préparer l'environnement PySpark
echo "=== Installation des dépendances pour Apache Spark ==="

# 1. Vérification de Python et pip
if ! command -v python3 &> /dev/null; then
    echo "Python3 n'est pas installé. Veuillez l'installer."
    exit 1
fi

if ! command -v pip &> /dev/null; then
    echo "pip n'est pas installé. Installation..."
    python3 -m ensurepip --upgrade
fi

# 2. Installation de PySpark
echo "Installation de PySpark via pip..."
# Se déplacer dans le dossier du script pour trouver requirements.txt
cd "$(dirname "$0")" || exit 1
pip install -r requirements.txt

# 3. Vérification de Java (Spark nécessite Java 8, 11 ou 17)
if ! command -v java &> /dev/null; then
    echo "Java n'est pas installé. Spark en a besoin pour fonctionner."
    echo "Veuillez installer OpenJDK (ex: sudo apt install default-jre)."
    exit 1
else
    java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo "Java est installé (version $java_version)."
fi

echo "=== Configuration terminée ==="
echo "Vous pouvez maintenant lancer Spark avec ./run_spark.sh"
