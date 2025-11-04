
import { NextFunction, Request, Response } from "express";
import { CorsError } from "./cors.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CorsError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        console.error('Unexpected error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}