# ==========================
# Stage 1: Build the app
# ==========================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Create and set working directory
WORKDIR /app

# Copy Maven project files
COPY pom.xml .
COPY src ./src

# Build the app (creates the JAR file)
RUN mvn clean package -DskipTests

# ==========================
# Stage 2: Run the app
# ==========================
FROM eclipse-temurin:17-jdk

# Create working directory in the runtime image
WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
