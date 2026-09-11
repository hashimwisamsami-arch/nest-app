import type { JWTPayloadType } from '../auth/types/jwt-payload.type.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayloadType;
    }
  }
}
