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
