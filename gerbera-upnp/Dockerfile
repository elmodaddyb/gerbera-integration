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
ARG GIT_CMD_UI
RUN $GIT_CMD_UI

##--------------------------------------
## Run the UPNP Testing
##--------------------------------------
WORKDIR /gerbera-integration/gerbera-upnp
RUN npm install
ENTRYPOINT ["npm", "run", "test"]
