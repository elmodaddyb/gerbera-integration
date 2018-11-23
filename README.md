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
$ docker-compose -f docker-compose.ui.yml build --no-cache
$ docker-compose -f docker-compose.ui.yml up --abort-on-container-exit
```

This will launch all the containers and run the UI integration test suite.
The system aborts all containers when the **gerbera-ui** container exits upon
completion of the tests.

--------------------------

## Local Development

The `docker-compose.dev.yml` runs the **gerbera-core**, **selenium-hub**, and **chrome-node** to allow a developer to test
the **gerbera-core** and develop additional integration tests.

```
$ docker-compose -f docker-compose.dev.yml build
$ docker-compose -f docker-compose.dev.yml up
```

### Set environment variables

The local development requires the setting of a few environment variables to reference the webserver and selenium server

```
$ export HUB_HOST=localhost
$ export HUB_PORT=4444
```

The selenium server communicates with the **gerbera-core** over the docker network and therefore you must identify the internal
IP address of the **gerbera-core** to set the `GERBERA_BASE_URL` value.

```
$ docker inspect gerbera-core | jq -r '.[0].NetworkSettings.Networks | to_entries[] | .value.IPAddress'
    172.18.0.5
$ export GERBERA_BASE_URL=http://172.18.0.5:49152
```

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
$ docker build -t elmodaddyb/gerbera-core -f ./gerbera-core/Dockerfile.core .
$ docker run -p 49152:49152 \
   --net=gerbera \
   -v gerbera-media:/gerbera-media \
   --name gerbera-core \
   elmodaddyb/gerbera-core
```

## Gerbera ui

The **gerbera ui** docker container downloads the UI integration test suite, _based in NodeJS_
and runs the test suite.  The container relies on **gerbera-core** and other selenium containers
to run the UI test suite.

```
$ docker build -t elmodaddyb/gerbera-ui -f ./gerbera-ui/Dockerfile.ui .
$ docker run --net=gerbera --name gerbera-ui elmodaddyb/gerbera-ui
```

## Gerbera media

The **gerbera media** docker container downloads simple example `mp3` and `mp4` content
to allow for addition of the content to the **gerbera core** container.  The **gerbera ui**
test suite references this content to perform an integration test that asserts adding content
is successful.

```
$ docker build -t elmodaddyb/gerbera-media -f ./gerbera-media/Dockerfile.media .
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
capture the `"IPAddress"` as it is output by the `docker inspect` command.  The IPAddress is used to internally reference
the running **gerbera-core** value.

```
$ docker inspect gerbera-core | jq -r '.[0].NetworkSettings.Networks | to_entries[] | .value.IPAddress'

   172.18.0.3
```

We run the command inline below to generate the `GERBERA_BASE_URL`
```
$ export GERBERA_BASE_URL=http://$(docker inspect gerbera-core | jq -r '.[0].NetworkSettings.Networks | to_entries[] | .value.IPAddress'):49152
$ echo $GERBERA_BASE_URL

   http://172.23.0.4:49152
```
