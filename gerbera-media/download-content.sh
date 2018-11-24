#!/bin/bash
# download-content.sh
# Created By: Eamonn Buss
# Created On: 11/24/2018
# Purpose: Download media to /gerbera-media
#          for use with integration testing

##--------------------------------------
## Media content for testing
##--------------------------------------
MEDIA_PATH=/gerbera-media
declare -a files=("https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                  "https://sample-videos.com/audio/mp3/crowd-cheering.mp3"
                  "https://archive.org/download/testmp3testfile/mpthreetest.mp3"
                  )

download_file () {
    url=$1
    dir=$2
    file_name=${url##*/}
    if [ ! -e "$dir/$file_name" ]; then
        echo "Downloading to: $dir/$file_name"
        wget -P $dir $url
    else
        echo "File exists: $dir/$file_name"
    fi
}

##--------------------------------------
## Download content to MEDIA_PATH
##--------------------------------------
for i in "${files[@]}"
do
   download_file "$i" "$MEDIA_PATH"
done

##--------------------------------------
## Continue forever
##--------------------------------------
tail -f /dev/null