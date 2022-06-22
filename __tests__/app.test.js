const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  email: '1@1.com',
  password: '123456',
};

describe('top-secret test bed', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Test to Create a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(testUser);
    const { email } = testUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
