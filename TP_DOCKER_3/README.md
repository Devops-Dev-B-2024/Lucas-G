# Récupérer le code source de votre API lors du module API


2. **Créer un Dockerfile qui permet de lancer une application NodeJS (v18-alpine ou v20)**

    ![dockerfile](https://github.com/Dayql/FormulaireAPI/assets/94311330/2994d5f6-9d61-4656-9774-d5994731db0c)

. **Construction de l'image Docker de l'application**

   ![Construction de l'image](https://github.com/Dayql/FormulaireAPI/assets/94311330/50055d0f-6bca-4e66-a09f-e1641983f6c6)

3. **Utiliser Docker pour lancer une image de base de données (MySQL ou MaraDB)**

   ![Démarrage MySQL](https://github.com/Dayql/FormulaireAPI/assets/94311330/772e525a-6e94-4765-83ab-4d4c388aac28)

4. **Adapter vos fichiers de connexion à la base de données pour utiliser une base mysql plutôt que sqlite3 (si vous aviez utilisé sqlite) Rebuildez votre image docker et relancez un container, vérifiez que vous arrivez à utiliser l'app**

-  **Création du réseau Docker**

   ![Création réseau](https://github.com/Dayql/FormulaireAPI/assets/94311330/c17f8b03-58f4-45a8-9a94-62cda3d78c9b)

-  **Démarrage de l'application avec le réseau**

   ![Démarrage de l'application](https://github.com/Dayql/FormulaireAPI/assets/94311330/c33963e1-8c67-4689-b1a3-41b3f5896732)

-  **Démarrage de MySQL avec le réseau**

   ![MySQL avec réseau](https://github.com/Dayql/FormulaireAPI/assets/94311330/04fdd927-7e1f-471f-83f2-0974616b10a8)

- **Vérification de l'accessibilité de l'application**

   ![Vérification 1](https://github.com/Dayql/FormulaireAPI/assets/94311330/77df04df-88e7-42f7-8fbc-8768ae1f9832)

   ![Vérification 2](https://github.com/Dayql/FormulaireAPI/assets/94311330/c876513b-1950-417c-85c2-75b02ca616c8)

5. **Créer un docker-compose.yml pour avoir 2 services (node et db) node doit se baser sur le build (votre Dockerfile) db doit se baser sur une image mariadb ou mysql**

   ![Docker Compose](https://github.com/Dayql/FormulaireAPI/assets/94311330/c2b4763f-0493-426b-baae-5b0e6abd3057)

   ![Docker Compose Up](https://github.com/Dayql/FormulaireAPI/assets/94311330/a856f34a-f692-4643-a3de-198e7afbe996)

## Questions

- **Que se passe-t-il si un de mes ports publiés est déjà utilisé ?**

  Si un port est déjà utilisé sur la machine, Docker ne peut pas attribuer ce même port au conteneur, ce qui provoque une erreur indiquant que le port est déjà en usage.

- **Quelle option de la commande npm install permet de n'installer que les dépendances de production ?**

  L'option `--production` de `npm install` permet d'installer uniquement les dépendances nécessaires pour l'exécution de l'application, excluant celles requises uniquement pour le développement.

- **Pourquoi installer uniquement les dépendances de production ?**

  Il est recommandé d'installer uniquement les dépendances de production pour alléger l'image Docker, accélérer le déploiement et minimiser les risques de sécurité liés à des packages non nécessaires en production.

- **Comment peut-on analyser la sécurité d'une application comme celle-ci ?**

  Pour analyser la sécurité d'une image Docker, on peut utiliser la commande `docker scan <nom_image>`. Pour les dépendances de l'application Node.js, `npm audit` est utilisé pour vérifier les vulnérabilités.

- **Pourquoi mon conteneur Node n'arrive-t-il pas à communiquer avec ma base de données en utilisant "localhost" comme hostname ?**

  Si l'application Node est contenue dans un conteneur et la base de données dans un autre, utiliser "localhost" ne fonctionnera pas pour établir une connexion. Il faut utiliser le nom du service Docker Compose du conteneur de la base de données, car ce nom sert de hostname au sein du réseau Docker.