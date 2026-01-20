import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, findUserByUsername } from "../services/user";
import { NewUser } from "../database/schemas/user";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, username } = req.body as Partial<NewUser>;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingByEmail = await findUserByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    if (username) {
      const existingByUsername = await findUserByUsername(username);
      if (existingByUsername) {
        return res.status(409).json({
          message: "User with this username already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      username,
    } as NewUser);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error in register controller:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

