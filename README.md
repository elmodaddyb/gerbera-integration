# gerbera-integration
Automated Integration Tests for Gerbera Media Server

### Build the Docker - Core

```
$ docker build --no-cache -t elmodaddyb/gerbera-ubuntu -f Dockerfile.ubuntu .
```

### Run the Docker - Core

```
docker run -p 49152:49152 --net=bridge elmodaddyb/gerbera-ubuntu
```

### Build the Docker - Media

```
$ docker build --no-cache -t elmodaddyb/gerbera-media -f Dockerfile.media .
```

#### View the media VOLUME

```
$ docker run -it --entrypoint /bin/bash elmodaddyb/gerbera-media
```

### Run Docker Compose

The docker compose generates all containers and starts up the system for
integration test.

* Builds the **gerbera-core** container
* Builds the **gerbera-ui-test** container
* Builds the **gerbera-media** container
* Builds the **gerbera-upnp** container

```
$ docker-compose up
```
