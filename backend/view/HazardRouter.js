import express from "express";
import { getAllHazards, addHazard ,getHazardsByLocation,deleteAllHazards} from "../controller/HazardController.js"; // Import hazard controller functions
const router = express.Router();

router.get("/getHazard", getAllHazards); // Route for getting all hazards
router.post("/addHazard", addHazard); // Route for adding a new hazard
router.get("/locationName/:locationName", getHazardsByLocation);
router.delete("/deleteHazards", deleteAllHazards);
export default router;
