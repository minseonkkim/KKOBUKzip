FROM openjdk:17-ea-11-jdk-slim
VOLUME /tmp
COPY ./build/libs/eureka-service-0.0.1-SNAPSHOT.jar EurekaService.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "EurekaService.jar"]