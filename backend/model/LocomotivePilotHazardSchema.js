import { DataTypes } from "sequelize";

export const createLocomotivePilotHazardModel = (sequelize) => {
  const LocomotivePilotHazard = sequelize.define('LocomotivePilotHazard', {
    HazardID: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      unique: true,
    },
    locomotivePilotID: {
      type: DataTypes.STRING(6),
      allowNull: false,
      references: {
        model: 'LocomotivePilots',
        key: 'locomotivePilotID',
      },
    },
    locationId: {  // Updated to reference locationId instead of locationName
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'Locations',
        key: 'locationId',  // Correctly referencing locationId
      },
    },
    HazardType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    hooks: {
      beforeCreate: async (hazard, options) => {
        console.log('Generating HazardID...');
        const hazardPrefix = hazard.HazardType.substring(0, 3).toUpperCase();

        const lastHazard = await LocomotivePilotHazard.findOne({
          where: { HazardType: hazard.HazardType },
          order: [['HazardID', 'DESC']],
          transaction: options.transaction,
        });

        let newIdNumber = '001';
        if (lastHazard) {
          const lastIdNumber = parseInt(lastHazard.HazardID.slice(3), 10);
          newIdNumber = String(lastIdNumber + 1).padStart(3, '0');
        }

        hazard.HazardID = `${hazardPrefix}${newIdNumber}`;
        console.log('Generated HazardID:', hazard.HazardID);
      },
    },
    timestamps: true,
  });

  return LocomotivePilotHazard;
};
