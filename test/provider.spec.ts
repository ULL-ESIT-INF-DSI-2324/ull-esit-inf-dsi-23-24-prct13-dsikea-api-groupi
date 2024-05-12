import request from 'supertest';
import { app } from '../src/server.js';
import { Provider } from '../src/models/providers_models.js';
import { expect } from 'chai';


// Pruebas para la creación de un nuevo provider
describe('POST /providers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Provider.deleteMany({});
  });
  it('Should successfully create a new user', async () => {
    const providerData = {
      cif: 'A12345678',
      nombre: 'Naim',
      correo: 'naim@gmail.com',
      direccion: 'Calle Ejemplo, 123',
    };

    const response = await request(app).post('/providers').send(providerData).expect(201);

    expect(response.body).to.have.property('provider');
    expect(response.body).to.have.property('msg', 'El Proveedor se ha creado con éxito');
    expect(response.body.provider).to.include(providerData);
  });
  it('Should not create a provider with a duplicated cif', async () => {
    const providerData = {
      cif: 'A12345678',
      nombre: 'Naim',
      correo: 'naim@gmail.com',
      direccion: 'Calle Ejemplo, 123',
    };

    // Primera solicitud para crear a Naim
    await request(app).post('/providers').send(providerData).expect(201);

    // Segunda solicitud para intentar crear a Naim de nuevo
    const response = await request(app).post('/providers').send(providerData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('msg', 'Ya existe un proveedor con ese cif');
  });
  it('Should not create a provider with invalid cif', async () => {
    const providerData = {
      cif: '123', // cif inválido
      nombre: 'Naim',
      correo: 'Naim@gmail.com',
      direccion: '123456789',
    };

    const response = await request(app).post('/providers').send(providerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a provider with invalid name', async () => {
    const providerData = {
      cif: '12345678F',
      nombre: '', // Nombre inválido
      correo: 'Naim@gmail.com',
      direccion: '123456789',
    };

    const response = await request(app).post('/providers').send(providerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a provider with invalid email', async () => {
    const providerData = {
      cif: '12345678F',
      nombre: 'Naim',
      correo: 'invalid email', // Correo inválido
      direccion: '123456789',
    };

    const response = await request(app).post('/providers').send(providerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a provider with invalid contact', async () => {
    const providerData = {
      cif: '12345678F',
      nombre: 'Naim',
      correo: 'Naim@gmail.com',
      direccion: '123', // direccion inválido
    };

    const response = await request(app).post('/providers').send(providerData);

    expect(response.status).to.equal(400);
  });
});

// Pruebas para busqueda de providers
describe('GET /providers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Provider.deleteMany({});
  });
  // Creamos dos providers
  const provider_1 = {
    cif: 'A12345678',
    nombre: 'Naim',
    correo: 'naim@gmail.com',
    direccion: 'Calle Ejemplo, 123',
  };
  const provider_2 = {
    cif: 'B12345678',
    nombre: 'Yeru',
    correo: 'yeri@gmail.com',
    direccion: 'Calle Ejemplo, 123',
  };

  it('Should get provider1 by cif', async () => {
    await request(app).post('/providers').send(provider_1).expect(201);
    const response = await request(app).get(`/providers?cif=${provider_1.cif}`).expect(200);

    expect(response.body).to.have.property('provider');
    expect(response.body).to.have.property('msg', 'El proveedor fue encontrado con éxito');
    expect(response.body.provider).to.include(provider_1);
  });
  it('Should get provider2 by cif', async () => {
    await request(app).post('/providers').send(provider_2).expect(201);
    const response = await request(app).get(`/providers?cif=${provider_2.cif}`).expect(200);

    expect(response.body).to.have.property('provider');
    expect(response.body).to.have.property('msg', 'El proveedor fue encontrado con éxito');
    expect(response.body.provider).to.include(provider_2);
  });
  it('Should not get provider by cif', async () => {
    await request(app).post('/providers').send(provider_1).expect(201);
    await request(app).post('/providers').send(provider_2).expect(201);

    const response = await request(app).get('/providers?cif=12345678R').expect(404);

    expect(response.body).to.have.property('msg', 'El proveedor no fue encontrado en la base de datos');
  });

  it('Should get provider1 by id', async () => {
    const provider = await request(app).post('/providers').send(provider_1).expect(201);

    const response = await request(app).get(`/providers/${provider.body.provider._id}`).expect(200);

    expect(response.body).to.have.property('provider');
    expect(response.body).to.have.property('msg', 'Proveedor encontrado por id con éxito');
    expect(response.body.provider).to.include(provider_1);
  });

  it('Should get provider2 by id', async () => {
    const provider = await request(app).post('/providers').send(provider_2).expect(201);

    const response = await request(app).get(`/providers/${provider.body.provider._id}`).expect(200);

    expect(response.body).to.have.property('provider');
    expect(response.body).to.have.property('msg', 'Proveedor encontrado por id con éxito');
    expect(response.body.provider).to.include(provider_2);
  });
});

