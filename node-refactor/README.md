# Proyecto Node.js con Express y PostgreSQL

Este proyecto es una aplicación Node.js que utiliza Express como framework web y PostgreSQL como base de datos.

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos en tu sistema:

- Node.js: [Descargar e instalar Node.js](https://nodejs.org)
- PostgreSQL: [Descargar e instalar PostgreSQL](https://www.postgresql.org)

## Configuración

Sigue estos pasos para configurar el proyecto:

1. Clona este repositorio en tu máquina local o descárgalo como archivo ZIP.

2. Abre una terminal y navega hasta el directorio raíz del proyecto.

3. Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```
npm install
```

4. Crea una base de datos PostgreSQL y asegúrate de tener los datos de conexión (nombre de la base de datos, nombre de usuario y contraseña).

5. Actualiza los archivos de configuración apropiados con la información de tu base de datos PostgreSQL. Esto puede incluir archivos como `config.js`, `database.js` o cualquier otro archivo de configuración relevante para tu proyecto.

6. Ejecuta el siguiente comando para iniciar la aplicación:

```
npm run start
```

7. La aplicación ahora está en funcionamiento. Puedes acceder a ella a través de tu navegador web visitando `http://localhost:8080` (o el puerto que hayas configurado en tu archivo de configuración).

## Endpoints

La aplicación expone los siguientes endpoints:

- `GET /listings/:id`: Obtiene un listado específico desde la base de datos.

Ejemplo de solicitud:

```bash
curl --location 'http://localhost:8080/listings/1'
```

- `PUT /update/:id`: Modifica un listado junto con sus steps en la base de datos.

Ejemplo de solicitud:

```bash
curl --location --request PUT 'http://localhost:8080/update/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJzaWRhcnlJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTVBMT1lFRSJdfQ.JVYcVGPFBSKX4crbwIT_HWo01_C0bdMjdYAbQOpqbHk' \
--data '{
      "companyName": "Nueva Empresa",
      "name": "Nuevo Nombre",
      "description": "Nueva Descripción",
      "info": "Nueva Información",
      "state": "Nuevo Estado",
      "gs": "Nuevo GS",
      "criteria": "Nuevos Criterios",
      "steps": [
        {
          "id": -1,
          "flowId": 123,
          "name": "Paso 1",
          "step": 1
        },
        {
          "id": -2,
          "flowId": 456,
          "name": "Paso 2",
          "step": 2
        }
      ]
    
  }'
```
- `POST /create/:id`: Pasa un archivo CSV y crea steps de manera masiva en la base de datos

```
curl --location 'http://localhost:8080/create/1' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJzaWRhcnlJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTVBMT1lFRSJdfQ.JVYcVGPFBSKX4crbwIT_HWo01_C0bdMjdYAbQOpqbHk' \
--form 'file=@"file.csv"'
```

Ten en cuenta que algunos endpoints requieren autenticación utilizando JSON Web Tokens (JWT). Asegúrate de incluir el token de acceso válido en el encabezado de la solicitud.

## Uso de JWT

La aplicación utiliza JSON Web Tokens (JWT) para autenticar y autorizar las solicitudes. Para acceder a los endpoints protegidos, debes incluir un token de acceso válido en el encabezado de la solicitud.

La clave utilizada para firmar y verificar los tokens es "challenge-gdesimone". Asegúrate de incluir este valor al generar y verificar los tokens JWT en tu código.

Aclaracion: por el solo hecho de ser un challenge se sube a github el archivo .env que guarda la key para leer los tokens. En un proyecto real deberia este archivo estar en el file gitignore