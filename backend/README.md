# AI-Powered ATS Backend

This is the Spring Boot backend for the AI-Powered ATS project.

## Requirements
- Java 21
- Maven (or use the provided `./mvnw` wrapper)
- Docker & Docker Compose (for local database/redis)

## Running Locally

1. Set up your environment variables by copying `.env.example` to `.env` in the root of the project.
   ```bash
   cp ../.env.example ../.env
   ```
2. Start the required infrastructure (Postgres, Redis) using Docker Compose from the root directory:
   ```bash
   cd ..
   docker-compose up -d postgres redis
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or to build and run the JAR:
   ```bash
   ./mvnw package -DskipTests
   java -jar target/api-0.0.1-SNAPSHOT.jar
   ```

## Running entirely with Docker
You can spin up the entire stack (Frontend, Backend, DB, Redis) from the root directory:
```bash
docker-compose up -d --build
```

## Available Endpoints
- **Health Check**: `http://localhost:8080/actuator/health`
- **Application Info**: `http://localhost:8080/actuator/info`

## Environment Variables
The application expects the following variables to connect to the database (defaults are set in `application.yml` and `docker-compose.yml` but credentials must be provided via `.env`):
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
