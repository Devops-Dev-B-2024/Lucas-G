# TP2 - DOCKER 

## DOCKER RUN ONLY

### a. Récupérer l'image sur le docker hub (httpd ou nginx)

```
docker pull nginx
```
![docker pull nginx](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/ea3571bd-f2bb-425a-a36a-32bc6416c579)

### b. Utiliser un commande pour verifier que vous disposez bien de l'image en local

```
docker images 
```

![docker images](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/e77a4995-817b-4ff3-bbfc-56ff283747f0)

### c. Créer un fichier dans votre repo local ./html/index.html qui contient "Hello World"

![hello world](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/19d11062-b366-45e8-a2fd-de28afb4165d)

### d. Demarrer un nouveau container et servir la page html créée precedemment à l'aide d'une référence absolue

```
docker run --name TP2 -d -p 8080:80 -v C:/Users/LGU/Desktop/Ecole/DevOps/Lucas-G/TP_DOCKER_1/html/index.html:/usr/share/nginx/html/index.html nginx
```

### e. Supprimer le container

```
docker stop TP2
docker rm TP2
```

### f. Relancer le même container sans l'option -v puis utilisez la commande cp pour servir votre fichier (docker cp ARGS)

```
docker run --name TP2 -d -p 80:80 nginx
docker cp ./html/index.html TP2:/usr/share/nginx/html/index.html
```
# Builder une image 

### a. A l'aide d'un Dockerfile, créer une image qui permet d'executer un serveur web (apache, nginx...)

![dockerfile](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/dd5ea61d-02b0-4b2d-bf90-455d45418277)
![dockerbuild](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/da83f919-9c30-47ec-a99c-d7c7f4f40871)

### b. Executer cette nouvelle image de manière à servir .html/index.html

```
docker run --name tp2 -p 80:80 tp2
```

### c. Quelles différences observez-vous entre les questions 3 et 4, trouvez les avantages & inconvénients de chaque procédure (mount volume VS copy)

- Chaque lancement de l'image nécessite de spécifier tous ses paramètres à nouveau.
- L'utilisation d'un Dockerfile simplifie le lancement de l'image, car la plupart des paramètres et commandes sont préconfigurés; il suffit de lancer l'image et de définir les ports.

# Utiliser une base de donnée dans un container Docker

### a. Récuperer les images mysql (ou mariadb) et phpmyadmin depuis le Docker Hub

```
docker pull mysql
docker pull phpmyadmin
```
### b. Executer 2 containers à partir des images. Lancer phpmyadmin (conteneurisé et publié sur un port) et ajoutez une table via l'interface

```
docker network create tp_docker
docker run --name tp_mysql -d --network=tp_docker -e MYSQL_ROOT_PASSWORD=root mysql
docker run --name tp_phpmyadmin -d --network=tp_docker -e PMA_HOST=tp_mysql -p 8080:80 phpmyadmin/phpmyadmin
```
- Accéder à phpMyAdmin en utilisant l'URL http://localhost:8080 et les identifiants que vous avez définis précédemment.

![connexion](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/fcc835dc-4ac0-4e8b-9f13-074c322237c1)

- Créer une base de données puis faîtes la création d'une table en renseignant des champs

![phpmyad](https://github.com/Devops-Dev-B-2024/Lucas-G/assets/94311330/f4df7dc5-47f9-404c-84da-4dac8fb2329d)

