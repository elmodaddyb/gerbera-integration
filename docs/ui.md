## UI Test Suite

The `docker-compose.ui.yml` generates all containers and starts up the system for
Gerbera Web UI integration test.

* Builds the **gerbera-core** container
* Builds the **gerbera-ui** container
* Builds the **gerbera-media** container
* Builds the **gerbera-home** container
* Starts the **selenium-hub** container
* Starts the **chrome node** container

```
// Build the docker containers
$ docker-compose -f docker-compose.ui.yml build

// Run the test suite
$ docker-compose -f docker-compose.ui.yml up --abort-on-container-exit
```

This will launch all the containers and run the UI integration test suite.
The system aborts all containers when the **gerbera-ui** container exits upon
completion of the tests.

> Try using the [Gerbera CLI](cli.md) ---> `gi test ui`

--------------------------