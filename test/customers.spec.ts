import request from 'supertest';
import { app } from '../src/server.js';
import { Cliente } from '../src/models/customers_models.js';
import { expect } from 'chai';

// Pruebas para la creación de un nuevo cliente
describe('POST /customers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Cliente.deleteMany({});
  });
  it('Should successfully create a new user', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        dni: '12345678F',
        nombre: 'Olivia',
        correo: 'olivia@gmail.com',
        contacto: '123456789',
      })
      .expect(201);

    expect(response.body).to.have.property('msg', 'El cliente se ha creado con éxito');
    expect(response.body).to.have.property('Cliente');
    expect(response.body.Cliente).to.include({
      dni: '12345678F',
      nombre: 'Olivia',
      correo: 'olivia@gmail.com',
      contacto: '123456789',
    });
  });
  it('Should not create a customer with a duplicated DNI', async () => {
    const customerData = {
      dni: '12345678F',
      nombre: 'Olivia',
      correo: 'olivia@gmail.com',
      contacto: '123456789',
    };

    // Primera solicitud para crear a Olivia
    await request(app).post('/customers').send(customerData).expect(201);

    // Segunda solicitud para intentar crear a Olivia de nuevo
    const response = await request(app).post('/customers').send(customerData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('msg', 'Ya existe un cliente con ese dni');
  });
  it('Should not create a customer with invalid DNI', async () => {
    const customerData = {
      dni: '123', // DNI inválido
      nombre: 'Olivia',
      correo: 'olivia@gmail.com',
      contacto: '123456789',
    };

    const response = await request(app).post('/customers').send(customerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a customer with invalid name', async () => {
    const customerData = {
      dni: '12345678F',
      nombre: '', // Nombre inválido
      correo: 'olivia@gmail.com',
      contacto: '123456789',
    };

    const response = await request(app).post('/customers').send(customerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a customer with invalid email', async () => {
    const customerData = {
      dni: '12345678F',
      nombre: 'Olivia',
      correo: 'invalid email', // Correo inválido
      contacto: '123456789',
    };

    const response = await request(app).post('/customers').send(customerData);

    expect(response.status).to.equal(400);
  });

  it('Should not create a customer with invalid contact', async () => {
    const customerData = {
      dni: '12345678F',
      nombre: 'Olivia',
      correo: 'olivia@gmail.com',
      contacto: '123', // Contacto inválido
    };

    const response = await request(app).post('/customers').send(customerData);

    expect(response.status).to.equal(400);
  });
});

// Pruebas para busqueda de clientes
describe('GET /customers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Cliente.deleteMany({});
  });
  // Creamos dos customers
  const customer_1 = {
    dni: '12345678P',
    nombre: 'Maria',
    correo: 'maria@hgmail.com',
    contacto: '123456789',
  };
  const customer_2 = {
    dni: '12345678Q',
    nombre: 'Juan',
    correo: 'juan@gmail.com',
    contacto: '644465536',
  };
  it('Should get customer1 by dni', async () => {
    await request(app).post('/customers').send(customer_1).expect(201);
    //await request(app).post('/customers').send(customer_2).expect(201);

    const response = await request(app).get('/customers?dni=12345678P').expect(200);

    expect(response.body).to.have.property('msg', 'El cliente fue encontrado con éxito');
    expect(response.body).to.have.property('Cliente');
    expect(response.body.Cliente).to.include(customer_1);
  });
  it('Should get customer2 by dni', async () => {
    await request(app).post('/customers').send(customer_2).expect(201);

    const response = await request(app).get('/customers?dni=12345678Q').expect(200);

    expect(response.body).to.have.property('msg', 'El cliente fue encontrado con éxito');
    expect(response.body).to.have.property('Cliente');
    expect(response.body.Cliente).to.include(customer_2);
  });
  it('Should not get customer by dni', async () => {
    await request(app).post('/customers').send(customer_1).expect(201);
    await request(app).post('/customers').send(customer_2).expect(201);

    const response = await request(app).get('/customers?dni=12345678R').expect(404);

    expect(response.body).to.have.property('msg', 'El cliente no fue encontrado en la base de datos');
  });
  it('Should get customer1 by id', async () => {
    const customer = await request(app).post('/customers').send(customer_1).expect(201);

    const response = await request(app).get(`/customers/${customer.body.Cliente._id}`).expect(200);

    expect(response.body).to.have.property('msg', 'cliente encontrado por id con éxito');
    expect(response.body).to.have.property('cliente');
    expect(response.body.cliente).to.include(customer_1);
  });
  it('Should get customer2 by id', async () => {
    const customer = await request(app).post('/customers').send(customer_2).expect(201);

    const response = await request(app).get(`/customers/${customer.body.Cliente._id}`).expect(200);

    expect(response.body).to.have.property('msg', 'cliente encontrado por id con éxito');
    expect(response.body).to.have.property('cliente');
    expect(response.body.cliente).to.include(customer_2);
  });
});

