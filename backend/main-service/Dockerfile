FROM openjdk:17-ea-11-jdk-slim
VOLUME /tmp
COPY ./build/libs/main-service-0.0.1-SNAPSHOT.jar MainService.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "MainService.jar"]