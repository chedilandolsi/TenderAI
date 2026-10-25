# Developer Workflow Rules

## Automatic Backend Restart
- **Rule**: Whenever any backend code (Java source files in `backend/src/main/java/**`, resources in `backend/src/main/resources/**`, or Maven dependencies in `backend/pom.xml`) is modified or updated, **always immediately restart the Spring Boot backend process** (`mvn spring-boot:run` or rebuild and launch) so the changes take effect and the live server is verified running without errors.
- Ensure the previous backend daemon task is killed cleanly before starting the new instance to avoid port 8080 conflicts.
