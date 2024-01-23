const jwt = require('jsonwebtoken');
const { authenticateJWT, ensureLoggedIn, ensureCompany, ensureCorrectUser } = require('./auth');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

describe('authenticateJWT', () => {
  it('should set user on res.locals if a valid token is provided', () => {
    const token = jwt.sign({ username: 'testUser', id: '1a2b3c', userType: 'user' }, SECRET_KEY);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { locals: {} };
    const next = jest.fn();

    authenticateJWT(req, res, next);

    // iat represents the genereated `issued at` timestamp of the JWT
    expect(res.locals.user).toEqual({ iat: expect.any(Number),username: 'testUser', id: '1a2b3c', userType: 'user' });
    expect(next).toHaveBeenCalled();
  });

  it('should not set user on res.locals if no token is provided', () => {
    const req = { headers: {} };
    const res = { locals: {} };
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should not set user on res.locals if the token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidToken' } };
    const res = { locals: {} };
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});

describe('ensureLoggedIn', () => {
  it('should call next if user is logged in', () => {
    const req = {};
    const res = { locals: { user: { username: 'testUser', id: '1a2b3c', userType: 'user' } } };
    const next = jest.fn();

    ensureLoggedIn(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if req.user is present', () => {
    const req = { user: { username: 'testUser', id: '1a2b3c', userType: 'user' } };
    const res = { locals: {} };
    const next = jest.fn();

    ensureLoggedIn(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedError if user is not logged in and req.user is not present', () => {
    const req = {};
    const res = { locals: {} };
    const next = jest.fn();

    ensureLoggedIn(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('ensureCompany', () => {
  it('should call next if user is logged in as a company', () => {
    const req = {};
    const res = { locals: { user: { username: 'testCompany', id: '1a2b3c', userType: 'company' } } };
    const next = jest.fn();

    ensureCompany(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if req.user is present and is a company', () => {
    const req = { user: { username: 'testCompany', id: '1a2b3c', userType: 'company' } };
    const res = { locals: {} };
    const next = jest.fn();

    ensureCompany(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedError if user is not logged in or is not a company', () => {
    const req = {};
    const res = { locals: { user: { username: 'testUser', id: '1a2b3c', userType: 'user' } } };
    const next = jest.fn();

    ensureCompany(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('ensureCorrectUser', () => {
  it('should call next if user is logged in and matches the route param username', () => {
    const req = { params: { username: 'testUser' } };
    const res = { locals: { user: { username: 'testUser', id: '1a2b3c', userType: 'user' } } };
    const next = jest.fn();

    ensureCorrectUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next if req.user is present and matches the route param username', () => {
    const req = { params: { username: 'testUser' }, user: { username: 'testUser', id: '1a2b3c', userType: 'user' } };
    const res = { locals: {} };
    const next = jest.fn();

    ensureCorrectUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedError if user is not logged in or does not match the route param username', () => {
    const req = { params: { username: 'testUser' } };
    const res = { locals: { user: { username: 'otherUser', id: 'otherId', userType: 'user' } } };
    const next = jest.fn();

    ensureCorrectUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});