describe('PATCH /customers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Cliente.deleteMany({});
  });
  // Creamos un customer
  const customer_1 = {
    dni: '12345678P',
    nombre: 'Maria',
    correo: 'maria@hgmail.com',
    contacto: '123456789',
  };

  it('Should update a customer by DNI', async () => {
    await request(app).post('/customers').send(customer_1).expect(201);
    const dni = '12345678P'; // Asegúrate de que este DNI exista en tu base de datos
    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      contacto: '987654321',
    };

    const response = await request(app).patch(`/customers?dni=${dni}`).send(updateData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Se ha actualizado correctamente el cliente');
    expect(response.body).to.have.property('Cliente');
    expect(response.body.Cliente).to.include(updateData);
  });

  it('Should return 404 for a non-existent DNI', async () => {
    const dni = 'nonexistentDNI';
    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      contacto: '987654321',
    };

    const response = await request(app).patch(`/customers?dni=${dni}`).send(updateData);

    expect(response.status).to.equal(404);
  });

  it('should update a customer by its id', async () => {
    const customer = await request(app).post('/customers').send(customer_1).expect(201);

    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      contacto: '987654321',
    };
    const response = await request(app).patch(`/customers/${customer.body.Cliente._id}`).send(updateData);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Se ha actualizado correctamente el cliente');
    expect(response.body).to.have.property('Cliente');
    expect(response.body.Cliente).to.include(updateData);
  });
  it('Should return 404 for a non-existent id', async () => {
    const updateData = {
      nombre: 'Maria Updated',
      correo: 'mariaa_updated@gmail.com',
      contacto: '987654321',
    };
    const id_inexistente = '60b3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app).patch(`/customers/${id_inexistente}`).send(updateData);

    expect(response.status).to.equal(404);
  });
});

describe('DELETE /customers', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Cliente.deleteMany({});
  });
  // Creamos un customer
  const customer_1 = {
    dni: '12345678P',
    nombre: 'Maria',
    correo: 'maria@hgmail.com',
    contacto: '123456789',
  };
  it('Should delete a customer by DNI', async () => {
    await request(app).post('/customers').send(customer_1).expect(201);
    const dni = '12345678P'; // Asegúrate de que este DNI exista en tu base de datos

    const response = await request(app).delete(`/customers?dni=${dni}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'cliente Maria eliminado con éxito');
  });

  it('Should return 404 for a non-existent DNI', async () => {
    const dni = 'nonexistentDNI';

    const response = await request(app).delete(`/customers?dni=${dni}`);

    expect(response.status).to.equal(404);
    // mensaje
    expect(response.body).to.have.property('msg', 'cliente no encontrado');
  });

  
  it('should delete a customer by its id', async () => {
    const customer = await request(app).post('/customers').send(customer_1).expect(201);

    const response = await request(app).delete(`/customers/${customer.body.Cliente._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('msg', 'Cliente eliminado con éxito');
  });
  it('Should return 404 for a non-existent id', async () => {
    //const customer = await request(app).post('/customers').send(customer_1).expect(201);
    const id_inexistente = '60b3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app).delete(`/customers/${id_inexistente}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('msg', 'cliente no encontrado');
  });
});
