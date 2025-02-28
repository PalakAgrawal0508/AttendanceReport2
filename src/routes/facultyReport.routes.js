import express from "express";
import FacultyReportController from "../controllers/FacultyReport/facultyReport.controller.js";
const facultyReportRoutes = express.Router();
const facultyReportCont = new FacultyReportController();

facultyReportRoutes.get("/Subjects", (req, res) => {
  facultyReportCont.facultySubjectList(req, res);

});
facultyReportRoutes.post("/attendance/classwise", (req, res) => {
    facultyReportCont.facultyAttendancePercentage(req, res);
});
facultyReportRoutes.get("/details",(req,res)=>{
  facultyReportCont.facultyDetails(req,res);
})
facultyReportRoutes.get("/list",(req,res)=>{
  facultyReportCont.listFaculty(req,res);
})
facultyReportRoutes.post("/facultyAttendance",(req,res)=>{
  facultyReportCont.FacultyAttendance(req,res);
})
export default facultyReportRoutes;


