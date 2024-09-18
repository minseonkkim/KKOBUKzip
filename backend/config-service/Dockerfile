FROM openjdk:17-slim

# SSH 클라이언트 및 Git 설치
RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*

VOLUME /tmp
COPY ./build/libs/config-service-0.0.1-SNAPSHOT.jar ConfigService.jar
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "ConfigService.jar"]
