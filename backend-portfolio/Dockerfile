# Image production của backend. Dùng bởi .github/workflows/backend.yml (push lên GHCR).
# Build local:  docker build -t portfolio-backend backend-portfolio
# Chạy local:   docker run --rm -p 8080:8080 -e SPRING_DATASOURCE_URL=... portfolio-backend

# ---- Stage 1: build jar bằng Gradle Wrapper ----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /workspace

# Copy file build trước src/ để tầng tải Gradle + dependency được cache khi chỉ code đổi.
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon -q > /dev/null

COPY src src
RUN ./gradlew bootJar --no-daemon -q \
 && cp "$(find build/libs -name '*.jar' ! -name '*-plain.jar' | head -n 1)" app.jar \
 && java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

# ---- Stage 2: chỉ JRE + các layer của jar, chạy bằng user thường ----
FROM eclipse-temurin:25-jre
RUN groupadd --system app && useradd --system --gid app --no-create-home app
WORKDIR /app

# Thứ tự từ ít đổi → hay đổi để pull image mới chỉ tải layer application.
COPY --from=build /workspace/extracted/dependencies/ ./
COPY --from=build /workspace/extracted/spring-boot-loader/ ./
COPY --from=build /workspace/extracted/snapshot-dependencies/ ./
COPY --from=build /workspace/extracted/application/ ./

USER app
EXPOSE 8080
# Tùy chỉnh JVM qua biến môi trường JAVA_TOOL_OPTIONS (ví dụ -XX:MaxRAMPercentage=75).
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
