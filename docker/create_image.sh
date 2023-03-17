#!/bin/bash -x

VERSION=$1
if [[ ! -z $VERSION ]]; then
    cd ..
    docker build --pull --no-cache --rm=true -f docker/Dockerfile -t openvidu/openvidu-classroom-demo:$VERSION .
else
    echo "Error: You need to specify a version as first argument"
fi
