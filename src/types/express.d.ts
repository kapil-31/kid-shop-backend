
import { Request } from 'express';

interface UserPayload {
  userId: string;
  username: string;
  role: string;
}

declare global {
    namespace Express {
        interface Request{
            user?:UserPayload
        }
    }
}

export {}