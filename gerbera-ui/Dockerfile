# Dockerfile for Gerbera UI Test
# Purpose: Run the UI tests to verify Gerbera Server container
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
RUN apt-get install -y git \
  wget \
  jq

##--------------------------------------
## Download Gerbera Integration Project
##--------------------------------------
ARG GIT_CMD_UI
RUN $GIT_CMD_UI

##--------------------------------------
## Run the UI Testing
##--------------------------------------
WORKDIR /gerbera-integration/gerbera-ui
RUN npm install
RUN chmod 744 ./wait-for-grid.sh
ENTRYPOINT [ "/gerbera-integration/gerbera-ui/wait-for-grid.sh"]
CMD ["npm", "run", "test"]
