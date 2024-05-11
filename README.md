# Práctica 13 - DSIkea: API REST con Node/Express

Alumnas:

- Inés Garrote Fontenla alu0101512297@ull.edu.es
- Godgith John alu0101463858@ull.edu.es
- Ángela Zhouling Izquierdo Padrón alu0101480442@ull.edu.es

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi/actions/workflows/node.js.yml)

[![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupi/actions/workflows/sonarcloud.yml)

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

Primer definimos el esquema de los clientes, que lo guardamos en nuestro directorio `models`.

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

Ahora empezamos a crear los distintos manejadores:

1. Crear un nuevo cliente `POST /customers_models`:

   - Este manejador recibe una solicitud **POST** en la ruta `/customers_models`.
   - Primero busca si ya existe un cliente con el mismo DNI en la base de datos.
   - Si encuentra un cliente duplicado, devuelve un mensaje de error.
   - Si no hay un cliente duplicado, crea un nuevo cliente con los datos proporcionados en el cuerpo de la solicitud.
   - Guarda el cliente en la base de datos y devuelve un mensaje de éxito junto con el cliente creado en caso de éxito, o un mensaje de error en caso de fallo

   ```ts
   customerRouter.post('/customers', async (req, res) => {
   try {
     const duplicatedCliente = await Cliente.findOne({ dni: req.body.dni });
     if (duplicatedCliente) {
       return res.status(400).send({ msg: 'Ya existe un cliente con ese dni' });
     }
     const cliente = new Cliente(req.body);
     await cliente.save();
     return res.status(201).send({ msg: 'El cliente se ha creado con éxito', Cliente: cliente });
   } catch (error) {
     return res.status(400).send(error);
   }
   ```

});

````

