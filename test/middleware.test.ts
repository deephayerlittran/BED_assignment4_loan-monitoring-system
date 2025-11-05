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