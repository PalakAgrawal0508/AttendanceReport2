import { Router } from "express";
import { getDepts } from "../controllers/director.controller.js";
const directorRoutes = Router()

directorRoutes.get("/getDepartments",getDepts)

export default directorRoutes