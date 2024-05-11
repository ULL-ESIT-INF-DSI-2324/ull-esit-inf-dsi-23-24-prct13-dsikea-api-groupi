import request from 'supertest';
import { app } from '../src/server.js';
import { TipoMueble, ColorMueble, MaterialMueble, Mueble } from '../src/models/furnitures_models.js';
import { expect } from 'chai';
//import { beforeEach, describe, it } from 'node:test';

// Pruebas para la creación de un nuevo mueble
describe('POST /furnitures', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Mueble.deleteMany({});
  });
  it('Should successfully create a new furniture', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).post('/furnitures').send(mueblePrueba).expect(201);
    expect(response.body).to.have.property('mueble');
    expect(response.body).to.have.property('msg', 'Mueble creado con éxito');
    expect(response.body.mueble).to.include(mueblePrueba);
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
    expect(response.status).to.equal(400);
  });
  it('Should not create a furniture with missing data', async () => {
    const furnitureData = {
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).post('/furnitures').send(furnitureData);
    expect(response.status).to.equal(500);
  });
  it('Should not create a furnitute of an invalid color', async () => {
    const furnitureData = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: 'InvalidColor',
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).post('/furnitures').send(furnitureData);
    expect(response.body).to.have.property('error', 'Ese color no está disponible en la tienda');
    expect(response.status).to.equal(400);
  });
  it('should not create a furniture of an invalid material', async () => {
    const furnitureData = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: 'InvalidMaterial',
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).post('/furnitures').send(furnitureData);
    expect(response.body).to.have.property('error', 'Ese material no está disponible en la tienda');
    expect(response.status).to.equal(400);
  });
  it('should not create a furniture of an invalid type', async () => {
    const furnitureData = {
      nombre: 'Silla Prueba',
      tipo: 'InvalidType',
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).post('/furnitures').send(furnitureData);
    expect(response.body).to.have.property('error', 'Ese tipo de mueble no está disponible en la tienda');
    expect(response.status).to.equal(400);
  });
});

describe('GET /furnitures', () => {
  beforeEach(async () => {
    await Mueble.deleteMany({});
  });
  it('Should get all the furniture in the store', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    await request(app).post('/furnitures').send(mueblePrueba).expect(201);

    const response = await request(app).get('/furnitures').expect(200);
    expect(response.body).to.have.property('muebles');
    expect(response.body.muebles).to.have.length(1);
    expect(response.body.muebles[0]).to.include(mueblePrueba);
  });
  it('Should not find a furniture that is not in database', async () => {
    const response = await request(app).get('/furnitures').expect(404);
    expect(response.body).to.have.property('message', 'No se encontraron muebles con los criterios de búsqueda proporcionados');
  });
  it('Should find furniture by its id', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const mueble = await request(app).post('/furnitures').send(mueblePrueba).expect(201);
    const response = await request(app).get(`/furnitures/${mueble.body.mueble._id}`).expect(200);

    expect(response.body).to.have.property('muebles');
    expect(response.body).to.have.property('msg', 'Mueble encontrado con éxito');
    expect(response.body.muebles).to.include(mueblePrueba);
  });
});

describe('PATCH /furnitures', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Mueble.deleteMany({});
  });
  // CREAMOS UN MUEBLE
  it('Should successfully update a furniture', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const mueble = await request(app).post('/furnitures').send(mueblePrueba).expect(201);

    const muebleActualizado = {
      nombre: 'Silla Actualizada',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).patch(`/furnitures/${mueble.body.mueble._id}`).send(muebleActualizado).expect(200);
    expect(response.body).to.have.property('mueble');
    expect(response.body).to.have.property('msg', 'Mueble modificado por id con éxito');
    expect(response.body.mueble).to.include(muebleActualizado);
  });
  it('Should successfully update a furniture by id', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const mueble = await request(app).post('/furnitures').send(mueblePrueba).expect(201);

    const muebleActualizado = {
      nombre: 'Silla Actualizada',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).patch(`/furnitures/${mueble.body.mueble._id}`).send(muebleActualizado).expect(200);
    expect(response.body).to.have.property('mueble');
    expect(response.body).to.have.property('msg', 'Mueble modificado por id con éxito');
    expect(response.body.mueble).to.include(muebleActualizado);
  });
  // si no existe el mueble
  it('Should not update a furniture that does not exist', async () => {
    const muebleActualizado = {
      nombre: 'Silla Actualizada',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).patch('/furnitures?nombre=mueble no existente').send(muebleActualizado).expect(404);
    expect(response.body).to.have.property('msg', 'Mueble no encontrado para modificar');
  });
  // si no existe el mueble por id
  it('Should not update a furniture that does not exist by id', async () => {
    const muebleActualizado = {
      nombre: 'Silla Actualizada',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const response = await request(app).patch('/furnitures/1234').send(muebleActualizado).expect(500);
    expect(response.body).to.have.property('msg', 'Error al modificar el mueble');
  });
});

describe('DELETE /furnitures', () => {
  // Antes de cada prueba, limpiamos la base de datos
  beforeEach(async () => {
    await Mueble.deleteMany({});
  });
  it('Should successfully delete a furniture by id', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    const mueble = await request(app).post('/furnitures').send(mueblePrueba).expect(201);
    const response = await request(app).delete(`/furnitures/${mueble.body.mueble._id}`).expect(200);
    expect(response.body).to.have.property('msg', 'Mueble eliminado por id con éxito');
  });
  it('Should not delete a furniture by id that does not exist', async () => {
    const response = await request(app).delete('/furnitures/60b3b3b3b3b3b3b3b3b3b3b3').expect(404);
    expect(response.body).to.have.property('msg', 'Mueble no encontrado para eliminar');
  });
  it('Should successfully delete a furniture by name', async () => {
    const mueblePrueba = {
      nombre: 'Silla Prueba',
      tipo: TipoMueble.Silla,
      material: MaterialMueble.Madera,
      descripcion: 'Una silla de madera de prueba',
      color: ColorMueble.Blanco,
      precio: 100,
      cantidad: 10,
    };

    await request(app).post('/furnitures').send(mueblePrueba).expect(201);
    const response = await request(app).delete(`/furnitures?nombre=${mueblePrueba.nombre}`).expect(200);
    expect(response.body).to.have.property('msg', 'Mueble eliminado con éxito');
  });
  it('Should not delete a furniture by name that does not exist', async () => {
    const response = await request(app).delete('/furnitures?nombre=mueble no existente').expect(404);
    expect(response.body).to.have.property('msg', 'Mueble no encontrado para eliminar');
  });
});
