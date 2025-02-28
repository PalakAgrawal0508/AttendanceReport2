import FacultyReportRepo from "../../repo/faculty.repository.js";
import { getFacultyListDepartmentWise } from "../../Pipelines/Facultylist.pipeline.js";
import { getDB } from "../../config/mongodb.js";
import { safeStringify } from "../../utils/safeJson.js";

export default class FacultyReportController {
	constructor() {
		this.facultyRepo = new FacultyReportRepo();
		this.Faculty = "User";
	}
	//This will return  the faculty subject list upon getting the get request from the frontend
	async facultySubjectList(req, res) {
		try {
			const result = await this.facultyRepo.facultySubjectList(
				req.query.employeeCode
			);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
		}
	}

	async facultyDetails(req, res) {
		// Since the repo's are crated in the nested manner from the UserRepo -> Faculty Repo .Hence to access the findByEmployee Code we need to accesss it by the help of userRepo
		try {
			const result = await this.facultyRepo.userRepo.findByEmployeeCode(
				req.query.employeeCode
			);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
		}
	}

	// Helper method to extract _id from nested user result
	extractUserId(userResult) {
		let data = userResult.data;
		while (data && data.data) {
			data = data.data;
		}
		return data._id;
	}

	async FacultyAttendance(req, res) {
		try {
			console.log("Getting report for the faculty ");
			const { employeeCode, startDate, endDate, subjectId } = req.body;
             console.log("This is the req body",req.body);
			// Use helper method to extract _id from nested user result
			const userResult = await this.facultyRepo.userRepo.findByEmployeeCode(
				employeeCode
			);
			const ownerId = this.extractUserId(userResult);
			if (!ownerId) {
				throw new Error("User not found");
			}
			
			
			let result = await this.facultyRepo.facultyAttendance({
				ownerId,
				startDate,
				endDate,
				subjectId,
				employeeCode
			});
			
			// Use safeStringify to handle circular references
			
			return res.status(200).send(result);
		} catch (error) {
			console.log("The error in the Faculty is : ", error);
			res.status(500).json({ error: "Oopsie !!! Internal Server Error" });
		}
	}

	async listFaculty(req, res) {
		try {
			const department = req.query.department || "";
			const result = await getDB()
				.collection(this.Faculty)
				.aggregate(getFacultyListDepartmentWise(department))
				.toArray();
			res.status(200).json(result);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	/**
	 *
	 * calculates the percentage of attendance of each class for any particular faculty
	 */

	async facultyAttendancePercentage(req, res) {
		try {
			const { ownerId, subjectId, course, branch, semester, section, session } =
				req.body;
			const result = await this.facultyRepo.facultyClassAttendancePercentage({
				ownerId,
				subjectId,
				course,
				branch,
				semester,
				section,
				session,
			});
			res.send(result);
		} catch (e) {
			console.log(e);
			res.send({
				status: "err",
				message: "Something went wrong",
				data: {},
			});
		}
	}
}
