/**
 * Augment Express Request type with the `user` property used by auth middleware.
 *
 * The middleware attaches a `user` object (decoded JWT payload) to the
 * request so controllers can access `req.user.uid` and other claims.
 */
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}
