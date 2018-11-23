# gerbera-integration
Automated Integration Tests for Gerbera Media Server

# Quick Start

## UI Test Suite

The `docker-compose.ui.yml` generates all containers and starts up the system for
Gerbera Web UI integration test.

* Builds the **gerbera-core** container
* Builds the **gerbera-ui** container
* Builds the **gerbera-media** container
* Starts the **selenium-hub** container
* Starts the **chrome node** container

```
$ docker-compose -f docker-compose.ui.yml up --abort-on-container-exit
```

This will launch all the containers and run the UI integration test suite.
The system aborts all containers when the **gerbera-ui** container exits upon
completion of the tests.

--------------------------

# In Depth - Containers

## Gerbera network

The docker suite runs on a custom network to allow communication between containers.

```
$ docker network create gerbera
```

## Gerbera core

The **gerbera core** docker container downloads the Gerbera Media Server source code and
compiles the server, along with installing all dependencies to run the Gerbera Media Server.

```
$ docker build -t elmodaddyb/gerbera-core -f Dockerfile.core .
$ docker run -p 49152:49152 --net=gerbera --name gerbera-core elmodaddyb/gerbera-core
```

## Gerbera ui

The **gerbera ui** docker container downloads the UI integration test suite, _based in NodeJS_
and runs the test suite.  The container relies on **gerbera-core** and other selenium containers
to run the UI test suite.

```
$ docker build -t elmodaddyb/gerbera-ui -f Dockerfile.ui .
$ docker run --net=gerbera --name gerbera-ui elmodaddyb/gerbera-ui
```

## Gerbera media

The **gerbera media** docker container downloads simple example `mp3` and `mp4` content
to allow for addition of the content to the **gerbera core** container.  The **gerbera ui**
test suite references this content to perform an integration test that asserts adding content
is successful.

```
$ docker build -t elmodaddyb/gerbera-media -f Dockerfile.media .
$ docker run -it -v gerbera-media:/gerbera-media --entrypoint /bin/bash elmodaddyb/gerbera-media
```

# In Depth - Manual Test Run

## Run the UI tests

The instructions below assume that you have successfully built all the containers.

```
$ docker network create gerbera
$ docker run -d -p 4444:4444 --net gerbera --name selenium-hub selenium/hub:3.141.59-bismuth
$ docker run -d --net gerbera -e HUB_HOST=selenium-hub -v /dev/shm:/dev/shm selenium/node-chrome:3.141.59-bismuth
$ docker run -d -p 49152:49152 -v gerbera-media:/gerbera-media --net gerbera --name gerbera-core elmodaddyb/gerbera-core
$ export HUB_HOST=localhost
$ export HUB_PORT=4444
```

Capture the IP address of the running **gerbera-core** by inspecting the container.  Using `jq` we can easily
capture the `"IPAddress"` as it is output by the `docker inspect` command.

```
$ docker inspect gerbera-core | jq -r .[0].NetworkSettings.Networks.gerbera.IPAddress

   172.23.0.4
```

We run the command inline below to generate the `GERBERA_BASE_URL`
```
$ export GERBERA_BASE_URL=http://$(docker inspect gerbera-core | jq -r .[0].NetworkSettings.Networks.gerbera.IPAddress):49152
$ echo $GERBERA_BASE_URL

   http://172.23.0.4:49152
```
