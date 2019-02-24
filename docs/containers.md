# In Depth - Containers

### gerbera-core

The **gerbera-core** container runs the Gerbera Media Server.  The container
is built from source code retrieved during the docker build.

To run the **gerbera-core** in stand-alone mode requires a few volumes to exist.

* **gerbera-home**
* **gerbera-media**

```bash
$ docker run -it \
  -v gerbera-integration_gerbera-home:/gerbera-home \
  -v gerbera-integration_gerbera-media:/gerbera-media \
  --entrypoint /bin/bash \
  gerbera-integration_core
```
-----------------------------------

### gerbera-home

The **gerbera-home** container runs a volume that holds the Gerbera Media Server configuration
and database files.  This container provides the ability to stage different
configuration of the Gerbera Media Server to run various tests.

The volume `gerbera-integration_gerbera-home` is created and persists beyond the runtime execution.

To run the **gerbera-home** in stand-alone mode you can execute a `bash` entrypoint.
You can view the contents of the `/gerbera-home` directory in the running container.

```bash
$ docker run -it \
  -v gerbera-integration_gerbera-home:/gerbera-home \
  --entrypoint /bin/bash \
  gerbera-integration_home
```

The command above launches the **gerbera-home** container with the volume assigned to `/gerbera-home`. 
You can view the contents of the volume.

```bash
root@0e1154c0ba89:/gerbera-home# ls
config.default.xml  gerbera.db  gerbera.db-journal  gerbera.html
root@0e1154c0ba89:/gerbera-home#
```
-----------------------------------

### gerbera-media

The **gerbera-media** container runs a volume that holds sample media files
for the Gerbera Media Server to access.  These files are downloaded at runtime
of the container.

The volume `gerbera-integration_gerbera-media` is created and persists beyond the runtime execution.

To run the **gerbera-media** in stand-alone mode you can execute a `bash` entrypoint.
You can view the contents of the `/gerbera-home` directory in the running container.

```bash
$ docker run -it \
  -v gerbera-integration_gerbera-media:/gerbera-media \
  --entrypoint /bin/bash \
  gerbera-integration_media
```

The command above launches the **gerbera-media** container with the volume assigned to `/gerbera-home`. 
You can view the contents of the volume.

```bash
root@c5f3f8bf86e8:/gerbera-media# ls
big_buck_bunny_720p_1mb.mp4  crowd-cheering.mp3
root@c5f3f8bf86e8:/gerbera-media#
```
-----------------------------------

### gerbera-ui

The **gerbera-ui** container runs a test suite for the Gerbera UI

* Downloads the UI integration tests
* Launches the test suite
* Exits upon completion

The **gerbera-ui** container requires all running containers for the integration
test.  Therefore it is recommended to run the **gerbera-ui** container as part of the
`docker-compose.ui.yml` process.

-----------------------------------

### gerbera-upnp

The **gerbera-upnp** container runs a test suite for the Gerbera UPNP

* Downloads the Gerbera integration tests
* Launches the **gerbera-upnp** test suite
* Exits upon completion

The **gerbera-upnp** container requires additional running containers for the integration
test.  Therefore it is recommended to run the **gerbera-upnp** container as part of the
`docker-compose.upnp.yml` process.


# Docker Cleanup

In the process of building containers many dangling images may be left on the system.

Take a look at the [Gerbera Integration CLI](./cli.md) that provides helper scripts for cleanup and maintenance of the 
Gerbera Integration Suite.
