import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { NewUser } from "../database/schemas/user";
import { AuthRequest } from "../middleware/auth";
import {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByUsername,
} from "../services/user";
import { signToken } from "../utils/jwt";

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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = signToken({ sub: user.id, email: user.email });

        const { password: _pw } = user;

        return res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error: any) {
        console.error("Error in login controller:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const userDetails = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password: _pw, ...safeUser } = user;

        return res.status(200).json({
            user: safeUser,
        });
    } catch (error: any) {
        console.error("Error in me controller:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
