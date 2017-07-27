FROM java:8
VOLUME /tmp
ADD openvidu-sample-app-1.0.0-beta.1.war openvidu-sample-app.war
ADD wrapper.sh wrapper.sh
RUN bash -c 'chmod +x /wrapper.sh'
RUN bash -c 'touch /openvidu-sample-app.war'
ENTRYPOINT ["/bin/bash", "/wrapper.sh"]
