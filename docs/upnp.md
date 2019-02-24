## UPNP Test Suite

The `docker-compose.upnp.yml` generates all containers and starts up the system for
Gerbera Media Server UPNP integration test.

* Builds the **gerbera-core** container
* Builds the **gerbera-upnp** container
* Builds the **gerbera-media** container
* Builds the **gerbera-home** container

```
// Build the docker containers
$ docker-compose -f docker-compose.upnp.yml build

// Run the test suite
$ docker-compose -f docker-compose.upnp.yml up --abort-on-container-exit
```

This will launch all the containers and run the UPNP integration test suite found
in the folder `gerbera-upnp/test`.
The system aborts all containers when the **gerbera-upnp** container exits upon
completion of the tests.

> Try using the [Gerbera CLI](cli.md) ---> `gi test upnp`

--------------------------