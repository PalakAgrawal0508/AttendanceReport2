export default function jsonErrorHandler(err, req, res, next) {
	// Handle JSON parsing errors from express.json()
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		return res.status(400).json({ error: "Invalid JSON payload" });
	}
	next();
}
