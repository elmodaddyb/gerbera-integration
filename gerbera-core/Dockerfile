# Dockerfile for Gerbera Ubuntu Development
# Purpose: Create container and compile Gerbera source
#          expose ports to run gerbera runtime as a container
# Created by: Eamonn Buss
# Created on: 11/24/2018

##--------------------------------------
## Start with ubuntu image as the base
##--------------------------------------
FROM gerbera/gerbera-ci-base

ENV SHELL /bin/bash

##--------------------------------------
## Clone Gerbera GIT Repository
##--------------------------------------
RUN mkdir /gerbera
WORKDIR /gerbera
ARG CORE_GIT_CMD
RUN $CORE_GIT_CMD

RUN mkdir build
WORKDIR /gerbera/build

##--------------------------------------
## Install Google Test
##--------------------------------------
RUN sh ../gerbera/scripts/install-googletest.sh

##--------------------------------------
## Build & Install Gerbera
##--------------------------------------
RUN cmake ../gerbera -DWITH_TESTS=1 \
  -DWITH_MAGIC=1 -DWITH_MYSQL=0 -DWITH_CURL=1 \
  -DWITH_JS=1 -DWITH_TAGLIB=1 -DWITH_AVCODEC=1 \
  -DWITH_EXIF=1 -DWITH_LASTFM=0 -DWITH_SYSTEMD=0
RUN make
RUN make test ARGS=-V
RUN make install

##--------------------------------------
## Setup the Gerbera user
##--------------------------------------
RUN useradd --system gerbera
RUN mkdir /gerbera-home
RUN chown gerbera:gerbera -Rv /usr/local/share/gerbera
RUN chown gerbera:gerbera -Rv /gerbera-home
VOLUME /gerbera-home
USER gerbera

ENTRYPOINT $CORE_LAUNCH_CMD
EXPOSE 49152/tcp 1900/udp
