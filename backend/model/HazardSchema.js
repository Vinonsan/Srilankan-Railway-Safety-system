import { DataTypes, Op } from 'sequelize';

// Function to generate HazardID based on HazardType
const generateHazardID = async (hazardType, Hazard) => {
    const prefix = hazardType.slice(0, 3).toUpperCase(); 
        
    const lastHazard = await Hazard.findOne({
        where: {
            HazardID: { [Op.like]: `${prefix}%` } 
        },
        order: [['createdAt', 'DESC']] // Sort by creation date to get the latest
    });

    let suffix = '001'; // Default suffix if no matching record is found
    if (lastHazard) {
        const lastId = lastHazard.HazardID;
        const lastSuffix = parseInt(lastId.slice(3)); // Extract the numeric part of the last ID
        suffix = (lastSuffix + 1).toString().padStart(3, '0'); // Increment and pad with zeros
    }

    return `${prefix}${suffix}`; // Return the new ID, e.g., "ELE001", "BUL002", etc.
};

export const createHazardModel = (sequelize) => {
    const Hazard = sequelize.define('Hazard', {
        HazardID: {
            type: DataTypes.STRING(6),
            primaryKey: true,
        },
        HazardType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        LocationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
        },
    }, {
        hooks: {
            beforeCreate: async (hazard) => {
                hazard.HazardID = await generateHazardID(hazard.HazardType, Hazard);
            },
        },
        indexes: [
            {
                unique: true,
                fields: ['LocationName', 'HazardType'], // Ensure the combination of LocationName and HazardType is unique
            },
            {
                unique: true,
                fields: ['HazardID'], 
            },
        ],
    });

    return Hazard;
};
