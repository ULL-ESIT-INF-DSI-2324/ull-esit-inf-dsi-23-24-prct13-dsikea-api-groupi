import request from 'supertest';
import { app } from '../src/server.js';
import { Mueble } from '../src/models/furnitures_models.js';
import { expect } from 'chai';

// Pruebas para la creación de un nuevo mueble
describe('POST /furnitures', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Mueble.deleteMany({});
  });
  it('Should successfully create a new furniture', async () => {
    const response = await request(app)
      .post('/muebles')
      .send({
        nombre: 'Silla de madera',
        tipo: 'Silla',
        material: 'Madera',
        descripcion: 'Una cómoda silla de madera',
        color: 'Blanco',
        precio: 50,
        cantidad: 10,
      })
      .expect(201);

    expect(response.body).to.have.property('msg', 'Mueble creado con éxito');
    expect(response.body).to.have.property('Mueble');
    expect(response.body.Mueble).to.include({
        nombre: 'Silla de madera',
        tipo: 'Silla',
        material: 'Madera',
        descripcion: 'Una cómoda silla de madera',
        color: 'Blanco',
        precio: 50,
        cantidad: 10,
    });
  });
  it('Should not create a furniture with invalid data', async () => {
    const furnitureData = {
      nombre: '',
      tipo: 'InvalidType',
      material: 'InvalidMaterial',
      descripcion: '',
      color: 'InvalidColor',
      precio: -10,
      cantidad: 0,
    };
  
    const response = await request(app).post('/furnitures').send(furnitureData);
    expect(response.status).to.equal(404);
  });
  
});

