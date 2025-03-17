import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Function to generate a unique locomotivePilotID
const generateLocomotivePilotId = async (LocomotivePilot) => {
    const count = await LocomotivePilot.count();
    return `LID${String(count + 1).padStart(3, '0')}`; // Generates IDs like LID001, LID002, etc.
};



export const createLocomotivePilotModel = (sequelize) => {
    const LocomotivePilot = sequelize.define('LocomotivePilot', {
        locomotivePilotID: {
            type: DataTypes.STRING(6),
            primaryKey: true,
        },
        locomotiveName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        locomotiveEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        locomotivePhoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [9, 15], // Adjust based on your phone number requirements
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,  // Ensure a password is provided
            validate: {
                len: [8, 100] // Allowing up to 100 characters for a hashed password
            }
        },
        otp: {
            type: DataTypes.STRING(6), // 6-digit OTP
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE, // OTP expiry time
            allowNull: true,
        }
    });

    // Pre-save hook to automatically generate locomotivePilotID and hash the password
    LocomotivePilot.beforeCreate(async (pilot) => {
        pilot.locomotivePilotID = await generateLocomotivePilotId(LocomotivePilot);

        // Generate a random password if not provided, then hash it
        if (!pilot.password) {
            pilot.password = generateRandomPassword();
        }

        // Log the password for debugging
        console.log('Generated Password before hashing:', pilot.password);

        // Hash the password before saving
        const saltRounds = 10;
        pilot.password = await bcrypt.hash(pilot.password, saltRounds);
        
        // Log the hashed password for debugging
        console.log('Hashed Password:', pilot.password);
    });

    return LocomotivePilot;
};
