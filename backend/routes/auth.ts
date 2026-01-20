import { Router } from "express";
import { login, me, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, me);

export default authRoutes;

