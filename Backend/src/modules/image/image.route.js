import { Router } from "express";
import { uploadImage } from "./image.controller.js";
import { upload } from "../../middelwares/multer.js";
const router = Router()

router.post("/",upload.single("image"),uploadImage)

export default router