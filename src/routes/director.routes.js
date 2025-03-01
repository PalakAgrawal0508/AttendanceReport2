import { Router } from "express";
import { getDepts } from "../controllers/director.controller.js";
import { ClassReportController } from "../controllers/ClassReport/ClassReport.cotroller.js";
const   ClassReportCotroller = new ClassReportController()
const directorRoutes = Router()

directorRoutes.get("/getDepartments",getDepts);
directorRoutes.get("/getBranches",ClassReportCotroller.getBranches);

export default directorRoutes