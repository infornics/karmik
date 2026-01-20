import connectDB from "../database/connection";
import { users, NewUser, User } from "../database/schemas/user";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const db = await connectDB();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0];
};

export const findUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  const db = await connectDB();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result[0];
};

export const createUser = async (data: NewUser): Promise<User> => {
  const db = await connectDB();
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

