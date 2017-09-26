# Copy compiled openvidu-server.jar
cp ../../openvidu/openvidu-server/target/openvidu-server-"$1".jar ./openvidu-server.jar

### classroom-demo ###

cd ../src/angular/frontend

ng build --environment=container --output-path ../../main/resources/static

cd ../../../

mvn clean compile package -DskipTests=true

cp target/classroom-demo-"$1".war docker/classroom-demo.war

cd docker

docker build -t openvidu/classroom-demo .

rm ./classroom-demo.war
rm ./openvidu-server.jar
rm -rf ./openvidu-server
