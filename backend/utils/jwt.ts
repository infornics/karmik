import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants/config";

export interface JwtPayload {
  sub: string;
  email: string;
}

const jwtSecret: Secret = JWT_SECRET as Secret;
const jwtOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"],
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, jwtSecret, jwtOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};

