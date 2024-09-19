FROM openjdk:17-slim

# SSH 클라이언트, Git 및 curl 설치
RUN apt-get update && apt-get install -y git openssh-client curl && rm -rf /var/lib/apt/lists/*

VOLUME /tmp
COPY ./build/libs/config-service-0.0.1-SNAPSHOT.jar ConfigService.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "ConfigService.jar"]