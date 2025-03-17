import { LocomotivePilotHazardModel, LocomotivePilotModel, LocationModel } from "../postgres/postgres.js";

export const addHazard = async (req, res) => {
    const { locomotivePilotID, locationName, HazardType, Date, description } = req.body;
  
    try {
      // Validation
      if (!locomotivePilotID || !locationName || !HazardType || !Date) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Check if locomotivePilotID exists
      const pilot = await LocomotivePilotModel.findByPk(locomotivePilotID);
      if (!pilot) {
        return res.status(404).json({ error: "Locomotive Pilot not found." });
      }
  
      // Check if locationName exists
      const location = await LocationModel.findOne({ where: { locationName } });
      if (!location) {
        return res.status(404).json({ error: "Location not found." });
      }
  
      // Create the hazard
      const newHazard = await LocomotivePilotHazardModel.create({
        locomotivePilotID,
        locationId: location.locationId,
        HazardType,
        Date,
        description,
      });
  
      return res.status(201).json({
        success: true,
        message: "Hazard added successfully",
        newHazard,
      });
    } catch (error) {
      console.error("Error adding hazard:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message || error,
      });
    }
  };


  
export const getRecordHazards = async (req, res) => {
  try {
    const hazards = await LocomotivePilotHazardModel.findAll();
    return res.status(200).json({ success: true, hazards });
  } catch (error) {
    console.error("Error fetching hazards:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || error,
    });
  }
};


// Count all hazards
export const countHazards = async (req, res) => {
  try {
    const hazardCount = await LocomotivePilotHazardModel.count();
    return res.status(200).json({ success: true, count: hazardCount });
  } catch (error) {
    console.error('Error counting hazards:', error.message || error);
    return res.status(500).json({ error: 'Failed to count hazards', details: error.message });
  }
};

// Get all hazards with associated details
export const getAllHazards = async (req, res) => {
  try {
    const hazards = await LocomotivePilotHazardModel.findAll({
      include: [
        {
          model: LocomotivePilotModel,
          as: "pilot", // Matches the alias defined in the association
          attributes: ["locomotiveName", "locomotivePhoneNo"],
        },
        {
          model: LocationModel,
          as: "location", // Matches the alias defined in the association
          attributes: ["locationName", "locationContactNumber"],
        },
      ],
    });

    // Map results to format the output
    const formattedHazards = hazards.map((hazard) => ({
      HazardID: hazard.HazardID,
      locomotivePilotID: hazard.locomotivePilotID,
      locationId: hazard.locationId,
      HazardType: hazard.HazardType,
      Date: hazard.Date,
      description: hazard.description,
      createdAt: hazard.createdAt,
      updatedAt: hazard.updatedAt,
      locomotiveName: hazard.pilot?.locomotiveName || null,
      locomotivePhoneNo: hazard.pilot?.locomotivePhoneNo || null,
      locationName: hazard.location?.locationName || null,
      locationContactNumber: hazard.location?.locationContactNumber || null,
    }));

    return res.status(200).json({ success: true, hazards: formattedHazards });
  } catch (error) {
    console.error("Error fetching hazards:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || error,
    });
  }
};

// Get a hazard by ID
export const getHazardById = async (req, res) => {
  const { HazardID } = req.params;

  try {
    if (!HazardID) {
      return res.status(400).json({ error: "Hazard ID is required." });
    }

    const hazard = await LocomotivePilotHazardModel.findOne({
      where: { HazardID },
      include: [
        {
          model: LocomotivePilotModel,
          as: "pilot", // Matches the alias defined in the association
          attributes: ["locomotiveName", "locomotivePhoneNo"],
        },
        {
          model: LocationModel,
          as: "location", // Matches the alias defined in the association
          attributes: ["locationName", "locationContactNumber"],
        },
      ],
    });

    if (!hazard) {
      return res.status(404).json({ error: "Hazard not found." });
    }

    // Format the result to match the desired output
    const formattedHazard = {
      HazardID: hazard.HazardID,
      locomotivePilotID: hazard.locomotivePilotID,
      locationId: hazard.locationId,
      HazardType: hazard.HazardType,
      Date: hazard.Date,
      description: hazard.description,
      createdAt: hazard.createdAt,
      updatedAt: hazard.updatedAt,
      locomotiveName: hazard.pilot?.locomotiveName || null,
      locomotivePhoneNo: hazard.pilot?.locomotivePhoneNo || null,
      locationName: hazard.location?.locationName || null,
      locationContactNumber: hazard.location?.locationContactNumber || null,
    };

    return res.status(200).json({ success: true, hazard: formattedHazard });
  } catch (error) {
    console.error("Error fetching hazard:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || error,
    });
  }
};


  // Delete a hazard by ID
export const deleteHazardById = async (req, res) => {
  const { HazardID } = req.params;

  try {
      // Validate input
      if (!HazardID) {
          return res.status(400).json({ error: "Hazard ID is required." });
      }

      // Find the hazard by ID
      const hazard = await LocomotivePilotHazardModel.findOne({ where: { HazardID } });

      if (!hazard) {
          return res.status(404).json({ error: "Hazard not found." });
      }

      // Delete the hazard
      await LocomotivePilotHazardModel.destroy({ where: { HazardID } });

      return res.status(200).json({
          success: true,
          message: `Hazard with ID ${HazardID} deleted successfully.`,
      });
  } catch (error) {
      console.error("Error deleting hazard:", error);
      return res.status(500).json({
          error: "Internal server error",
          details: error.message || error,
      });
  }
};
