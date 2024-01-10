#Etapa de compilación:
# Se utiliza la imagen de maven con JDK 11 como base para construir la aplicación.
FROM maven:3.8.4-openjdk-11 AS builder

# Se establece el directorio de trabajo en la imagen.
WORKDIR /ReJe-crudspringboot

# Se copian todos los archivos del directorio actual (del contexto de construcción) al
# directorio de trabajo en la imagen.
COPY . .

# Se ejecuta el comando Maven para limpiar y empaquetar la aplicación.
RUN mvn clean package

# Etapa de ejecución del proyecto:
# Se inicia una nueva etapa utilizando la imagen base de OpenJDK 11.
FROM openjdk:11.0.11-jdk

# Se copia el archivo JAR generado por la compilación en la etapa anterior 
#al directorio de trabajo en la nueva imagen.
COPY --from=builder /ReJe-crudspringboot/target/*.jar ReJe-crudspringboot-0.0.1-SNAPSHOT.jar

# Se expone el puerto 3000 del contenedor, que presumiblemente es 
#el puerto en el que la aplicación escucha las conexiones.
EXPOSE 3500

# Comando de entrada para ejecutar la aplicación cuando se inicia el contenedor.
CMD ["java", "-jar", "app.jar"]

#Prueba para realizar el pull request repositorio termomentro #4