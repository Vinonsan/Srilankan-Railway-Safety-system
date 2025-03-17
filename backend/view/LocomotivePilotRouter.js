import express from "express";
import {
    getAllLocomotivePilots,
    addLocomotivePilot,
    getLocomotivePilotById,
    updateLocomotivePilot,
    locomotivePilotLogin,
    verifyUsername,
    verifyEmail,
    sendOTP, 
    verifyOtp,
    resetPassword,
    updatePasswordById,
    deleteAllLocomotivePilots,
    deleteLocomotivePilotById,
    getUserIdByEmail
}
    from "../controller/LocomotivePilotController.js";

const router = express.Router();
router.get("/getAll", getAllLocomotivePilots);
router.get("/getByEmail/:email", getAllLocomotivePilots);
router.post("/addlocomotivePilot", addLocomotivePilot);
router.delete("/deletelocomotivePilot", deleteAllLocomotivePilots);
router.delete("/deletePilotById/:id", deleteLocomotivePilotById);
router.get('/getByLPid/:id', getLocomotivePilotById);
router.patch('/:id', updateLocomotivePilot);
router.post('/login', locomotivePilotLogin);
router.post('/verifyUsername', verifyUsername);
router.post('/verifyEmail', verifyEmail);
router.post('/sendOTP', sendOTP); 
router.post('/verifyOTP', verifyOtp);
router.post('/reset-password', resetPassword);
router.patch('/updatePassword/:id', updatePasswordById);


export default router;
