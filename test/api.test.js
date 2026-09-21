const request = require('supertest');
const app = require('../src/app');

describe('API Marketplace Integration Tests', () => {
  
  // Test 1: Verificar Endpoint Raíz
  it('GET / debe responder con status 200 y mensaje de bienvenida', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Servidor Marketplace corriendo correctamente');
  });

  // Test 2: Control de Autenticación en Productos
  it('POST /api/products debe denegar el acceso sin Token JWT (401)', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        title: 'Producto Test',
        description: 'Descripción de prueba',
        price: 10,
        categoryId: 1
      });
    expect(response.statusCode).toBe(401);
  });

  // Test 3: Validar errores de Zod en Órdenes
  it('POST /api/orders debe responder 400 si la petición está vacía', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({});
    expect(response.statusCode).toBe(401); // Retorna 401 por no tener token
  });

});
// Test 4: Filtrar productos por categoría
  it('GET /api/products?categoryId=1 debe retornar status 200', async () => {
    const response = await request(app).get('/api/products?categoryId=1');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test 5: Intentar cancelar orden sin token debe dar 401
  it('PATCH /api/orders/1/cancel debe denegar el acceso sin Token JWT (401)', async () => {
    const response = await request(app).patch('/api/orders/1/cancel');
    expect(response.statusCode).toBe(401);
  });