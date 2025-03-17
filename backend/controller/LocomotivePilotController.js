import { LocomotivePilotModel } from "../postgres/postgres.js"; 
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // For password hashing

// Load environment variables
dotenv.config();

// Create a Nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use your 16-digit app password
        },
    });
};
// Send the welcome email with password and locomotivePilotID
const sendWelcomeEmail = async (locomotiveName, locomotiveEmail, locomotivePilotID, password) => {
    const transporter = createTransporter();
    const encodedEmail = encodeURIComponent(locomotiveEmail); // Encoding the email to prevent issues with special characters
    const passwordResetLink = `http://localhost:5173/changepassword?email=${encodedEmail}}`; // Link to your ChangePassword page

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: locomotiveEmail,
        subject: 'Welcome to Railway Safety System - Your Credentials',
        text: `Dear ${locomotiveName},\nYour account has been created successfully!\n\nHere are your login credentials:\n\nEmail: ${locomotiveEmail}\nPassword: ${password}\nLocomotive Pilot ID: ${locomotivePilotID}\n\nFor security reasons, please change your password after logging in.\n\nTo change your password, click the following link: ${passwordResetLink}\n\nBest regards,\nRailway Safety System Team.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${locomotiveEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Function to generate a random OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to generate a random 8-character password
const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};


export const sendOTP = async (req, res) => {
    const { locomotiveEmail } = req.body;
    const otp = generateOtp(); // Generate a new OTP

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: locomotiveEmail,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        // Check if the user exists
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotiveEmail } });
        if (!pilot) {
            console.error('Email not found in database:', locomotiveEmail);
            return res.status(404).json({ message: "Email not found" });
        }

        // Store the OTP in the user's record
        await LocomotivePilotModel.update(
            { otp }, // Assuming you have an OTP field in the model
            { where: { locomotiveEmail } }
        );

        console.log(`OTP ${otp} sent to ${locomotiveEmail}`);
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${locomotiveEmail}`);
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: "Failed to send OTP" });
    }
};



export const verifyOtp = async (req, res) => {
    const { locomotiveEmail, otp } = req.body;

    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotiveEmail } });
        if (!pilot) {
            console.log("Email not found:", locomotiveEmail);
            return res.status(404).json({ message: "Email not found" });
        }

        // Log OTP from database and input OTP to compare
        console.log(`Database OTP for ${locomotiveEmail}: ${pilot.otp}`);
        console.log(`Provided OTP: ${otp}`);

        // Verify the OTP (convert both to string to avoid type mismatch)
        if (String(pilot.otp) !== String(otp)) {
            console.log("Invalid OTP provided.");
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP verified successfully, clear it from the record
        pilot.otp = null;
        await pilot.save(); // Ensure save is successful

        console.log(`OTP for ${locomotiveEmail} verified and cleared from record.`);
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};




