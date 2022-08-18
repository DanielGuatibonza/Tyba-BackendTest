# TybaBackendTest - Daniel Guatibonza

## Creación de la base de datos

El presente proyecto hace uso de PostgreSQL como gestor de base de datos por lo cual es necesario seguir los siguientes pasos desde una terminal para crear la base de datos desde cero una vez se instalado este gestor localmente.

1. Ingresar a la consola de PostgreSQL con el superusuario `postgres` utilizando la contraseña configurada a la hora de la instalación del gestor.
   > psql -U postgres
2. Crear un nuevo usuario con contraseña para el manejo de la base de datos con permisos de superusuario.
   > CREATE USER db_tyba_user;
   > ALTER USER db_tyba_user WITH PASSWORD 'db_tyba_pass';
   > ALTER ROLE db_tyba_user WITH SUPERUSER;
3. Crear la nueva base de datos especificando el nuevo usuario como su propietario.
   > CREATE DATABASE db_tyba OWNER db_tyba_user;

Vale la pena resaltar que el nombre de usuario, contraseña y nombre de la base de datos especificados aquí corresponden con las credenciales de conexión configuradas en la URL del archivo de variables de entorno `.env`.

## Configuración inicial del proyecto

Antes de ejecutar el back-end, es necesario instalar todas las librerías utilizadas para lo cual basta con ejecutar el siguiente comando desde una terminal ubicada en la carpeta base.

    npm install

Posteriormente, se debe migrar la configuración del esquema de datos a la base de datos utilizando el ORM seleccionado; en este caso _Prisma_.

    npx prisma migrate dev --name init

## Ejecución

Por último, el servidor se puede ejecutar con el comando.

    npm start

En cuanto a las pruebas, estas hacen uso de Jest y se ejecutan con el comando.

    npm test

## Logout

No se desarrolla un servicio de logout ya que debe realizarse del lado del cliente al borrar el registro del token suministrado. Sin dicho token el usuario no podrá acceder a las funcionalidades que requieren de estar registrado; en este caso la búsqueda de restaurantes y el histórico.
