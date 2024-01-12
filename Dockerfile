#Etapa de compilación:
# Define la imagen base
FROM openjdk:latest

# Crea un directorio de trabajo para la aplicación
WORKDIR /ReJe-crudspringboot

# Copia el archivo jar de la aplicación al directorio de trabajo
COPY target/crud-0.0.1-SNAPSHOT.jar ./

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3500

# Define el comando que se ejecuta al iniciar el contenedor
CMD ["java", "-jar", "crud-0.0.1-SNAPSHOT.jar"]