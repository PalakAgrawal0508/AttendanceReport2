// import FcaultyReportRepo from "./faculty_report_repo.js";

// export default class FacultyReportController {
//   constructor() {
//     this.facultyRepo = new FcaultyReportRepo();
//   }

//   async facultySubjectList(req, res) {
//     try {
//       const result = await this.facultyRepo.facultySubjectList(
//         req.query.employeeCode
//       );
//       res.send(result);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   /**
//    * calculates the percentage of attendance of each class for any particular faculty
//    */

//   async facultyAtterndacePercentage(req, res) {
//     try {
//       const { ownerId, subjectId, course, branch, semester, section, session } =
//         req.body;
//       const result = await this.facultyRepo.facultyClassAttendancePercentage({
//         ownerId,
//         subjectId,
//         course,
//         branch,
//         semester,
//         section,
//         session,
//       });
//       res.send(result);
//     } catch (e) {
//       console.log(e);
//       res.send({
//         status: "err",
//         message: "Something went wrong",
//         data: {},
//       });
//     }
//   }
// }
