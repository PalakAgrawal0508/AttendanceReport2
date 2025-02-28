import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";


function getWeekday(weekday) {
	let rem;
	switch (weekday) {
		case "monday":
			rem = 1;
			break;
		case "tuesday":
			rem = 2;
			break;
		case "wednesday":
			rem = 3;
			break;
		case "thursday":
			rem = 4;
			break;
		case "friday":
			rem = 5;
			break;
		case "saturday":
			rem = 6;
			break;
		default:
			rem = 0;
			break;
	}
	return rem;
}


export const getScheduledClasses = async (
	ownerId,
	subjectId,
	startDate,
	presentDate
) => {
	//Get the year,day,date
	let start1 = new Date(startDate); // Fixed: Using startDate parameter instead of undefined start1
	let start_weekday = start1.toLocaleDateString("en-US", {
		weekday: "long",
		timeZone: "UTC",
	});
	let start_rem = getWeekday(start_weekday.toLowerCase());

	// Convert both dates to Date objects if they aren't already
	const startDateObj =
		startDate instanceof Date ? startDate : new Date(startDate);
	const presentDateObj =
		presentDate instanceof Date ? presentDate : new Date(presentDate);

	// Calculate days difference correctly
	const msPerDay = 1000 * 60 * 60 * 24;
	const daysDiff = Math.floor((presentDateObj - startDateObj) / msPerDay);

	const db = getDB();
	const timetableDoc = await db
		.collection("TimeTable")
		.findOne({ ownerId: new ObjectId(ownerId) }); // Added ObjectId conversion

	if (!timetableDoc) {
		throw new Error("TimeTable not found");
	}

	// Extract timetable which is an object with keys "1" to "7"
	const timeTable = timetableDoc.TimeTable;
	// Convert timetable object to an array preserving order
	const tableDays = Object.keys(timeTable)
		.sort((a, b) => a - b)
		.map((key) => timeTable[key]);

	// Filter for classes matching the subjectId if provided
	const filteredTableDays = subjectId
		? tableDays.map((dayClasses) =>
				dayClasses.filter(
					(classInfo) =>
						classInfo.subject._id.toString() === subjectId.toString()
				)
		  )
		: tableDays;

	let scheduledPerWeek = 0;
	filteredTableDays.forEach((dayArr) => {
		scheduledPerWeek += dayArr.length;
	});

	const weeks = Math.floor(daysDiff / 7);
	const remaining = daysDiff % 7;

	// Calculate classes for complete weeks
	let result = weeks * scheduledPerWeek;

	// Add classes for remaining days
	for (let i = 0; i <= remaining; i++) {
		const dayIndex = (start_rem - 1 + i) % 7;
		if (dayIndex >= 0 && dayIndex < 7) {
			result += filteredTableDays[dayIndex].length;
		}
	}

	return result;
};

// {
//     "_id": {
//       "$oid": "678ce4d0cd76735183ab8351"
//     },
//     "ownerId": {
//       "$oid": "678ce4d0cd76735183ab8350"
//     },
//     "TimeTable": {
//       "1": [
//         {
//           "subject": {
//             "_id": {
//               "$oid": "678dfa8ad5665f6a3eb3fa67"
//             },
//             "subjectCode": "CSE357",
//             "subjectName": "Advanced Data Structures",
//             "department": "CSE",
//             "isElective": false
//           },
//           "branch": "CSE",
//           "semester": "VI",
//           "timing": "12:00-01:00PM",
//           "section": "1",
//           "location": "LRC A Block Ground Floor",
//           "course": "B-Tech",
//           "session": "2022-26"
//         }
//       ],
//       "2": [],
//       "3": [
//         {
//           "subject": {
//             "_id": {
//               "$oid": "678dfa8ad5665f6a3eb3fa67"
//             },
//             "subjectCode": "CSE357",
//             "subjectName": "Advanced Data Structures",
//             "department": "CSE",
//             "isElective": false
//           },
//           "branch": "CSE",
//           "semester": "VI",
//           "timing": "11:00-12:00PM",
//           "section": "1",
//           "location": "LRC A Block Ground Floor",
//           "course": "B-Tech",
//           "session": "2022-26"
//         }
//       ],
//       "4": [],
//       "5": [
//         {
//           "subject": {
//             "_id": {
//               "$oid": "678dfa8ad5665f6a3eb3fa67"
//             },
//             "subjectCode": "CSE357",
//             "subjectName": "Advanced Data Structures",
//             "department": "CSE",
//             "isElective": false
//           },
//           "branch": "CSE",
//           "semester": "VI",
//           "timing": "12:00-01:00PM",
//           "section": "1",
//           "location": "LRC A Block Ground Floor",
//           "course": "B-Tech",
//           "session": "2022-26"
//         }
//       ],
//       "6": [],
//       "7": []
//     },
//     "assignedToMe": {
//       "1": [],
//       "2": [],
//       "3": [],
//       "4": [],
//       "5": [],
//       "6": [],
//       "7": []
//     },
//     "meAssignedToOther": {
//       "1": [],
//       "2": [],
//       "3": [],
//       "4": [],
//       "5": [],
//       "6": [],
//       "7": []
//     },
//     "request": [],
//     "meRequestedOther": []
//   }
