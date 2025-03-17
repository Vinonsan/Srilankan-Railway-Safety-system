import express from "express";
import {
  getAllAdmins,
  addAdmin,
  getAdminById,
  adminLogin,
} from "../controller/AdminController.js";
const router = express.Router();

router.get("/getAllAdmins", getAllAdmins); // Route for getting all admins
router.post("/addAdmin", addAdmin); // Route for adding an admin
router.get("/getAdmin/:id", getAdminById);
router.post("/login", adminLogin);

export default router;
