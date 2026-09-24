const request = require('supertest');
const app = require('../app');

describe('Task Manager backend', () => {
  test('GET / возвращает приветственное сообщение', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to Task Manager!');
  });
});