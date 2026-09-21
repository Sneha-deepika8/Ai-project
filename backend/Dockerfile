FROM maven:3.9-eclipse-temurin-22 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:22-jre-jammy

WORKDIR /app

RUN groupadd -r finpulse && useradd -r -g finpulse finpulse

COPY --from=build /app/target/*.jar app.jar

RUN chown finpulse:finpulse app.jar

USER finpulse

EXPOSE 8088

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]