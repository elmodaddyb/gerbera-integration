# Dockerfile for Gerbera UPNP Test
# Purpose: Run the UPNP test to verify Gerbera container
# Created by: Eamonn Buss
# Created on: 11/18/2018

##--------------------------------------
## Start with NodeJS
##--------------------------------------
FROM node

##--------------------------------------
## Install Testing Tools
##--------------------------------------
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository main
RUN apt-get install -y git

##--------------------------------------
## Download Gerbera Integration Project
##--------------------------------------
ARG INT_GIT_CMD
RUN $INT_GIT_CMD

##--------------------------------------
## Run the UPNP Testing
##--------------------------------------
WORKDIR /gerbera-integration/gerbera-upnp
RUN npm install
ENTRYPOINT ["npm", "run", "test"]
