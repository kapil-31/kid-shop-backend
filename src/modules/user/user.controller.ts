import { Request ,Response } from "express";
import { createUser, searchUsers } from "./user.service";
import { createUserSchema } from "./user.schema";


export async function createUserHandler(req:Request,res:Response){
    const input = createUserSchema.parse(req.body);
    const user = await createUser(input);
     res.json(user).status(200);
}


export async function searchUsersHandler(req: Request, res: Response) {
  const query = req.query.q as string | undefined;
  const cursor = req.query.cursor as string | undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await searchUsers({
    query,
    cursor,
    limit
  });
  res.json({
    data:result
  });
}
