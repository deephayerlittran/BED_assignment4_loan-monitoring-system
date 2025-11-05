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
  

      verifyIdTokenMock.mockImplementation(() => {
        console.log('MockImplementation called!');
        return Promise.resolve(mockDecodedToken);
      });
  
      console.log('Mocked verifyIdToken:', admin.auth().verifyIdToken);
  
      await authenticate(req as Request, res as Response, next);
  
      expect(verifyIdTokenMock).toHaveBeenCalledWith('valid-token');
      expect(res.locals).toEqual({ uid: 'test-uid', role: 'officer' });
      expect(next).toHaveBeenCalled();
    });
});

describe('Authorization Middleware Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = { params: {} };
        res = { locals: { uid: 'test-uid' } };
        next = jest.fn();
    });

    it('should pass when user has the required role', () => {
        res.locals = { role: 'manager', uid: 'test-uid' };
        const middleware = isAuthorized({ hasRole: ['manager'] });
    
        middleware(req as Request, res as Response, next);
    
        expect(next).toHaveBeenCalled();
    });

    it('should throw AuthorizationError if user has insufficient role', () => {
        res.locals = { role: 'user', uid: 'test-uid' };
        const middleware = isAuthorized({ hasRole: ['manager'] });
    
        expect(() => middleware(req as Request, res as Response, next)).toThrow(
          new AuthorizationError('Forbidden: Insufficient role', 'INSUFFICIENT_ROLE')
        );
        expect(next).not.toHaveBeenCalled();
      });
    
      it('should throw AuthorizationError if role is missing', () => {
        const middleware = isAuthorized({ hasRole: ['manager'] });
    
        expect(() => middleware(req as Request, res as Response, next)).toThrow(
          new AuthorizationError('Forbidden: No role found', 'ROLE_NOT_FOUND')
        );
        expect(next).not.toHaveBeenCalled();
      });
    
      it('should allow same user access when allowSameUser is true', () => {
        req.params = { id: 'test-uid' };
        res.locals = { role: 'user', uid: 'test-uid' };
    
        const middleware = isAuthorized({ hasRole: ['manager'], allowSameUser: true });
    
        middleware(req as Request, res as Response, next);
    
        expect(next).toHaveBeenCalled();
      });
});