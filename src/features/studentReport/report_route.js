import express from "express";
const reportRoutes = express.Router();
reportRoutes.get("/attendance", (req, res) => {
  console.log(req.query);
  res.json(req.query);
});
export default reportRoutes;
