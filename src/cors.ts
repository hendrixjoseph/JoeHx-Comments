import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const allowedOrigin = process.env.ALLOWED_ORIGIN!;

export class CorsError extends Error {
    statusCode = 500;

    constructor() {
        super('Not allowed by CORS');
        Object.setPrototypeOf(this, CorsError.prototype);
    }

}

export const corsSetup = cors({
  origin: (origin, callback) => {    
    if (origin && allowedOrigin === origin) {
      return callback(null, true);
    }
    return callback(new CorsError());
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
});