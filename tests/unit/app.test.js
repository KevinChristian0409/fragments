const supertest = require('supertest');
const app = require('../../src/app');

test('404 handler should return a 404 response for non-existent route', async () => {
  const response = await supertest(app).get('/nonexistent-route');

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});
