#!/bin/bash

java -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=container -jar /app.jar
