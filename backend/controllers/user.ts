import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  findUserById,
  findUserByUsername,
  updateUserById,
} from "../services/user";

const generateUsernameFromName = async (name: string): Promise<string> => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20) || "user";

  let candidate = base;
  let suffix = 1;

  // Try a few variants to reduce chance of collision
  // If still collides, DB unique constraint will surface.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await findUserByUsername(candidate);
    if (!existing) {
      return candidate;
    }
    candidate = `${base}${suffix++}`;
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _pw, ...safeUser } = user;

    return res.status(200).json({ user: safeUser });
  } catch (error: any) {
    console.error("Error in getProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, username } = req.body as { name?: string; username?: string };

    if (!name && !username) {
      return res
        .status(400)
        .json({ message: "At least one of name or username is required" });
    }

    const updateData: { name?: string; username?: string } = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (username && username.trim()) {
      const trimmedUsername = username
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]+/g, "");

      if (!trimmedUsername) {
        return res.status(400).json({ message: "Invalid username" });
      }

      const existing = await findUserByUsername(trimmedUsername);
      if (existing && existing.id !== req.userId) {
        return res
          .status(409)
          .json({ message: "Username is already taken" });
      }

      updateData.username = trimmedUsername;
    } else if (name && name.trim()) {
      // No username provided: (re)generate from name
      updateData.username = await generateUsernameFromName(name);
    }

    const updated = await updateUserById(req.userId, updateData);

    const { password: _pw, ...safeUser } = updated;

    return res.status(200).json({ user: safeUser });
  } catch (error: any) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

