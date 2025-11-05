import { HTTP_STATUS } from "../../../constants/httpConstants";


/**
 * Base error class for application errors.
 * Extends the built-in Error class to include an error code and status code.
 */
export class AppError extends Error {
    /**
     * Creates a new AppError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The http response code.
     */
    constructor(
        public message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Class representing a repository error.
 * Extends the AppError class for database and data access related errors.
 */
export class RepositoryError extends AppError {
    /**
     * Creates a new RepositoryError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The http response code.
     */
    constructor(
        message: string,
        code: string = "REPOSITORY_ERROR",
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message, code, statusCode);
    }
}

/**
 * Class representing a service error.
 * Extends the AppError class for business logic related errors.
 */
export class ServiceError extends AppError {
    /**
     * Creates a new ServiceError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The http response code.
     */
    constructor(
        message: string,
        code: string = "SERVICE_ERROR",
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message, code, statusCode);
    }
}

const UNAUTHORIZED: number = 401;

/**
 * Class representing an authentication error.
 * Extends the built-in Error class to include an error code.
 */
export class AuthenticationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new AuthenticationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = UNAUTHORIZED
    ) {
        super(message);
        this.name = "AuthenticationError";
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}


const FORBIDDEN: number = 403;

/**
 * Class representing an authorization error.
 * Extends the built-in Error class to include an error code.
 */
export class AuthorizationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new AuthorizationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The http response code.
     */
    constructor(message: string, code: string, statusCode: number = FORBIDDEN) {
        super(message);
        this.name = "AuthorizationError";
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
