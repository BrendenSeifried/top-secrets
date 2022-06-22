const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  email: '1@1.com',
  password: '123456',
};

const registerAndLogin = async (userTestLogin = {}) => {
  const password = userTestLogin.password ?? testUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...testUser, ...userTestLogin });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
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

  it('check to confirm that current user exists', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/me');

    expect(me.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
