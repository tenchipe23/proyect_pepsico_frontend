FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY target/vehicle-exit-pass-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Djdk.management.container.cgroup.disabled=true -jar app.jar"]
