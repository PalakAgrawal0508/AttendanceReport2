import express from "express";
import FacultyReportController from "./faculty_report_controller.js";
const faculty_report_route = express.Router();
const facultyReportCont = new FacultyReportController();

faculty_report_route.get("/facultySubjectList", (req, res) => {
  facultyReportCont.facultySubjectList(req, res);

});
faculty_report_route.post("/classWiseAttendacnceOfFaculty", (req, res) => {
    facultyReportCont.facultyAtterndacePercentage(req, res);
});
export default faculty_report_route;
