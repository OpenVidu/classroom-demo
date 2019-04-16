FROM ubuntu:16.04
MAINTAINER openvidu@gmail.com

# Install Kurento Media Server (KMS) 
RUN echo "deb [arch=amd64] http://ubuntu.openvidu.io/6.10.0 xenial kms6" | tee /etc/apt/sources.list.d/kurento.list \
	&& apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5AFA7A83 \
	&& apt-get update \
	&& apt-get -y install kurento-media-server \
	&& rm -rf /var/lib/apt/lists/*

COPY kms.sh /kms.sh

# Install Java
RUN apt-get update && apt-get install -y openjdk-8-jdk && rm -rf /var/lib/apt/lists/*

# Configure Supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

COPY openvidu-server.jar openvidu-server.jar
COPY classroom-demo.war app.jar
RUN sh -c 'touch /openvidu-server.jar'
RUN sh -c 'touch /app.jar'

## Add the init script to the image
ADD init.sh init.sh
RUN chmod +x /init.sh

## Add the wait script to the image
ADD wait.sh wait.sh
RUN chmod +x /wait.sh

RUN apt-get update
RUN apt-get install netcat-openbsd

EXPOSE 3000
EXPOSE 5000

# Exec supervisord
CMD ["/usr/bin/supervisord"]
