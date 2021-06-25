import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import cors from 'cors';

import "./database";
import { router } from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return response.status(400).json({
      error: err.message
    });
  };
  return response.status(500).json({
    status: "error",
    message: "Internal Server Error"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on the ${process.env.BASE_URL}`);
});