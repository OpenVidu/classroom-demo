FROM node:lts-alpine3.12 as frontend-build

WORKDIR /classroom-demo

RUN apk update && \
    rm -rf /var/cache/apk/*

COPY ./pom.xml pom.xml
COPY ./src src

RUN cd src/angular/frontend && \
	npm install && \
	./node_modules/@angular/cli/bin/ng build --output-path ../../main/resources/static


FROM maven:3.6.3 as backend-build
WORKDIR /classroom-demo
COPY --from=frontend-build /classroom-demo/pom.xml pom.xml
COPY --from=frontend-build /classroom-demo/src/main src/main

RUN mvn clean install
RUN mvn -o package
RUN mv /classroom-demo/target/classroom-demo-*.war /classroom-demo/target/classroom-demo.war

FROM alpine:3.11

RUN apk update && \
    apk add openjdk8-jre && \
    apk add mysql mysql-client && \
    rm -rf /var/cache/apk/*

RUN mkdir -p /opt/classroom-demo
COPY --from=backend-build /classroom-demo/target/classroom-demo.war /opt/classroom-demo/classroom-demo.jar
# Entrypoint
COPY ./docker/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD /usr/local/bin/entrypoint.sh
