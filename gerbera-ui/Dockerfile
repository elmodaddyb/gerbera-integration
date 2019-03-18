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
ARG INT_GIT_CMD
RUN $INT_GIT_CMD

##--------------------------------------
## Run the UI Testing
##--------------------------------------
WORKDIR /gerbera-integration/gerbera-ui
RUN npm install
RUN chmod 744 ./wait-for-grid.sh
ENTRYPOINT [ "/gerbera-integration/gerbera-ui/wait-for-grid.sh"]
CMD ["npm", "run", "$UI_TEST_CMD"]
