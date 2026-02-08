import bcrypt from "bcrypt";
import { CreateUserInput } from "./user.schema";
import { prisma } from "lib/prisma";

type SearchUsersInput = {
  query?: string;
  limit?: number;
  cursor?: string; // last user id
  excludeIds?: string[]; // list of user ids to exclude from the search results
};

export async function createUser(data: CreateUserInput) {
  const exists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    include: {
      address: {
        select: { id: true, fullName: true ,state:true,country:true,postalCode:true,phone:true,line1:true, city:true},
      },
    },
  });

  if (exists) {
    throw new Error("User already existed");
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      ...data,
      password: hashPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function searchUsers({
  query,
  limit = 10,
  cursor,
  excludeIds,
}: SearchUsersInput) {
  let whereQuery: any = {}
  if(excludeIds?.length){
    whereQuery ={
      ...whereQuery,
      id:{
        notIn:excludeIds
      }
      
    }

  }
  if(query){
      whereQuery = {
        ...whereQuery,
          email: {
            contains: query,
            mode: "insensitive",
          },
        }
  }
  const users = await prisma.user.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    where: whereQuery,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      email: true,
      role:true,
      createdAt: true,
        address: {
        select: { id: true, fullName: true ,state:true,country:true,postalCode:true,phone:true,line1:true, city:true},
      },
    },
    
    
  });

  let nextCursor: string | null = null;

  if (users.length > limit) {
    const nextItem = users.pop();
    nextCursor = nextItem!.id;
  }

  return {
    data: users,
    nextCursor,
  };
}

export async function findOneUser(
  data: Partial<CreateUserInput & { id: string }>,
) {
  return prisma.user.findFirst({ where: data });
}
