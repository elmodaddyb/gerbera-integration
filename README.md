# gerbera-integration
Automated Integration Tests for Gerbera Media Server

### Build the Docker

> Instructions are similar for each distribution.

```
$ docker build --no-cache -t elmodaddyb/gerbera-ubuntu -f Dockerfile.ubuntu .
```

### Run the Docker

```
docker run -p 49152:49152 --net=bridge elmodaddyb/gerbera-ubuntu
```
