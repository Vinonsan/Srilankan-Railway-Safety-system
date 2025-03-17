import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./../style/ChangePassword.css";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import axios from "axios";
import { Modal } from "react-bootstrap";

function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState(""); // State for User ID
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [showModal, setShowModal] = useState(false); // Modal state
    const [messageStyle, setMessageStyle] = useState(""); // Initialize style
    const [userDetails, setUserDetails] = useState(null); // State for storing user details

    // Get userId from the URL query string
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userIdFromQuery = queryParams.get("userId");
        setUserId(userIdFromQuery); // Set the userId state from the query string

        // Fetch user details based on userId
        if (userIdFromQuery) {
            fetchUserDetails(userIdFromQuery);
        }
    }, [location]);

    // Function to fetch user details
    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/locomotivePilot/${userId}`);
            setUserDetails(response.data); // Set the fetched user details
        } catch (error) {
            setMessage("Failed to load user details.");
            setMessageStyle("error");
        }
    };

    // Function to verify and reset password
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setMessageStyle("error");
            return;
        }
        setMessage("");
        setMessageStyle("");

        // If userId or password is missing
        if (!userId || !newPassword || !confirmPassword) {
            setMessage("Please fill in all fields.");
            setMessageStyle("error");
            return;
        }

        try {
            // Make the API call to update the password
            const response = await axios.patch(
                `http://localhost:8000/locomotivePilot/updatePassword/${userId}`,
                { password: newPassword }
            );

            if (response.status === 200) {
                setShowModal(true); // Show the modal success message
                setTimeout(() => {
                    navigate("/"); // Redirect to login page after a delay
                }, 2000);
            }
        } catch (error) {
            const errorMsg = error.response
                ? error.response.data.message
                : "Failed to reset password.";
            setMessage(errorMsg);
            setMessageStyle("error");
        }
    };

    return (
        <div className="container-flex vh-100">
            <div className="row vh-100">
                <div className="ResetPassword-main col-12">
                    <div className="ResetPassword-header-box-img container-flex">
                        <h1>
                            <MdLockReset />
                        </h1>
                    </div>
                    <div className="ResetPassword-header-box-title">
                        <h1>Reset Password</h1>
                    </div>
                    <div className="ResetPassword-header-box-description">
                        <p>
                            The reset password feature is essential for maintaining account
                            security and providing users with a way to regain access to their
                            accounts in case they forget their passwords. It often
                            incorporates security measures such as email verification and
                            secure password reset forms to ensure the process is secure and
                            reliable.
                        </p>
                    </div>

                    {/* User ID Field */}
                    <Form.Floating className="mt-4 mb-3">
                        <Form.Control
                            id="floatingUserId"
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            disabled={false} // Allow editing if needed
                        />
                        <label htmlFor="floatingUserId">User ID</label>
                    </Form.Floating>


                    {/* New Password Field */}
                    <Form.Floating className="mt-4 mb-3">
                        <Form.Control
                            id="floatingNewPassword"
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label htmlFor="floatingNewPassword">New Password</label>
                    </Form.Floating>

                    {/* Confirm Password Field */}
                    <Form.Floating className="mt-4 mb-3">
                        <Form.Control
                            id="floatingConfirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                    </Form.Floating>

                    {/* Display message */}
                    <div className={`ResetPassword-message ${messageStyle}`}>
                        <p>{message}</p>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Button
                            variant="primary"
                            className="ResetPassword-sumbit-button"
                            onClick={handleResetPassword}
                        >
                            Update Password
                        </Button>
                    )}

                    <div className="ResetPassword-back">
                        <p onClick={() => navigate("/")}>Back to login?</p>
                    </div>

                    {/* Modal for password reset confirmation */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Password Reset Successful</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Your password has been updated successfully!</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
