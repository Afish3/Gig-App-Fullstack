const request = require('supertest');
const app = require('../app'); 

jest.mock('../models/user', () => ({
    authenticate: jest.fn((username, password) => {
      // Mock the user authentication logic here
      if (username === 'validUser' && password === 'validPassword') {
        return {
          username: 'validUser',
          id: '1a2b3c',
          userType: 'user',
        };
      } else {
        throw new Error('Invalid username/password');
      }
    }),
    register: jest.fn((user) => {
      // Mock the user registration logic here
      if (user.username === 'newUser') {
        return {
          ...user,
          id: 'newUserId',
        };
      } else {
        throw new Error('User registration failed');
      }
    }),
  }));

describe('Authentication Routes', () => {
  describe('POST /auth/token', () => {
    it('should return a token for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          username: 'validUser',
          password: 'validPassword',
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for missing credentials', async () => {
      await request(app)
        .post('/auth/token')
        .send({})
        .expect(400);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return a token', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'newUser',
          password: 'newPassword',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for invalid registration data', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          // Invalid data, missing required fields
        })
        .expect(400);
    });
  });

  describe('Google OAuth', () => {
    it('should redirect to Google for authentication', async () => {
      await request(app)
        .get('/auth/google')
        .expect(302) // Redirect status code
        .expect('Location', /google/); // Verify redirection to Google
    });
  });
});
