#!/bin/sh
cd frontend
ng build --output-path ../../main/resources/static
cd ../../../
mvn clean package