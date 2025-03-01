import { getDB } from "../../config/mongodb.js";
import { getBranches as branchPipeline } from "../../Pipelines/getBranches.pipeline.js";
import { ApplicationError } from "../../errorHandle/error.js";

export class ClassReportController {

	constructor() {
		this.StudentCollection = "Student";
	}

	async getBranches(req, res) {
		try {
			const db = await getDB();
			const pipeline = branchPipeline();
			const branches = await db
				.collection(this.StudentCollection)
				.aggregate(pipeline)
				.toArray();
			console.log(branches,"\n");
			res.status(200).json(branches);
		} catch (error) {
			if (error instanceof ApplicationError) {
				throw new ApplicationError(error.message, 500);
			}
			console.error("Error fetching branches:", error.message);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}
}
