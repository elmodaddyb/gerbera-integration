# gerbera-integration
Automated Integration Tests for Gerbera Media Server

Read the [documentation](docs/index.md) for details on working 
with the Gerbera Integration Suite

# Quick UI Test

```
// Build the docker containers
$ docker-compose -f docker-compose.ui.yml build

// Run the test suite
$ docker-compose -f docker-compose.ui.yml up --abort-on-container-exit
```