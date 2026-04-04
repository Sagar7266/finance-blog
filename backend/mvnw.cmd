@REM Maven Wrapper Script for Windows
@echo off
set JAVA_EXE=%JAVA_HOME%/bin/java.exe
if not exist "%JAVA_EXE%" set JAVA_EXE=java
%JAVA_EXE% -classpath ".mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%~dp0" org.apache.maven.wrapper.MavenWrapperMain %*
