# Dockerfile for Gerbera Media Volume
# Purpose: Download test media to docker volume
#          for later testing
# Created by: Eamonn Buss
# Created on: 11/18/2018

##--------------------------------------
## Start with ubuntu image as the base
##--------------------------------------
FROM ubuntu:latest

##--------------------------------------
## Enable Ubuntu Repositories
##--------------------------------------
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository main

##--------------------------------------
## Install downloading tools
##--------------------------------------
RUN apt-get install -y curl

##--------------------------------------
## Media download setup
##--------------------------------------
WORKDIR /
COPY ./download-content.sh ./
RUN chmod 744 ./download-content.sh
RUN mkdir /gerbera-media
VOLUME /gerbera-media

##--------------------------------------
## Download content to composed volume
##--------------------------------------
ENTRYPOINT ["/download-content.sh"]
