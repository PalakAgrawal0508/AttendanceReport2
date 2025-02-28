import { getDB } from "../../config/mongodb.js";
import validator from "validator";
import { getStudentDetails } from "../../Utils/Student/getStudetDetails.js";
import { getSubjectDetails } from "../../Utils/common/getSubjectDetails.js";
import { getMonthlyPipeline } from "../../Pipelines/Monthly.js";

export const monthlyReport = async (req, res) => {
	try {
		const { scholarNumber } = req.body;
		console.log("Request Body:", req.body);

		// Validate required fields
		if (!validator.matches(scholarNumber, /^[0-9]{10}$/)) {
			return res.status(400).json({ error: "Invalid scholar number" });
		}
		// if (!semester) {
		// 	return res.status(400).json({ error: "Semester is required" });
		// }

		// Get student details
		const studentDetails = await getStudentDetails(scholarNumber);
		if (!studentDetails || studentDetails.length === 0) {
			return res.status(404).json({ error: "Student not found" });
		}
		const student = studentDetails[0];
		console.log("Student Details:", student);

		// Validate branch and section
		const branch = student.branch;
		const section = student.section;
		if (!branch || !section) {
			return res.status(400).json({ error: "Branch and section are required" });
		}

		// Verify that the provided branch matches the student's record
		// (Assuming branch is provided via student's details)
		if (student.branch !== branch) {
			return res.status(400).json({ error: "Branch does not match student's record" });
		}

		const db = getDB("ATMS"); // Database is ATMS

		// Optional: Normalize section if needed
		const normalizedSection = section.length === 1 ? `0${section}` : section;
		console.log("Normalized Section:", normalizedSection);

		// Build aggregation pipeline using request parameters with normalized section
		const pipeline = getMonthlyPipeline(scholarNumber, branch, null, normalizedSection);

		const results = await db
			.collection("Attendance")
			.aggregate(pipeline)
			.toArray();
		console.log("Attendance Collection Results:", results);

		// Replace subjectId with subjectCode and subjectName using getSubjectDetails
		const updatedResults = await Promise.all(
			results.map(async (record) => {
				try {
					const subjectDetail = await getSubjectDetails(record.subjectId);
					return {
						...record,
						subjectCode: subjectDetail ? subjectDetail.subjectCode : null,
						subjectName: subjectDetail ? subjectDetail.subjectName : null,
					};
				} catch (err) {
					console.error(`Error fetching subject details for ${record.subjectId}:`, err);
					return {
						...record,
						subjectCode: null,
						subjectName: null,
					};
				}
			})
		);

		return res.status(200).json(updatedResults);
	} catch (error) {
		console.error("Error generating monthly report:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const studentDetails = async (req, res) => {
	const scholarNumber = req.body.scholarNumber;
	if (!validator.matches(scholarNumber, /^[0-9]{10}$/)) {
		return res.status(400).json({ error: "Invalid scholar number" });
	}
	const details = await getStudentDetails(scholarNumber);
	console.log(`Details of ${scholarNumber} : `, details[0]);
	return res.status(200).json(details);
};
