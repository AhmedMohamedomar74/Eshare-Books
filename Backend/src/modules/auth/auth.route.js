import { Router } from "express";
import *as authServices from "./auth.controller.js"
import { validateLoginCredentials, validatePassword } from "../../middelwares/auth.middleware.js";
import { validateLogin, validateSignup, validateVerifyEmail } from "../../middelwares/validation.middleware.js";
const router = Router()

router.post("/signup",validateSignup,authServices.signup)
router.get("/verify/:email",validateLogin,validateVerifyEmail,authServices.verfiyEmail)
router.post("/login",validateLoginCredentials, validatePassword,authServices.login)

export default router