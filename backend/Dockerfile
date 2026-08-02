FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Install curl for container healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable and download dependencies (cached in docker layer)
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Expose port
EXPOSE 8080

# Run Spring Boot app with live reload support
CMD ["./mvnw", "spring-boot:run", "-DskipTests"]
