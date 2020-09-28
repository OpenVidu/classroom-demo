#!/bin/bash
pushd ../
export SOFTWARE_VERSION=$(grep -oPm1 "(?<=<version>)[^<]+" "pom.xml")

docker build -f docker/Dockerfile -t openvidu/openvidu-classroom-demo .
docker tag openvidu/openvidu-classroom:latest openvidu/openvidu-classroom-demo:$SOFTWARE_VERSION