#!/bin/bash -x
set -eu -o pipefail

#############################################################
# Any function offered by this file assume that the path is #
# located at the root of repository classroom-demo          #
#############################################################

# CI flags
BUILD_FRONT=false
BUILD_BACK=false

# Environment variables
if [[ -n ${1:-} ]]; then
    case "${1:-}" in
    --build-front)
        BUILD_FRONT=true
        ;;
    --build-back)
        BUILD_BACK=true
        ;;
    *)
        echo "Unrecognized method $1"
        exit 1
        ;;
    esac
else
    echo "Must provide a method to execute as first parameter when calling the script"
    exit 1
fi

# -------------
# Build front
# -------------
if [[ "${BUILD_FRONT}" == true ]]; then
    rm -rf src/main/resources/static/*
    cd src/angular/frontend
    npm install --force
    npx ng build --output-path ../../../src/main/resources/static
fi

# -------------
# Build back
# -------------
if [[ "${BUILD_BACK}" == true ]]; then
    mvn clean compile package
fi
