### classroom-demo ###

cd ../src/angular/frontend

ng build --environment=container --output-path ../../main/resources/static

cd ../../../

mvn clean compile package -DskipTests=true

cp target/classroom-demo-1.0.0-beta.1.war docker/classroom-demo.war



### openvidu-server ###

# Copy openvidu-server project in docker build path except angular-cli project ('frontend' folder)
cd docker
rsync -ax --exclude='**/angular' ../../openvidu/openvidu-server .

# Build and package maven project
cd openvidu-server && mvn clean compile package -DskipTests=true

# Copy openvidu.server.jar in docker build path
cp target/openvidu-server-1.0.0-beta.1.jar ../openvidu-server.jar


cd ..

docker build -t openvidu/classroom-demo .

rm ./classroom-demo.war
rm ./openvidu-server.jar
rm -rf ./openvidu-server
