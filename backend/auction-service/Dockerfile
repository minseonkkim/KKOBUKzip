FROM openjdk:17-ea-11-jdk-slim
VOLUME /tmp
COPY ./build/libs/auction-service-0.0.1-SNAPSHOT.jar AuctionService.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "AuctionService.jar"]