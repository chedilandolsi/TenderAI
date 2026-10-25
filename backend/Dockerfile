# Multi-stage Dockerfile for TenderAI Spring Boot Backend
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application
COPY src ./src
RUN mvn clean package -DskipTests

# Production image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create unprivileged application user
RUN groupadd -r tenderai && useradd -r -g tenderai tenderai

COPY --from=build /app/target/tenderai-backend-1.0.0.jar app.jar
RUN chown tenderai:tenderai app.jar

USER tenderai
EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