2. Buscar un cliente por DNI `GET /customers`:


    - Este manejador recibe una solicitud GET en la ruta /customers.
    - Busca un cliente en la base de datos basándose en el DNI proporcionado en la consulta.
    - Si no se proporciona un DNI, devuelve un mensaje de error.
    - Si no se encuentra un cliente con el DNI proporcionado, devuelve un mensaje de cliente no encontrado.
    - Si se encuentra un cliente, devuelve un mensaje de éxito junto con el cliente encontrado.
    ```ts
    customerRouter.get('/customers', async (req, res) => {
    try {
      const dni = req.query.dni;
      if (!dni) {
        return res.status(400).send({ msg: 'No se proporcionó un dni' });
      }
      const clienteEncontrado: ClienteInterface | null = await Cliente.findOne({ dni: dni });
      if (!clienteEncontrado) {
        return res.status(404).send({ msg: 'El cliente no fue encontrado en la base de datos' });
      }
      return res.status(200).send({ msg: 'El cliente fue encontrado con éxito', Cliente: clienteEncontrado });
    } catch (error) {
      return res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
    }

});
````

3. Buscar un cliente por su identificador único `GET /customers/:id`:

   - Este manejador recibe una solicitud GET en la ruta /customers/:id, donde :id es el identificador único del cliente.
   - Busca un cliente en la base de datos basándose en su identificador único.
   - Si no se encuentra un cliente con el ID proporcionado, devuelve un mensaje de cliente no encontrado.
   - Si se encuentra un cliente, devuelve un mensaje de éxito junto con el cliente encontrado.

   ```ts
   customerRouter.get('/customers/:id', async (req, res) => {
     const id = req.params.id;
     try {
       const cliente = await Cliente.findById(id);
       if (!cliente) {
         return res.status(404).send({ msg: 'cliente no encontrado' });
       }
       return res.status(200).send({ msg: 'cliente encontrado por id con éxito', cliente: cliente });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
     }
   });
   ```

4. Actualizar un cliente por su identificador único `PATCH /customers/:id`:

   - Este manejador recibe una solicitud PATCH en la ruta /customers/:id, donde :id es el identificador único del cliente que se desea actualizar.
   - Actualiza el cliente en la base de datos con los datos proporcionados en el cuerpo de la solicitud.
   - Si no se encuentra un cliente con el ID proporcionado, devuelve un mensaje de cliente no encontrado.
   - Si se actualiza correctamente el cliente, devuelve un mensaje de éxito junto con el cliente actualizado.

   ```ts
   customerRouter.patch('/customers/:id', async (req, res) => {
     const id = req.params.id;
     try {
       const updatedCliente = await Cliente.findByIdAndUpdate(id, req.body, { new: true });
       if (!updatedCliente) {
         return res.status(404).send({ msg: 'cliente no encontrado' });
       }
       return res.status(200).send({ msg: 'Se ha actualizado correctamente el cliente', Cliente: updatedCliente });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al actualizar el cliente', error });
     }
   });
   ```

5. Actualizar un cliente por DNI `PATCH /customers`:

   - Este manejador recibe una solicitud PATCH en la ruta /customers.
   - Actualiza el cliente en la base de datos con los datos proporcionados en el cuerpo de la solicitud, basándose en el DNI proporcionado en la consulta.
   - Si no se proporciona un DNI, devuelve un mensaje de error.
   - Si no se encuentra un cliente con el DNI proporcionado, devuelve un mensaje de cliente no encontrado.
   - Si se actualiza correctamente el cliente, devuelve un mensaje de éxito junto con el cliente actualizado.

   ```ts
   customerRouter.patch('/customers', async (req, res) => {
   const dni = req.query.dni;
   if (!dni) {
     return res.status(400).send({ msg: 'No se proporcionó un dni' });
   }
   try {
     const updatedCliente = await Cliente.findOneAndUpdate({ dni: dni }, req.body, { new: true });
     if (!updatedCliente) {
       return res.status(404).send({ msg: 'cliente no encontrado' });
     }
     return res.status(200).send({ msg: 'Se ha actualizado correctamente el cliente', Cliente: updatedCliente });
   } catch (error) {
     return res.status(500).send({ msg: 'Error al actualizar el cliente', error });
   }
   ```

});

````

6. Eliminar un cliente por DNI `DELETE /customers`:


    - Este manejador recibe una solicitud DELETE en la ruta /customers.
    - Elimina el cliente de la base de datos basándose en el DNI proporcionado en la consulta.
    - Si no se proporciona un DNI, devuelve un mensaje de error.
    - Si no se encuentra un cliente con el DNI proporcionado, devuelve un mensaje de cliente no encontrado.
    - Si se elimina correctamente el cliente, devuelve un mensaje de éxito junto con el cliente eliminado.
    ```ts
    customerRouter.delete('/customers', async (req, res) => {
    const dni = req.query.dni;
    if (!dni) {
      return res.status(400).send({ msg: 'No se proporcionó un dni' });
    }
    try {
      const deletedCliente = await Cliente.findOneAndDelete({ dni: dni });
      if (!deletedCliente) {
        return res.status(404).send({ msg: 'cliente no encontrado' });
      }
      return res.status(200).send({ msg: `cliente ${deletedCliente.nombre} eliminado con éxito`, Cliente: deletedCliente });
    } catch (error) {
      return res.status(500).send({ msg: 'Error al eliminar el cliente', error });
    }

});
````

7. Eliminar un cliente por su identificador único `DELETE /customers:id`:

   - Este manejador recibe una solicitud DELETE en la ruta /customers/:id, donde :id es el identificador único del cliente que se desea eliminar.
   - Elimina el cliente de la base de datos basándose en su identificador único.
   - Si no se encuentra un cliente con el ID proporcionado, devuelve un mensaje de cliente no encontrado.
   - Si se elimina correctamente el cliente, devuelve un mensaje de éxito junto con el cliente eliminado.

   ```ts
   customerRouter.delete('/customers/:id', async (req, res) => {
   const id = req.params.id;
   try {
     const deletedCliente = await Cliente.findByIdAndDelete(id);
     if (!deletedCliente) {
       return res.status(404).send({ msg: 'cliente no encontrado' });
     }
     return res.status(200).send({ msg: 'Cliente eliminado con éxito', cliente: deletedCliente });
   } catch (error) {
     return res.status(500).send({ msg: 'Error al eliminar el cliente', error });
   }
   ```

});

