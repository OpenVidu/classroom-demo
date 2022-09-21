#!/bin/bash
if [ $# -eq 0 ]; then
    echo "No version argument provided. Usage: \"./create_image.sh X.Y.Z\""
    exit 1
fi

pushd ../

docker build -f docker/Dockerfile -t openvidu/openvidu-classroom-demo:"${1}" .