describe('PATCH /providers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Provider.deleteMany({});
  });
  // Creamos un provider

  const provider_1 = {
    cif: 'A12345678',
    nombre: 'Naim',
    correo: 'naim@gmail.com',
    direccion: 'Calle Ejemplo, 123',
  };

  it('Should update a provider by cif', async () => {
    // metemos un provider en la base de datos
    await request(app).post('/providers').send(provider_1).expect(201);
    const cif = 'A12345678';
    const updateData = {
      cif: 'A12345678',
      nombre: 'Naim Actualizado',
      correo: 'naim@gmail.com',
      direccion: 'Calle Ejemplo, 123',
    };

    const response = await request(app).patch(`/providers?cif=${cif}`).send(updateData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Se ha actualizado correctamente el proveedor');
  });

  it('Should return 404 for a non-existent cif', async () => {
    const cif = 'nonexistentcif';
    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      direccion: '987654321',
    };

    const response = await request(app).patch(`/providers?cif=${cif}`).send(updateData);

    expect(response.status).to.equal(404);
  });

  it('should update a provider by its id', async () => {
    const provider = await request(app).post('/providers').send(provider_1).expect(201);

    if (!provider.body.provider) {
      throw new Error('Provider no definido');
    }

    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      direccion: '987654321',
    };
    const response = await request(app).patch(`/providers/${provider.body.provider._id}`).send(updateData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Se ha actualizado correctamente el proveedor');
  });

  it('Should return 404 for a non-existent id', async () => {
    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      direccion: '987654321',
    };
    const id_inexistente = '60b3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app).patch(`/providers/${id_inexistente}`).send(updateData);

    expect(response.status).to.equal(404);
  });
});
describe('DELETE /providers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Provider.deleteMany({});
  });

  // Creamos un provider
  const provider_1 = {
    cif: 'P12345678',
    nombre: 'Maria',
    correo: 'maria@gmail.com',
    direccion: 'calle megalodon',
  };

  it('Should delete a provider by cif', async () => {
    await request(app).post('/providers').send(provider_1).expect(201);
    const cif = 'P12345678'; // Asegúrate de que este cif exista en tu base de datos

    const response = await request(app).delete(`/providers/?cif=${cif}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Proveedor Maria eliminado con éxito');
  });

  it('Should return 404 for a non-existent cif', async () => {
    const cif = 'nonexistentcif';

    const response = await request(app).delete(`/providers?cif=${cif}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('msg', 'Proveedor no encontrado');
  });

  it('Should delete a provider by its id', async () => {
    const provider = await request(app).post('/providers').send(provider_1).expect(201);

    const response = await request(app).delete(`/providers/${provider.body.provider._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Proveedor eliminado con éxito');
  });

  it('Should return 404 for a non-existent id', async () => {
    const id_inexistente = '60b3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app).delete(`/providers/${id_inexistente}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('msg', 'Proveedor no encontrado');
  });
});
