# Dockerfile for Gerbera Media Home
# Purpose: Store Gerbera configuration in a separate
#          volume for testing
# Created by: Eamonn Buss
# Created on: 12/9/2018

##--------------------------------------
## Start with ubuntu image as the base
##--------------------------------------
FROM ubuntu:latest

##--------------------------------------
## Media download setup
##--------------------------------------
RUN useradd --system gerbera
RUN mkdir /gerbera-home
WORKDIR /gerbera-home
COPY ./config.default.xml ./
COPY ./config.streaming.xml ./
RUN chown gerbera:gerbera -Rv /gerbera-home
VOLUME /gerbera-home

##--------------------------------------
## Continue forever
##--------------------------------------
ENTRYPOINT ["tail", "-f", "/dev/null"]