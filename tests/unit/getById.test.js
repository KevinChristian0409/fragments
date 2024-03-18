const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/randomid').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/randomid')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with fragment data with given id
  test('authenticated users get fragment data with the given id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('This is fragment');
  });

  test('no fragments with the given id returns 404 error', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/randomid')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
  });

  test('convert markdown to html', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('# This is a markdown')
      .set('Content-type', 'text/markdown');

    const id = JSON.parse(req.text).fragment.id;

    const res = await request(app)
      .get('/v1/fragments/' + id + '.html')
      .auth('user1@email.com', 'password1');
    expect(res.text).toEqual('<h1>This is a markdown</h1>\n');
  });

  test('if fragment cannot be converted to the extension type used, returns 415 error', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.unsupported`)
      .auth('user2@email.com', 'password2');

    expect(getRes.statusCode).toBe(415);
  });
});