// Get all locomotive pilots
export const getAllLocomotivePilots = async (req, res) => {
    try {
        const pilots = await LocomotivePilotModel.findAll();
        if (pilots.length === 0) {
            return res.status(404).json({ message: "No locomotive pilots found" });
        }
        return res.status(200).json(pilots);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const addLocomotivePilot = async (req, res) => {
    const { locomotiveName, locomotiveEmail, locomotivePhoneNo, password } = req.body;

    try {
        const existingPilot = await LocomotivePilotModel.findOne({ where: { locomotiveEmail } });
        if (!existingPilot) {
            // Generate a random password if none is provided
            const passwordToUse = password || generateRandomPassword();
            const hashedPassword = await bcrypt.hash(passwordToUse, 10);

            // Create the new locomotive pilot without manually adding the ID
            const newPilot = await LocomotivePilotModel.create({
                locomotiveName,
                locomotiveEmail,
                locomotivePhoneNo,
                password: hashedPassword, // Store hashed password
            });

            // Ensure the ID is correctly returned and accessible
            const locomotivePilotID = newPilot.locomotivePilotID;

            // Send the welcome email with the generated password and pilot ID
            await sendWelcomeEmail(locomotiveName, locomotiveEmail, locomotivePilotID, passwordToUse);

            return res.status(201).json({ message: "Locomotive pilot added successfully", newPilot });
        }

        return res.status(409).json({ message: "Locomotive pilot already exists" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



// Get locomotive pilot by ID
export const getLocomotivePilotById = async (req, res) => {
    const { id } = req.params;

    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID: id } });
        if (!pilot) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }
        return res.status(200).json(pilot);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update a locomotive pilot by ID
export const updateLocomotivePilot = async (req, res) => {
    const { id } = req.params;
    const { locomotiveName, locomotiveEmail, locomotivePhoneNo } = req.body;

    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID: id } });

        if (!pilot) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }

        // Update the locomotive pilot's details
        await LocomotivePilotModel.update(
            { locomotiveName, locomotiveEmail, locomotivePhoneNo }, 
            { where: { locomotivePilotID: id } }
        );

        return res.status(200).json({ message: "Locomotive pilot updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// POST - Locomotive pilot login with locomotivePilotID and password
export const locomotivePilotLogin = async (req, res) => {
    const { locomotivePilotID, password } = req.body;

    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID } });

        if (!pilot) {
            return res.status(404).json({ error: 'Locomotive Pilot ID not found' });
        }

        // Verify the password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, pilot.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        return res.status(200).json({ message: 'Login successful', pilot });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Verify if username exists
export const verifyUsername = async (req, res) => {
    const { locomotiveName } = req.body;
    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotiveName } });
        if (!pilot) {
            return res.status(404).json({ message: "Username not found" });
        }
        return res.status(200).json({ message: "Username exists" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Verify if email exists
export const verifyEmail = async (req, res) => {
    const { locomotiveName, locomotiveEmail } = req.body;

    try {
        const pilot = await LocomotivePilotModel.findOne({
            where: {
                locomotiveName, 
                locomotiveEmail 
            }
        });

        if (pilot) {
            // Return the ID along with the success message
            return res.status(200).json({
                message: "Email verified successfully",
                locomotivePilotID: pilot.locomotivePilotID // Include the pilot's ID
            });
        }

        return res.status(404).json({ message: "Email not found or not associated with this username" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Reset password function without needing the old password
export const resetPassword = async (req, res) => {
    const { locomotivePilotID, password } = req.body; // Using password directly

    try {
        // Find the locomotive pilot by ID
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID } });

        if (!pilot) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        await LocomotivePilotModel.update(
            { password: hashedPassword },
            { where: { locomotivePilotID } }
        );

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update password using user ID with PATCH
export const updatePasswordById = async (req, res) => {
    const { id } = req.params;  // Get the ID from URL parameters
    const { password } = req.body; // Get the new password from the request body

    // Validate the incoming password
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        console.log('Received request to update password for ID:', id);

        // Attempt to find the user by ID
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID: id } });

        if (!pilot) {
            console.log("Locomotive pilot not found for ID:", id);
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        await LocomotivePilotModel.update(
            { password: hashedPassword },
            { where: { locomotivePilotID: id } }
        );

        console.log('Password updated successfully for ID:', id);
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete all locomotive pilots
export const deleteAllLocomotivePilots = async (req, res) => {
    try {
        const deletedPilots = await LocomotivePilotModel.destroy({
            where: {},
        });

        if (deletedPilots === 0) {
            return res.status(404).json({ message: "No locomotive pilots found to delete" });
        }

        return res.status(200).json({ message: `${deletedPilots} locomotive pilots deleted successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete locomotive pilot by ID
export const deleteLocomotivePilotById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPilot = await LocomotivePilotModel.destroy({
            where: { locomotivePilotID: id },
        });

        if (deletedPilot === 0) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }

        return res.status(200).json({ message: "Locomotive pilot deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch user ID by email
export const getUserIdByEmail = async (req, res) => {
    const { email } = req.query; // Extract email from query parameters
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Search for a user with the specified email
        const user = await LocomotivePilotModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with the user ID
        return res.status(200).json({ userId: user._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
