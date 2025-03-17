import { HazardModel } from "../postgres/postgres.js"; // Import the Hazard model

// GET - Retrieve all hazards
export const getAllHazards = async (req, res) => {
  try {
    const hazards = await HazardModel.findAll();
    if (hazards.length == 0) {
      return res.status(200).json({ error: "No hazards found" });
    }
    return res.status(200).json(hazards);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST - Add a new hazard
export const addHazard = async (req, res) => {
  const { HazardType, LocationName, Description } = req.body;
  try {
    const hazard = await HazardModel.create({
      HazardType,
      LocationName,
      Description,
    });
    return res
      .status(201)
      .json({
        message: "Hazard added successfully",
        HazardID: hazard.HazardID,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// GET - Retrieve hazards by LocationName
export const getHazardsByLocation = async (req, res) => {
  const { locationName } = req.params; // Extract locationName from request parameters
  try {
    const hazards = await HazardModel.findAll({
      where: { LocationName: locationName }, // Filter hazards by LocationName
    });

    if (hazards.length === 0) {
      return res
        .status(200)
        .json({ error: "No hazards found for this location" });
    }
    return res.status(200).json(hazards);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE - Remove all hazards
export const deleteAllHazards = async (req, res) => {
  try {
    const deletedCount = await HazardModel.destroy({
      where: {}, // No condition means delete all records
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "No hazards found to delete" });
    }

    return res
      .status(200)
      .json({ message: `${deletedCount} hazards deleted successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
