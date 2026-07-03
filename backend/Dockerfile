# STAGE 1: Build the application
# We use a Maven image with Java 17 to compile and package our application.
FROM maven:3.9.4-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies
# This is done before copying the source code to cache dependencies if the pom.xml hasn't changed.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the actual source code
COPY src ./src

# Package the application (skip tests for faster build during development/learning)
RUN mvn clean package -DskipTests

# STAGE 2: Run the application
# We use a smaller, lightweight JRE (Java Runtime Environment) image just to run the compiled app.
# This makes the final Docker image much smaller and more secure.
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built .jar file from the 'builder' stage into this new stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the Spring Boot application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
