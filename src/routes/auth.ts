import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { registerSchema, validate } from "../middleware/validation";
import { authRateLimit } from "../middleware/rateLimiter";

const authController = new AuthController()

const authRouter = Router()

authRouter.post('/register', authRateLimit, validate(registerSchema), authController.register)

export default authRouter