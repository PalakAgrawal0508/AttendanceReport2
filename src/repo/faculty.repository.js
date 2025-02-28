import { getDB } from "../config/mongodb.js";
import { getScheduledClasses } from "../Utils/common/getScheduledClasses.js"; // Updated import
import UserRepository from "./user.repository.js";
import AttedanceModal from "../models/attendance.model.js";

export default class FacultyReportRepo {
	constructor() {
		this.userRepo = new UserRepository();
		this.TimeTableColletion = "TimeTable";
		this.attendanceCollection = "Attendance";
	}

	async facultySubjectList(empCode) {
		try {
			const emp = await this.userRepo.findByEmployeeCode(empCode);
			if (emp.status === "ok" && emp.data != null) {
				const db = await getDB();
				const collec = await db.collection(this.TimeTableColletion);
				const timeTableData = await collec.findOne({ ownerId: emp.data._id });

				const objectsSet = new Set();

				// Iterate over the TimeTable keys and add unique entries (excluding timing)
				Object.keys(timeTableData.TimeTable).forEach((key) => {
					const elements = timeTableData.TimeTable[key];
					elements.forEach((element) => {
						const { timing, ...rest } = element;
						objectsSet.add(JSON.stringify(rest));
					});
				});

				// Convert the set back to an array of objects
				const uniqueObjects = Array.from(objectsSet).map((item) =>
					JSON.parse(item)
				);

				return {
					status: "ok",
					message: "Success",
					data: uniqueObjects,
				};
			} else {
				return {
					status: "err",
					message: emp.message,
					data: {},
				};
			}
		} catch (e) {
			console.log(e);
			return {
				status: "err",
				message: e.message || "An error occurred",
				data: {},
			};
		}
	}

	/*
	 Data example:
	 {
	   ownerId: '65d7266cc7059e88b77a350f',
	   subjectId: '66963f0bb7cadc536c558204',
	   course: 'B-tech',
	   branch: 'CSE',
	   semester: 'III',
	   section: '01',
	   session: '2023-27'
	 }
	*/
	// Requires the Owner Id, SubjectId, Course, Branch, Semester, Section, Session
	async facultyClassAttendancePercentage(data) {
		try {
			const { ownerId, subjectId, course, branch, semester, section, session } =
				data;
			if (
				ownerId &&
				subjectId &&
				course &&
				branch &&
				semester &&
				section &&
				session
			) {
				const db = await getDB();
				const collec = await db.collection(this.attendanceCollection);
				const result = await collec.findOne({ ...data });
				const mp = new Map();
				let total = 0;
				result.attendance.forEach((attendanceRecord) => {
					total++;
					attendanceRecord.attendance.forEach((list) => {
						if (mp.has(list["Scholar No."])) {
							const tmp = mp.get(list["Scholar No."]);
							mp.set(list["Scholar No."], tmp + parseInt(list["isPresent"]));
						} else {
							mp.set(list["Scholar No."], parseInt(list["isPresent"]));
						}
					});
				});
				return {
					status: "ok",
					message: "Success",
					data: { totalClass: total, attendace: Object.fromEntries(mp) },
				};
			}
			return {
				status: "err",
				message: "Some data is missing",
				data: { totalClass: 0, attendace: {} },
			};
		} catch (e) {
			console.log(e);
			return {
				status: "err",
				message: e.message || "An error occurred",
				data: {},
			};
		}
	}

	extractUserId(userResult) {
		let data = userResult.data;
		while (data && data.data) {
			data = data.data;
		}
		return data._id;
	}

