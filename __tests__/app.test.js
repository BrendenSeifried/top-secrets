const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  first: 'James',
  last: 'Bond',
  email: '1@1.com',
  password: '123456',
};

const secretTest = {
  title: 'testSecret',
  description: 'This is to confirm the FBI is NOT compromised ;)',
  created_at: '2022-06-23T04:02:20.707Z',
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
    const { first, last, email } = testUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      first,
      last,
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

  it('Test to confirm a 401 error when trying to list all users', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.body).toEqual({
      message: 'Please sign in to continue',
      status: 401,
    });
  });

  it('Test to confirm a 403 error when signed in but do not have Admin privileges', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual({
      message: 'You are not authorized to view this page',
      status: 403,
    });
  });

  it('Test that returns a list of users when signed in as admin', async () => {
    const [agent, user] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual([{ ...user }]);
  });

  it('test to list secret data', async () => {
    // const [agent, user] = await registerAndLogin({ email: 'admin' });
    // const resp = await agent.get('/api/v1/secrets');
    const resp = await request(app).get('/api/v1/users');

    expect(resp.body).toEqual([
      {
        id: '1',
        title: 'first',
        description: 'test of description',
        created_at: '2022-06-23T04:02:20.707Z',
      },
    ]);
  });

  // expect(resp.body).toEqual({
  //   id: expect.any(String),
  //   first,
  //   last,
  //   email,
  // });
  afterAll(() => {
    pool.end();
  });
});