````

## Proveedores

Primer definimos el esquema de los clientes, que lo guardamos en nuestro directorio `providers_models`.

```ts
export interface ProviderInterface extends Document {
  cif: string;
  nombre: string;
  correo: string;
  direccion: string;
}
````

Creamos una interfaz que hereda de `Document`, así definimos la forma de una **nota**(es la colección que se le pasa a MongoDB), en el nuestro cliente tendrá esos atributos.

Ahora definimos las propiedades que tendrá nuestro esquema:

```ts
export const ProviderSchema: Schema = new Schema<ProviderInterface>({
  cif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El CIF del proveedor no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El CIF del proveedor debe tener 9 caracteres.');
      }
      if (!/^[A-Z]\d{8}$/.test(value)) {
        throw new Error('El CIF del proveedor debe tener un formato válido: [1 letra mayúscula][8 dígitos].');
      }
    },
  },
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre del proveedor no puede ser vacío.');
      }
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre del proveedor debe comenzar con mayúscula.');
      }
    },
  },
  correo: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El correo del proveedor no puede ser vacío.');
      }
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error('El correo del proveedor debe tener un formato válido.');
      }
    },
  },
  direccion: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('La dirección del proveedor no puede ser vacía.');
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
export const Provider = model<ProviderInterface>('Provider', ProviderSchema);
```

### Creación de notas

Que se encuentra en nuestro directorio `src/providers_models`

1. Crear un nuevo proveedor `POST /providers_models`:

   - Este manejador recibe una solicitud POST en la ruta /providers_models.
   - Crea un nuevo proveedor en la base de datos.
   - Si el proveedor ya existe, devuelve un mensaje de error.
   - Si se crea correctamente el proveedor, devuelve un mensaje de éxito junto con el proveedor creado.

   ```ts
   providerRouter.post('/providers', async (req, res) => {
     try {
       const duplicatedProvider = await Provider.findOne({ cif: req.body.cif });
       if (duplicatedProvider) {
         return res.status(400).send({ msg: 'Ya existe un proveedor con ese cif' });
       }
       const provider = new Provider(req.body);
       await provider.save();
       return res.status(201).send({ msg: 'El Proveedor se ha creado con éxito', provider: provider });
     } catch (error) {
       return res.status(400).send(error);
     }
   });
   ```

2. Buscar un proveedor por CIF `GET /providers_models`:

   - Este manejador recibe una solicitud GET en la ruta /providers_models.
   - Busca un proveedor en la base de datos basándose en el CIF proporcionado en la consulta.
   - Si no se proporciona un CIF válido, devuelve un mensaje de error.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se encuentra el proveedor, devuelve un mensaje de éxito junto con el proveedor encontrado.

   ```ts
   providerRouter.get('/providers', async (req, res) => {
     try {
       const cif = req.query.cif;
       if (!cif) {
         return res.status(400).send({ msg: 'No se proporcionó un CIF' });
       }
       const proveedorEncontrado: ProviderInterface | null = await Provider.findOne({ cif: cif });
       if (!proveedorEncontrado) {
         return res.status(404).send({ msg: 'El proveedor no fue encontrado en la base de datos' });
       }
       return res.status(200).send({ msg: 'El proveedor fue encontrado con éxito', provider: proveedorEncontrado });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
     }
   });
   ```

3. Buscar un proveedor por su identificador único `GET /providers_models/:id`:

   - Este manejador recibe una solicitud GET en la ruta /providers_models/:id, donde :id es el identificador único del proveedor.
   - Busca un proveedor en la base de datos basándose en su identificador único.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se encuentra el proveedor, devuelve un mensaje de éxito junto con el proveedor encontrado.

   ```ts
   providerRouter.get('/providers/:id', async (req, res) => {
     const id = req.params.id;
     try {
       const provider = await Provider.findById(id);
       if (!provider) {
         return res.status(404).send({ msg: 'Proveedor no encontrado' });
       }
       return res.status(200).send({ msg: 'Proveedor encontrado por id con éxito', provider: provider });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
     }
   });
   ```

4. Actualizar un proveedor por su identificador único `PATCH /providers_models/:id`:

   - Este manejador recibe una solicitud PATCH en la ruta /providers_models/:id, donde :id es el identificador único del proveedor que se desea actualizar.
   - Actualiza el proveedor en la base de datos basándose en su identificador único.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se actualiza correctamente el proveedor, devuelve un mensaje de éxito junto con el proveedor actualizado.

   ```ts
   providerRouter.patch('/providers/:id', async (req, res) => {
     const id = req.params.id;
     try {
       const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
       if (!updatedProvider) {
         return res.status(404).send({ msg: 'Proveedor no encontrado' });
       }
       return res.status(200).send({ msg: 'Se ha actualizado correctamente el proveedor', provider: updatedProvider });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al actualizar el proveedor', error });
     }
   });
   ```

5. Actualizar un proveedor por CIF `PATCH /providers_models`:

   - Este manejador recibe una solicitud PATCH en la ruta /providers_models.
   - Actualiza un proveedor en la base de datos basándose en el CIF proporcionado en la consulta.
   - Si no se proporciona un CIF válido, devuelve un mensaje de error.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se actualiza correctamente el proveedor, devuelve un mensaje de éxito junto con el proveedor actualizado.

   ```ts
   providerRouter.patch('/providers', async (req, res) => {
     const cif = req.query.cif;
     if (!cif) {
       return res.status(400).send({ msg: 'No se proporcionó un CIF' });
     }
     try {
       const updatedProvider = await Provider.findOneAndUpdate({ cif: cif }, req.body, { new: true });
       if (!updatedProvider) {
         return res.status(404).send({ msg: 'Proveedor no encontrado' });
       }
       return res.status(200).send({ msg: 'Se ha actualizado correctamente el proveedor', provider: updatedProvider });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al actualizar el proveedor', error });
     }
   });
   ```

6. Eliminar un proveedor por CIF `DELETE /providers_models`:

   - Este manejador recibe una solicitud DELETE en la ruta /providers_models.
   - Elimina un proveedor de la base de datos basándose en el CIF proporcionado en la consulta.
   - Si no se proporciona un CIF válido, devuelve un mensaje de error.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se elimina correctamente el proveedor, devuelve un mensaje de éxito junto con el proveedor eliminado.

   ```ts
   providerRouter.delete('/providers', async (req, res) => {
     const cif = req.query.cif;
     if (!cif) {
       return res.status(400).send({ msg: 'No se proporcionó un CIF' });
     }
     try {
       const deletedProvider = await Provider.findOneAndDelete({ cif: cif });
       if (!deletedProvider) {
         return res.status(404).send({ msg: 'Proveedor no encontrado' });
       }
       return res.status(200).send({ msg: `Proveedor ${deletedProvider.nombre} eliminado con éxito`, provider: deletedProvider });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al eliminar el proveedor', error });
     }
   });
   ```

7. Eliminar un proveedor por su identificador único `DELETE /providers_models/:id`:
   - Este manejador recibe una solicitud DELETE en la ruta /providers_models/:id, donde :id es el identificador único del proveedor que se desea eliminar.
   - Elimina un proveedor de la base de datos basándose en su identificador único.
   - Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de proveedor no encontrado.
   - Si se elimina correctamente el proveedor, devuelve un mensaje de éxito junto con el proveedor eliminado.
   ```ts
   providerRouter.delete('/providers/:id', async (req, res) => {
     const id = req.params.id;
     try {
       const deletedProvider = await Provider.findByIdAndDelete(id);
       if (!deletedProvider) {
         return res.status(404).send({ msg: 'Proveedor no encontrado' });
       }
       return res.status(200).send({ msg: 'Proveedor eliminado con éxito', provider: deletedProvider });
     } catch (error) {
       return res.status(500).send({ msg: 'Error al eliminar el proveedor', error });
     }
   });
   ```

## Muebles

Primer definimos el esquema de los clientes, que lo guardamos en nuestro directorio `furnitures_models`.

```ts
export enum TipoMueble {
  Silla = 'Silla',
  Mesa = 'Mesa',
  Cama = 'Cama',
  Armario = 'Armario',
  Sofa = 'Sofa',
  Estanteria = 'Estanteria',
}

