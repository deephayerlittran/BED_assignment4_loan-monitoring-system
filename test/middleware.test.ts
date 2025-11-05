import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseConfig';
import authenticate from '../src/api/v1/middleware/authenticate';
import isAuthorized from '../src/api/v1/middleware/authorize';
import { AuthenticationError, AuthorizationError } from '../src/api/v1/middleware/authenticate';

type MockedAdminModule = {
    auth: () => {
      verifyIdToken: jest.Mock;
      getUser: jest.Mock;
    };
    verifyIdTokenMock: jest.Mock;
};

jest.mock('../config/firebaseAdmin', () => {
    console.log('Firebase Admin mock executed!');
    const originalModule = jest.requireActual('../config/firebaseAdmin');
    const verifyIdTokenMock = jest.fn();
    return {
      ...originalModule,
      auth: () => ({
        verifyIdToken: verifyIdTokenMock,
        getUser: jest.fn(),
      }),
      verifyIdTokenMock: verifyIdTokenMock,
    };
});

import * as mockedAdmin from '../config/firebaseConfig';

describe('Authentication Middleware Tests', () => {
    let verifyIdTokenMock: jest.Mock;
  
    beforeAll(() => {
      verifyIdTokenMock = (mockedAdmin as unknown as MockedAdminModule).verifyIdTokenMock;
    });
  
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
  
    beforeEach(() => {
      req = { headers: {} };
      res = { locals: {} };
      next = jest.fn();
    });
  
    it('should throw AuthenticationError when no token is provided', async () => {
      await expect(authenticate(req as Request, res as Response, next)).rejects.toThrow(AuthenticationError);
      expect(next).not.toHaveBeenCalled();
    });
  
    it('should throw AuthenticationError if token verification fails', async () => {
      req.headers = { authorization: 'Bearer invalid-token' };
      verifyIdTokenMock.mockRejectedValueOnce(new Error('Invalid token'));
  
      await expect(authenticate(req as Request, res as Response, next)).rejects.toThrow(AuthenticationError);
      expect(next).not.toHaveBeenCalled();
    });
  
    it('should successfully pass through when token is valid', async () => {
      req.headers = { authorization: 'Bearer valid-token' };
      const mockDecodedToken: admin.auth.DecodedIdToken = {
        uid: 'test-uid',
        role: 'officer',
        aud: 'test-aud',
        auth_time: 1234567890,
        exp: 9876543210,
        firebase: {
          sign_in_provider: 'test-provider',
          identities: {
            'test-provider': ['test-identity'],
          },
        },
        iat: 1234567890,
        iss: 'test-iss',
        sub: 'test-sub',
      };
  
