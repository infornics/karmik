import { Router } from "express";
import { login, register, userDetails } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/user", requireAuth, userDetails);

export default authRoutes;

