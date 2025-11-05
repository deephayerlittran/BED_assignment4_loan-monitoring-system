// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

// Internal module imports
import { auth } from "../../../../config/firebaseConfig";

/**
 * Middleware to authenticate a user using a Firebase ID token.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token: string | undefined =
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new AuthenticationError(
            "Unauthorized: No token provided",
            "TOKEN_NOT_FOUND"
        );
    }

    try {
        const decodedToken: DecodedIdToken = await auth.verifyIdToken(
            token
        );
        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new AuthenticationError(
                `Unauthorized: ${getErrorMessage(error)}`,
                getErrorCode(error)
            );
        } else {
            throw new AuthenticationError(
                "Unauthorized: Invalid token",
                "TOKEN_INVALID"
            );
        }
    }
};

export default authenticate;