import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user";
import { requireAuth } from "../middleware/auth";

const userRoutes = Router();

userRoutes.get("/", requireAuth, getProfile);
userRoutes.put("/", requireAuth, updateProfile);

export default userRoutes;

