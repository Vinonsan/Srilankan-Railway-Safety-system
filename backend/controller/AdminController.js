import { AdminModel } from "../postgres/postgres.js";

// GET - Retrieve all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.findAll();
    if (admins.length == 0) {
      return res.status(200).json({ "error": "No admins found" });
    }
    return res.status(200).json(admins);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "error": "Internal server error" });
  }
}

// POST - Add a new admin
export const addAdmin = async (req, res) => {
  const { AdminName, Email, Password } = req.body;
  try {
    const existingAdmin = await AdminModel.findOne({ where: { Email: Email } });

    if (existingAdmin) {
      return res.status(200).json({ message: "Admin with this email already exists" });
    }

    const newAdmin = await AdminModel.create({
      AdminName,
      Email,
      Password,
    });

    return res.status(201).json({ message: "Admin added successfully", newAdmin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "error": "Internal server error" });
  }
}
// Get an admin by ID (New function)
export const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await AdminModel.findOne({ where: { AdminId: id } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST - Admin login with AdminId and password
export const adminLogin = async (req, res) => {
  const { AdminId, Password } = req.body;

  try {
      const admin = await AdminModel.findOne({ where: { AdminId } });
      if (!admin) {
          return res.status(404).json({ error: 'Admin ID not found' });
      }

      if (admin.Password !== Password) {
          return res.status(401).json({ error: 'Incorrect password' });
      }

      return res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};
