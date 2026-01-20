import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  addKarmaEntry,
  getKarmaHistoryForUser,
  getTodaySummaryForUser,
} from "../services/karma";

export const addKarma = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type } = req.body as { type?: "good" | "bad" };
    if (!type || (type !== "good" && type !== "bad")) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const points = type === "good" ? 1 : -2;

    const entry = await addKarmaEntry({
      userId,
      type,
      points,
    });

    return res.status(201).json({ entry });
  } catch (error: any) {
    console.error("Error in addKarma controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getKarmaHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [history, today] = await Promise.all([
      getKarmaHistoryForUser(userId),
      getTodaySummaryForUser(userId),
    ]);

    return res.status(200).json({ history, today });
  } catch (error: any) {
    console.error("Error in getKarmaHistory controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

