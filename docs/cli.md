# Gerbera Integration CLI

A python based CLI exists to allow for fast use of the Gerbera Integration suite.

## Setup the BASH alias

:: TODO

## Commands

### Cleanup Docker Containers

Cleanup the **gerbera** containers

```bash
$ gi clean ui
$ gi clean core
$ gi clean media
$ gi clean home
```

Cleanup the docker containers

```bash
$ gi clean exited
$ gi clean dangling
```

### Compose Docker Containers

Build the Gerbera DEV containers

```bash
$ gi compose dev --options=build
```

Run the Gerbera DEV containers
> This will run forever

```bash
$ gi compose dev --options=up
```

Build the Gerbera UI containers

```bash
$ gi compose ui --options=build
```

Run the Gerbera ui containers
> This will run the UI test suite and exit

```bash
$ gi compose ui --options=up
```