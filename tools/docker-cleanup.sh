#!/usr/bin/env bash
## -----------------------------------------
## Docker Cleanup Script
## Purpose: To simplify cleanup of various docker containers/images/volumes
## Created: 12/16/2018
## Created By: Eamonn Buss
## -----------------------------------------

function dangling {
    if [[ $(docker images -f "dangling=true" -q) ]]; then
        docker rmi $(docker images -f "dangling=true" -q)
    else
        echo "None found matching --> dangling=true"
    fi
}

function exited {
    if [[ $(docker ps -a -q -f status=exited) ]]; then
        docker rm -v $(docker ps -a -q -f status=exited)
    else
        echo "None found matching --> status=exited"
    fi
}

function rmi {
    if [[ $(docker images $1 -q) ]]; then
        docker rmi $(docker images $1 -q)
    else
        echo "None found matching --> $1"
    fi
}

function rmv {
    if [[ $(docker volume ls | grep $1) ]]; then
        docker volume rm $1
    else
        echo "None found matching --> $1"
    fi
}

function help {
    printf "\nDocker Cleanup Script\n\n"
    printf "  Syntax:\n\n"
    printf "    docker-cleanup.sh <command>[exited,dangling,core,ui,home,media]\n\n"
    printf "  Example:\n\n"
    printf "    docker-cleanup.sh exited\n\n"
}

case "$1" in
    exited)
        exited
        ;;
    dangling)
        dangling
        ;;
    core)
        rmi gerbera-integration_core
        ;;
    ui)
        rmi gerbera-integration_ui
        ;;
    home)
        rmi gerbera-integration_home
        rmv gerbera-integration_gerbera-home
        ;;
    media)
        rmi gerbera-integration_media
        rmv gerbera-integration_gerbera-media
        ;;
    *)
        help
        ;;
esac