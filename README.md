# Práctica 13 - DSIkea: API REST con Node/Express

Alumnas:  
- Inés Garrote Fontenla alu0101512297@ull.edu.es  
- Godgith John alu0101463858@ull.edu.es  
- Ángela Zhouling Izquierdo Padrón alu0101480442@ull.edu.es

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi?branch=main)

# Informe

### Introducción
En esta práctica grupal hay que aplicar todo lo aprendido relacionado con typescript y el entorno de ejecución `Node.js`.

### Objetivos a lograr realizando esta práctica
Aprender acerca de la base de datos de basado en colecciones, en el que se usará `Mongoose`, que és una biblioteca de moedelado de objetos de `MongoDB` para `Node.js`. En el que se usa **Esquemas**(Mecanismo que da forma a un documento) y **Modelos**(Permite instanciar objetos de los esquemas)
Para interactuar con la base de datos, se usará las operaciones **CRUD**(Creat-Read-Update-Delete).   

Primero se debe descargar el **MongoDB**:
- Primero se descarga la versión [Community Server](https://www.mongodb.com/try/download/community)(que es un archico `tgz`)
```ts
[~()]$wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.8.tgz
--2024-04-09 09:55:26--  https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.8.tgz
Resolving fastdl.mongodb.org (fastdl.mongodb.org)... 13.224.115.58, 13.224.115.54, 13.224.115.61, ...
Connecting to fastdl.mongodb.org (fastdl.mongodb.org)|13.224.115.58|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 85283830 (81M) [application/gzip]
Saving to: ‘mongodb-linux-x86_64-ubuntu2204-7.0.8.tgz’
```
- Ahora se descomprime
```ts
[~()]$tar xzvf mongodb-linux-x86_64-ubuntu2204-7.0.8.tgz 
```
- Se crea un un nuevo directorio `mongodb-data`que MongoDB usará para almacenar todo lo necesario al ejecutar el servidor, incluyendo la información que almacenamos en nuestras bases de datos
```ts
[~()]$pwd
/home/usuario
[~()]$mkdir mongodb-data
```
- Ahora se arranca el servidor
```ts
[~()]$sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
```
- Para comprobar que el servidor funciona bien, se puede descargar [ MongoDB Shell](https://www.mongodb.com/try/download/shell)
```ts
[~()]$wget https://downloads.mongodb.com/compass/mongodb-mongosh_2.2.3_amd64.deb
--2024-04-09 09:58:43--  https://downloads.mongodb.com/compass/mongodb-mongosh_2.2.3_amd64.deb
Resolving downloads.mongodb.com (downloads.mongodb.com)... 3.160.231.70, 3.160.231.11, 3.160.231.46, ...
Connecting to downloads.mongodb.com (downloads.mongodb.com)|3.160.231.70|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 52976792 (51M) [application/octet-stream]
Saving to: ‘mongodb-mongosh_2.2.3_amd64.deb’
```
- Mientras se ejecuta esto en una terminal, abrimos otra terminal y lo descargamos
```ts
[~()]$sudo dpkg -i mongodb-mongosh_2.2.3_amd64.deb 
[sudo] password for usuario: 
Seleccionando el paquete mongodb-mongosh previamente no seleccionado.
(Leyendo la base de datos ... 110121 ficheros o directorios instalados actualmente.)
Preparando para desempaquetar mongodb-mongosh_2.2.3_amd64.deb ...
Desempaquetando mongodb-mongosh (2.2.3) ...
Configurando mongodb-mongosh (2.2.3) ...
Procesando disparadores para man-db (2.10.2-1) ...
```
- Por último para ejecutar el servidor se usa el comando
```ts
[~()]$mongosh 
```

### Ejercicios y su explicación
Hay que implementar un API REST, usando Node/Express, a través de varias operaciones(CRUD) para gestionar una tienda de muebles 
### Descripción de los requisitos del API
## Servidor
Primero se debe conectar el servidor de la base de datos que se ejecuta en nuestra máquina:
```ts
import { connect } from 'mongoose';

connect('mongodb://127.0.0.1:27017/dsikea-api-rest')
  .then(() => {
    console.log('Connection to MongoDB server established');
  })
  .catch(() => {
    console.log('Unable to connect to MongoDB server');
  });
```
En el se usa el método `connect`, que devuelve una promesa. Usamos el parámetro `dbURL`, en donde se pone la conexión al servidor `MongoDB`. Si la conexión se establece bien, pues muestra un mensaje de `'Connection to MongoDB server established'` y sino pues un mensaje `'Unable to connect to MongoDB server'`

## Clientes
Primer definimos el esquema de los clientes, que lo guardamos en nuetro directorio `models`.
```ts
export interface ClienteInterface extends Document {
  dni: string;
  nombre: string;
  correo: string;
  contacto: string;
}
```
Creamos una interfaz que hereda de `Document`, así definimos la forma de una **nota**(es la colección que se le pasa a MongoDB), en el nuestro cliente tendrá esos atributos.

Ahora definimos las propiedades que tendrá nuestro esquema:
```ts
export const ClienteSchema: Schema = new Schema<ClienteInterface>({
  dni: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El DNI del cliente no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El DNI del cliente debe tener 9 caracteres.');
      }
      if (!/^\d{8}[A-Z]$/.test(value)) {
        throw new Error('El DNI del cliente debe tener un formato válido: [8 dígitos][1 letra mayúscula].');
      }
    },
  },
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre del cliente no puede ser vacío.');
      }
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre del cliente debe comenzar con mayúscula.');
      }
    },
  },
  correo: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El correo del cliente no puede ser vacío.');
      }
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error('El correo del cliente debe tener un formato válido.');
      }
    },
  },
  contacto: {
    type: String,
    required: true, 
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El número de contacto del cliente no puede ser vacío.');
      }
      if (!value.match(/^\d{9}$/)) {
        throw new Error('El número de contacto del cliente debe tener un formato válido: [9 dígitos].');
      }
    },
  },
});
```
En el especificamos las validaciones:
- El `type` será `String`
- Usamos `validate` para comprobar si el esquema esta bien definido o no, en caso de que la propiedad no este puesto en el formato que pusimos, lanzará un un mensaje de error o sino cumple con la longitud correspondiente, etc.    
Por último exportamos el esquema
```ts
export const Cliente = model<ClienteInterface>('Cliente', ClienteSchema);
```
  ### Creación de notas
  Creamos los manejadores que usaremos en la base datos, que lo creamos en otro directorio `src/routers`
  Primero gestionamos las rutas, que se usará para manejar las solicitudes HTTP y después configuramos las solicitudes entrantes con datos en formato **JSON**: 
  ```ts
  export const customerRouter = express.Router();
  customerRouter.use(express.json());
  ```
  Ahora empezamos a crear los distintos manejadores
  

## Proveedores
## Muebles
## Transacciones



### Dificultades

### Bibliografía

- [Apuntes Asignatura](https://campusingenieriaytecnologia2324.ull.es/mod/url/view.php?id=17339)
- [MongoDB](https://www.mongodb.com/)
- [Render](https://render.com/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB/MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

---------------------------------------------------
Arrancar servidor descargado:
`sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/`

Ejecutemos servidor;
`node dist/server.js`



