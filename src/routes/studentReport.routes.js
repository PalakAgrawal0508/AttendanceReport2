import { Router } from "express";
import { studentDetails } from "../controllers/StudentReport/studentReport.controller.js"
import { monthlyReport } from "../controllers/StudentReport/studentReport.controller.js"
const studentReportRouter = Router();

studentReportRouter.post("/details", studentDetails);
studentReportRouter.get("/attendance", (req, res) => {
    console.log(req.query);
    res.json(req.query);
});

studentReportRouter.post("/attendance/monthly", monthlyReport);

export const studentReportRoutes = studentReportRouter;