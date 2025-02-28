// Only Director role has the access to this controller  
import { getDepartments } from "../Pipelines/Departments.pipeline.js";
import { getDB } from "../config/mongodb.js";

export const getDepts = async (req, res) => {
	try {
		const db = getDB();
		const pipeline = await getDepartments(); // changed: added await so pipeline is an array
		const result = await db.collection("User").aggregate(pipeline).toArray();
		return res.status(200).json(result);
	} catch (error) {
		console.error("Error fetching departments:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
