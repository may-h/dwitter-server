import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },
  host: {
    port: parseInt(required("HOST_PORT", 8080)),
  },
  db: {
    host: required("DB_HOST"),
  },
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
  csrf: {
    plainToken: required("CSRF_SECRET_KEY"),
  },
  rateLimit: {
    windowMs: 60000,
    maxRequest: 100, // 초과하면 429 code response
  },
};
