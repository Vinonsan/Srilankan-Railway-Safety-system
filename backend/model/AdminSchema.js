import { DataTypes } from "sequelize";
const generateAdminId = async (AdminModel) => {
  const count = await AdminModel.count();
  return `AID${String(count + 1).padStart(3, "0")}`; // Generates IDs like AID001, AID002, etc.
};

export const createAdminModel = (sequelize) => {
  const Admin = sequelize.define("Admin", {
    AdminId: {
      type: DataTypes.STRING(6), // Like AID001
      primaryKey: true, // Primary key
      unique: true,
    },

    AdminName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures proper email format
      },
    },

    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [8, 8], // Minimum length of 8 characters
          msg: "Password must be at least 8 characters long.",
        },
        isComplexPassword(value) {
          // Ensuring the password contains uppercase, lowercase, and special characters
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
          if (!regex.test(value)) {
            throw new Error(
              "Password must contain at least one uppercase letter, one lowercase letter, and one special character."
            );
          }
        },
      },
    },
  });

  Admin.beforeCreate(async (admin) => {
    admin.AdminId = await generateAdminId(Admin);
  });

  return Admin;
};
