import { Router } from "express";
import { login, register, userDetails } from "../controllers/auth";
import { addKarma, getKarmaHistory, resetTodayKarma } from "../controllers/karma";
import { requireAuth } from "../middleware/auth";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/user", requireAuth, userDetails);

// Karma tracking
authRoutes.post("/karma", requireAuth, addKarma);
authRoutes.get("/karma", requireAuth, getKarmaHistory);
authRoutes.delete("/karma/today", requireAuth, resetTodayKarma);

export default authRoutes;