export enum MaterialMueble {
  Madera = 'Madera',
  Metal = 'Metal',
  Plastico = 'Plastico',
}

export enum ColorMueble {
  Blanco = 'Blanco',
  Negro = 'Negro',
  Amarillo = 'Amarillo',
  Rojo = 'Rojo',
  Azul = 'Azul',
  Verde = 'Verde',
  Naranja = 'Naranja',
}

export interface MuebleInterface extends Document {
  nombre: string;
  tipo: TipoMueble;
  material: MaterialMueble;
  descripcion: string;
  color: ColorMueble;
  precio: number;
  cantidad: number;
}
```

Creamos una interfaz que hereda de `Document`, así definimos la forma de una **nota**(es la colección que se le pasa a MongoDB), en el nuestro cliente tendrá esos atributos.

Ahora definimos las propiedades que tendrá nuestro esquema:

```ts
export const MuebleSchema: Schema = new Schema<MuebleInterface>({
  nombre: {
    type: String,
    required: [true, 'El nombre del mueble es requerido'],
    validate: {
      validator: (value: string) => {
        return value.length > 0;
      },
      message: 'El nombre del mueble no puede ser vacío',
    },
  },
  tipo: {
    type: String,
    enum: {
      values: Object.values(TipoMueble),
      message: 'Ese tipo de mueble no está disponible en la tienda',
    },
    required: [true, 'El tipo del mueble es requerido'],
  },
  material: {
    type: String,
    enum: {
      values: Object.values(MaterialMueble),
      message: 'Ese material no está disponible en la tienda',
    },
    required: [true, 'El material del mueble es requerido'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del mueble es requerida'],
    validate: {
      validator: (value: string) => {
        return value.length > 0;
      },
      message: 'La descripción del mueble no puede ser vacía',
    },
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad del mueble es requerida'],
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'La cantidad del mueble debe ser mayor que 0',
    },
  },
  color: {
    type: String,
    enum: {
      values: Object.values(ColorMueble),
      message: 'Ese color no está disponible en la tienda',
    },
    required: [true, 'El color del mueble es requerido'],
  },
  precio: {
    type: Number,
    required: [true, 'El precio del mueble es requerido'],
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'El precio del mueble debe ser mayor que 0',
    },
  },
});
```

En el especificamos las validaciones:

- El `type` será `String`
- Usamos `validate` para comprobar si el esquema esta bien definido o no, en caso de que la propiedad no este puesto en el formato que pusimos, lanzará un un mensaje de error o sino cumple con la longitud correspondiente, etc.  
  Por último exportamos el esquema

```ts
export const Mueble = model<MuebleInterface>('Mueble', MuebleSchema);
```

### Creación de notas

Que se encuentra en nuestro directorio `src/furnitures_models`

## Muebles

### 1. Crear un nuevo mueble `POST /muebles`:

   - Este manejador recibe una solicitud POST en la ruta `/muebles`.
   - Verifica si el color, tipo y material del mueble son válidos.
   - Si alguno de los atributos del mueble no es válido, devuelve un mensaje de error.
   - Crea un nuevo mueble en la base de datos.
   - Si se crea correctamente el mueble, devuelve un mensaje de éxito junto con el mueble creado.
   ```ts
    furnitureRouter.post('/muebles', async (req, res) => {
    const { color, tipo, material } = req.body;

    if (!Object.values(ColorMueble).includes(color)) {
      return res.status(400).send({ error: 'Ese color no está disponible en la tienda' });
    }

    if (!Object.values(TipoMueble).includes(tipo)) {
      return res.status(400).send({ error: 'Ese tipo de mueble no está disponible en la tienda' });
    }

    if (!Object.values(MaterialMueble).includes(material)) {
      return res.status(400).send({ error: 'Ese material no está disponible en la tienda' });
    }

    try {
      const mueble = new Mueble(req.body);
      await mueble.save();
      return res.status(201).send({ msg: 'Mueble creado con éxito', mueble });
    } catch (error) {
      return res.status(500).send({ error: 'Error al crear el mueble' });
    }
  });
   ```

### 2. Buscar muebles por atributos `GET /muebles`:

   - Este manejador recibe una solicitud GET en la ruta `/muebles`.
   - Busca muebles en la base de datos basándose en los atributos proporcionados en la consulta.
   - Si no se encuentran muebles con los criterios de búsqueda proporcionados, devuelve un mensaje de error.
   - Si se encuentran muebles, devuelve un mensaje de éxito junto con los muebles encontrados.
   ```ts
   furnitureRouter.get('/muebles', async (req, res) => {
    try {
      const muebles = await Mueble.find(req.query);
      if (muebles.length === 0) {
        return res.status(404).send({ message: 'No se encontraron muebles con los criterios de búsqueda proporcionados' });
      }
      return res.status(200).send({ message: 'Búsqueda realizada con éxito', muebles });
    } catch (error) {
      return res.status(500).send({ error: 'Error al realizar la búsqueda' });
    }
  });
   ```

### 3. Buscar un mueble por su identificador único `GET /muebles/:id`:

   - Este manejador recibe una solicitud GET en la ruta `/muebles/:id`, donde `:id` es el identificador único del mueble.
   - Busca un mueble en la base de datos basándose en su identificador único.
   - Si el mueble no se encuentra en la base de datos, devuelve un mensaje de mueble no encontrado.
   - Si se encuentra el mueble, devuelve un mensaje de éxito junto con el mueble encontrado.
   ```ts
   furnitureRouter.get('/muebles/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const muebles = await Mueble.findById(id);
      if (!muebles) {
        return res.status(404).send({ msg: 'mueble no encontrado' });
      }
      return res.status(200).send({ msg: 'Mueble encontrado con éxito', muebles: muebles });
    } catch (error) {
      return res.status(500).send({ msg: 'Error al buscar el mueble', error: error });
    }
  });
   ```

### 4. Modificar un mueble por nombre `PATCH /muebles`:

   - Este manejador recibe una solicitud PATCH en la ruta `/muebles`.
   - Modifica un mueble en la base de datos basándose en el nombre proporcionado en la consulta.
   - Si no se proporciona un nombre válido, devuelve un mensaje de error.
   - Si el mueble no se encuentra en la base de datos, devuelve un mensaje de mueble no encontrado.
   - Si se modifica correctamente el mueble, devuelve un mensaje de éxito junto con el mueble modificado.
   ```ts
   furnitureRouter.patch('/muebles', async (req, res) => {
    const nombre = req.query.nombre;
    if (!nombre) {
      return res.status(400).send({ message: 'No se proporcionó un nombre' });
    }
    try {
      const muebleActualizado = await Mueble.findOneAndUpdate({ nombre: nombre }, req.body, { new: true });
      if (!muebleActualizado) {
        return res.status(404).send({ msg: 'Mueble no encontrado para modificar' });
      }
      return res.status(200).send({ msg: 'Mueble modificado con éxito', mueble: muebleActualizado });
    } catch (error) {
      return res.status(500).send({ error: 'Error al modificar el mueble' });
    }
  });
   ```

### 5. Modificar un mueble por su identificador único `PATCH /muebles/:id`:

   - Este manejador recibe una solicitud PATCH en la ruta `/muebles/:id`, donde `:id` es el identificador único del mueble que se desea modificar.
   - Modifica un mueble en la base de datos basándose en su identificador único.
   - Si el mueble no se encuentra en la base de datos, devuelve un mensaje de mueble no encontrado.
   - Si se modifica correctamente el mueble, devuelve un mensaje de éxito junto con el mueble modificado.
   ```ts
   furnitureRouter.patch('/muebles/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const mueble = await Mueble.findByIdAndUpdate(id, req.body, { new: true });
      if (!mueble) {
        return res.status(404).send({ msg: 'Mueble no encontrado para modificar' });
      }
      return res.status(200).send({ msg: 'Mueble modificado por id con éxito', mueble: mueble });
    } catch (error) {
      return res.status(500).send({ msg: 'Error al modificar el mueble', error: error });
    }
  });
   ```

### 6. Eliminar un mueble por nombre `DELETE /muebles`:

   - Este manejador recibe una solicitud DELETE en la ruta `/muebles`.
   - Elimina un mueble de la base de datos basándose en el nombre proporcionado en la consulta.
   - Si no se proporciona un nombre válido, devuelve un mensaje de error.
   - Si el mueble no se encuentra en la base de datos, devuelve un mensaje de mueble no encontrado.
   - Si se elimina correctamente el mueble, devuelve un mensaje de éxito.
   ```ts
   furnitureRouter.delete('/muebles', async (req, res) => {
    const nombre = req.query.nombre;
    if (!nombre) {
      return res.status(400).send({ message: 'No se proporcionó un nombre' });
    }
    try {
      const muebleEliminado = await Mueble.findOneAndDelete({ nombre: nombre });
      if (!muebleEliminado) {
        return res.status(404).send({ msg: 'Mueble no encontrado para eliminar' });
      }
      return res.status(200).send({ msg: 'Mueble eliminado con éxito' });
    } catch (error) {
      return res.status(500).send({ error: 'Error al eliminar el mueble' });
    }
  });
   ```

### 7. Eliminar un mueble por su identificador único `DELETE /muebles/:id`:

   - Este manejador recibe una solicitud DELETE en la ruta `/muebles/:id`, donde `:id` es el identificador único del mueble que se desea eliminar.
   - Elimina un mueble de la base de datos basándose en su identificador único.
   - Si el mueble no se encuentra en la base de datos, devuelve un mensaje de mueble no encontrado.
   - Si se elimina correctamente el mueble, devuelve un mensaje de éxito.
   ```ts
   furnitureRouter.delete('/muebles/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const muebleEliminado = await Mueble.findByIdAndDelete(id);
      if (!muebleEliminado) {
        return res.status(404).send({ msg: 'Mueble no encontrado para eliminar' });
      }
      return res.status(200).send({ msg: 'Mueble eliminado por id con éxito' });
    } catch (error) {
      return res.status(500).send({ msg: 'Error al eliminar el mueble', error: error });
    }
  });
   ```

## Transacciones

+++++++++++++++++++++++++++++

## Server
Aqui se hace la configuración del servidor, usando Express.js para el API REST
Se importa primero el módulo `express` para crear el servidor y el archivo `mongoose.js` para configurar la conexión a la base de datos MongoDB.
Con esto se puede iniciar el servidor y hacerlo escuchar en el puerto que definimos y muestra un mensaje de que esta siendo escuchado.
```ts
// server.ts
import express from 'express';
import './db/mongoose.js';

import { customerRouter } from './routers/customers_routers.js';
import { providerRouter } from './routers/provider_routers.js';
import { furnitureRouter } from './routers/furnitures_routers.js';
import { defaultRouter } from './routers/default.js';

export const app = express();
const port = process.env.PORT || 3000;

// Rutas

app.use(providerRouter);
app.use(customerRouter);
app.use(furnitureRouter);

app.use(defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
```

### Dificultades

### Bibliografía

- [Apuntes Asignatura](https://campusingenieriaytecnologia2324.ull.es/mod/url/view.php?id=17339)
- [MongoDB](https://www.mongodb.com/)
- [Render](https://render.com/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB/MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
