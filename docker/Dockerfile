FROM alpine:3.17

# Install Java and MySQL
RUN apk update && \
    apk add openjdk11-jre && \
    apk add mysql mysql-client && \
    rm -rf /var/cache/apk/*

# Copy Java application
RUN mkdir -p /opt/classroom-demo
COPY ../target/classroom-demo-*.war /opt/classroom-demo/classroom-demo.war

# Copy entrypoint
COPY ./docker/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD /usr/local/bin/entrypoint.sh
