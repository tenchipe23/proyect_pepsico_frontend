FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/vehicle-exit-pass-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/application.yml /app/application.yml

EXPOSE 8080

ENTRYPOINT ["java", "-Dmanagement.metrics.enable.process.cpu=false", "-Dmanagement.metrics.enable.system.cpu=false", "-Dmanagement.metrics.enable.processor=false", "-Dspring.autoconfigure.exclude=org.springframework.boot.actuate.autoconfigure.metrics.SystemMetricsAutoConfiguration", "-jar", "app.jar"]
