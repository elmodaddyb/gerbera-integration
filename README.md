# gerbera-integration
Automated Integration Tests for Gerbera Media Server

# Gerbera network

The docker suite runs on a custom network to allow communication between containers.

> Create the Gerbera Docker Network

```
$ docker network create gerbera
```

# Gerbera core

## Build Docker `gerbera-core`

```
$ docker build --name gerbera-core -t elmodaddyb/gerbera-core -f Dockerfile.core .
```

## Run Docker `gerbera-core`

```
docker run -p 49152:49152 --net=gerbera --name gerbera-core elmodaddyb/gerbera-core
```

## Build Docker `gerbera-ui`

```
$ docker build --name gerbera-ui -t elmodaddyb/gerbera-ui -f Dockerfile.ui .
```

## Run Docker `gerbera-ui`

```
docker run --net=gerbera --name gerbera-ui elmodaddyb/gerbera-core
```

# Gerbera media

```
$ docker build --name gerbera-media -t elmodaddyb/gerbera-media -f Dockerfile.media .
```

## View the media VOLUME

```
$ docker run -it --entrypoint /bin/bash elmodaddyb/gerbera-media
```

# Docker Compose

The docker compose generates all containers and starts up the system for
integration test.

* Builds the **gerbera-core** container
* Builds the **gerbera-ui** container
* Builds the **gerbera-media** container
* Builds the **gerbera-upnp** container

```
$ docker-compose up
```

## Run the tests manually

```
$ docker network create grid
$ docker run -d -p 4444:4444 --net grid --name selenium-hub selenium/hub:3.141.59-bismuth
$ docker run -d --net grid -e HUB_HOST=selenium-hub -v /dev/shm:/dev/shm selenium/node-chrome:3.141.59-bismuth
$ docker run -d -p 49152:49152 --net grid --name gerbera-core elmodaddyb/gerbera-core
$ export HUB_HOST=localhost
$ export HUB_PORT=4444
```

Capture the IP address of the running **gerbera-core** by inspecting the container.  Using `jq` we can easily
capture the "IPAddress" as it is output by the `docker inspect` command.

```
$ docker inspect gerbera-core | jq -r .[0].NetworkSettings.Networks.grid.IPAddress

   172.23.0.4
```

We run the command inline below to generate the `GERBERA_BASE_URL`
```
$ export GERBERA_BASE_URL=http://$(docker inspect gerbera-core | jq -r .[0].NetworkSettings.Networks.grid.IPAddress):49152
$ echo $GERBERA_BASE_URL

   http://172.23.0.4:49152
```