	// {
	// 	"status": "ok",
	// 	"message": "Success",
	// 	"data": [
	// 		{
	// 			"subject": {
	// 				"_id": "678dfa8ad5665f6a3eb3fa67",
	// 				"subjectCode": "CSE357",
	// 				"subjectName": "Advanced Data Structures",
	// 				"department": "CSE",
	// 				"isElective": false
	// 			},
	// 			"branch": "CSE",
	// 			"semester": "VI",
	// 			"section": "1",
	// 			"location": "LRC A Block Ground Floor",
	// 			"course": "B-Tech",
	// 			"session": "2022-26"
	// 		}
	// 	]
	// }
	async facultyAttendance(data) {
		try {
			let {
				ownerId,
				startDate: reqStartDate,
				endDate: reqEndDate,
				subjectId,
				employeeCode,
			} = data;

			// Parse the date strings to Date objects for comparison
			const startDate = new Date(reqStartDate);
			const endDate = new Date(reqEndDate);

			const db = await getDB();
			const Attendance = db.collection("Attendance");
			if (!Attendance) {
				return {
					status: "err",
					message: "Attendance collection not found",
					data: [],
				};
			}

			const ScheduledClasses = [];

			// Handle multiple subjects if subjectId is not provided
			if (!subjectId) {
				const facultyResult = await this.facultySubjectList(employeeCode);

				if (facultyResult.status !== "ok" || !facultyResult.data) {
					return {
						status: "err",
						message: "Failed to fetch faculty subjects",
						data: [],
					};
				}

				// Process each subject sequentially
				for (const element of facultyResult.data) {
					const id = element.subject._id;
					if (!id) {
						continue;
					}
					// Calculate scheduled classes for this subject
					const scheduledClasses = await getScheduledClasses(
						ownerId,
						id,
						reqStartDate,
						reqEndDate
					);
					const q = {
						ownerId: ownerId.toString(),
						subjectId: id,
					};

					let attendanceDoc = await Attendance.findOne(q);

					// if ( attendanceDoc.attendance) {
					// 	console.log("Attendance array :",id, attendanceDoc.attendance);

					// }

					let totalClasses = 0;
					let isMarked = 0;
					if (Array.isArray(attendanceDoc.attendance)) {
						const filteredAttendance = attendanceDoc.attendance.filter(
							(record) => {
								if (!record.date) return false;
								const recordDate = new Date(record.date);
								return recordDate >= startDate && recordDate <= endDate;
							}
						);
						totalClasses = filteredAttendance.length;
					}

					if (attendanceDoc.isMarked && Array.isArray(attendanceDoc.isMarked)) {
						isMarked = attendanceDoc.isMarked.filter((markedEntry) => {
							// Extract date from format like "12:00-1:00PM 2025-01-20"
							const datePart = markedEntry.split(" ")[1];
							if (!datePart) return false;
							const markedDate = new Date(datePart);
							return (
								!isNaN(markedDate) &&
								markedDate >= startDate &&
								markedDate <= endDate
							);
						}).length;
					}
					//Naaku  subject attendance details toh paatu ivi kaavali anthe
					ScheduledClasses.push({
						subjectId: id,
						subjectName: element.subject.subjectName || "Unknown Subject",
						subjectCode: element.subject.subjectCode || "Unknown Code",
						branch: element.branch || "Unknown Branch",
						semester: element.semester,
						section: element.section,
						course: element.course,
						session: element.session,
						isElective: element.isElective,
						scheduledClasses: scheduledClasses,
						totalClasses: totalClasses,
						isMarked: isMarked,
					});
				}
			} else {
				const facultyResult = await this.facultySubjectList(employeeCode);
				if (facultyResult.status !== "ok" || !facultyResult.data) {
					return {
						status: "err",
						message: "Failed to fetch faculty subjects",
						data: [],
					};
				}
				const foundEntry = facultyResult.data.find(
					(entry) => entry.subject._id === subjectId
				);
				if (!foundEntry) {
					return {
						status: "err",
						message: "Subject not found",
						data: [],
					};
				}
				const subject = foundEntry.subject;

				// Calculate scheduled classes for this subject
				const scheduledClasses = await getScheduledClasses(
					ownerId,
					subjectId,
					reqStartDate,
					reqEndDate
				);
				const q = {
					ownerId: ownerId.toString(),
					subjectId: subjectId,
				};

				let attendanceDoc = await Attendance.findOne(q);

				let totalClasses = 0;
				let isMarked = 0;
				if (Array.isArray(attendanceDoc.attendance)) {
					const filteredAttendance = attendanceDoc.attendance.filter(
						(record) => {
							if (!record.date) return false;
							const recordDate = new Date(record.date);
							return recordDate >= startDate && recordDate <= endDate;
						}
					);
					totalClasses = filteredAttendance.length;
				}

				if (attendanceDoc.isMarked && Array.isArray(attendanceDoc.isMarked)) {
					isMarked = attendanceDoc.isMarked.filter((markedEntry) => {
						// Extract date from format like "12:00-1:00PM 2025-01-20"
						const datePart = markedEntry.split(" ")[1];
						if (!datePart) return false;
						const markedDate = new Date(datePart);
						return (
							!isNaN(markedDate) &&
							markedDate >= startDate &&
							markedDate <= endDate
						);
					}).length;
				}
				//Naaku  subject attendance details toh paatu ivi kaavali anthe
				ScheduledClasses.push({
					subjectId: subjectId,
					subjectName: subject.subjectName || "Unknown Subject",
					subjectCode: subject.subjectCode || "Unknown Code",
					branch: foundEntry.branch || "Unknown Branch",
					semester: foundEntry.semester,
					section: foundEntry.section,
					course: foundEntry.course,
					session: foundEntry.session,
					isElective: foundEntry.isElective,
					scheduledClasses: scheduledClasses,
					totalClasses: totalClasses,
					isMarked: isMarked,
				});
			}
			return {
				status: "ok",
				message: "Success",
				data: ScheduledClasses,
			};
		} catch (error) {
			return {
				status: "err",
				message: error.message,
				data: [],
			};
		}
	}
}
