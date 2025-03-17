import { DataTypes, Op } from 'sequelize';

const generateLocationId = async (locationType, Location, transaction) => {
    const prefix = locationType.slice(0, 3).toUpperCase();

    const lastLocation = await Location.findOne({
        where: {
            locationId: { [Op.like]: `${prefix}%` },
        },
        order: [['createdAt', 'DESC']],
        transaction,
    });

    let suffix = '001';
    if (lastLocation) {
        const lastSuffix = parseInt(lastLocation.locationId.slice(3), 10);
        suffix = (lastSuffix + 1).toString().padStart(3, '0');
    }

    return `${prefix}${suffix}`;
};

export const createLocationModel = (sequelize) => {
    const Location = sequelize.define('Location', {
        locationId: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            unique: true,
        },
        locationType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        locationName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Add unique constraint if needed
        },
        locationContactNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [9, 12],
            },
        },
    });

    Location.beforeCreate(async (location, options) => {
        const transaction = options.transaction; // Use transaction for consistency
        location.locationId = await generateLocationId(location.locationType, Location, transaction);
    });

    return Location;
};
