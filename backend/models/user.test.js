const db = require('../db');
const User = require('./user');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { BCRYPT_WORK_FACTOR } = require('../config');
const {v4} = require("uuid");
const bcrypt = require("bcrypt");

// Assuming you have a testing database setup
beforeEach(async () => {
  await db.query('DELETE FROM users');

  const hashedPassword = await bcrypt.hash('testPassword', BCRYPT_WORK_FACTOR);

  await db.query(
    `INSERT INTO users (id, username, login_type, password, first_name, last_name, date_registered, email, user_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    ["123", 'testUser', 'email', hashedPassword, 'John', 'Doe', new Date(), 'test@example.com', 'user']
  );
});

afterAll(async () => {
  await db.end();
});

describe('User.authenticate', () => {
  it('should authenticate a user with valid credentials', async () => {
    const user = await User.authenticate('testUser', 'testPassword');
    expect(user).toEqual({
      id: '123',
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      userType: 'user'
    });
  });

  it('should throw UnauthorizedError for invalid username', async () => {
    await expect(User.authenticate('nonexistentUser', 'testPassword')).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError for invalid password', async () => {
    await expect(User.authenticate('testUser', 'wrongPassword')).rejects.toThrow(UnauthorizedError);
  });
});

describe('User.register', () => {
  it('should register a new user', async () => {
    const user = await User.register({
      id: '567',
      username: 'newUser',
      loginType: 'email',
      password: 'newPassword',
      firstName: 'New',
      lastName: 'User',
      email: 'new@example.com',
      userType: 'user'
    });

    expect(user).toEqual({
      id: '567',
      username: 'newUser',
      firstName: 'New',
      lastName: 'User',
      email: 'new@example.com',
      usertype: 'user'
    });
  });

  it('should throw BadRequestError for duplicate username', async () => {
    await expect(User.register({
      id: '234',
      username: 'testUser',
      loginType: 'email',
      password: 'newPassword',
      firstName: 'New',
      lastName: 'User',
      email: 'new@example.com',
      usertype: 'user'
    })).rejects.toThrow(BadRequestError);
  });
});

describe('User.findAll', () => {
  it('should return an array of all users', async () => {
    const users = await User.findAll();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: '123',
      username: 'testUser',
      firstname: 'John',
      lastname: 'Doe',
      areacode: null,
      email: 'test@example.com',
      rating: null,
      profile: null,
      skills: null,
      photo: null,
      resume: null,
      availability: null
    });
  });
});

describe('User.getById', () => {
  it('should return user data by ID', async () => {
    const user = await User.getById('123');
    expect(user).toEqual({
      id: '123',
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      loginType: 'email',
      userType: 'user'
    });
  });

  it('should return null for non-existing user ID', async () => {
    const user = await User.getById(999);
    expect(user).toBeNull();
  });
});

describe('User.getFullProfileById', () => {
  it('should return full user profile data by ID', async () => {
    const user = await User.getFullProfileById('123');
    expect(user).toEqual({
      id: '123',
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      userType: 'user',
      rating: null,
      profile: null,
      areaCode: null,
      skills: null,
      photo: null,
      resume: null,
      availability: null,
      jobs: []
    });
  });

  it('should return null for non-existing user ID', async () => {
    const user = await User.getFullProfileById(999);
    expect(user).toBeNull();
  });
});

describe('User.getByUsername', () => {
  it('should return user data by username', async () => {
    const user = await User.getByUsername('testUser');
    expect(user).toEqual({
      id: '123',
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      loginType: 'email'
    });
  });

  it('should return null for non-existing username', async () => {
    const user = await User.getByUsername('nonexistentUser');
    expect(user).toBeNull();
  });
});

describe('User.update', () => {
  it('should update user data', async () => {
    const updatedUser = await User.update('testUser', {
      profile: 'Updated profile',
      areaCode: '12345'
    });

    expect(updatedUser).toEqual({
      id: '123',
      username: 'testUser'
    });

    const user = await User.getFullProfileById('123');
    expect(user).toEqual({
      id: '123',
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      userType: 'user',
      profile: 'Updated profile',
      areaCode: '12345',
      rating: null,
      skills: null,
      photo: null,
      resume: null,
      availability: null,
      jobs: []
    });
  });

  it('should throw NotFoundError for non-existing username', async () => {
    await expect(User.update('nonexistentUser', { profile: 'Updated profile' })).rejects.toThrow(NotFoundError);
  });
});

describe('User.remove', () => {
  it('should remove a user from the database', async () => {
    await User.remove('123');
    const user = await User.getById(1);
    expect(user).toBeNull();
  });

  it('should throw NotFoundError for non-existing user ID', async () => {
    await expect(User.remove(999)).rejects.toThrow(NotFoundError);
  });
});
