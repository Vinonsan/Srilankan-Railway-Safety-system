/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "./../style/ResetPassword.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import axios from "axios";
import { Modal } from "react-bootstrap"; // Import Modal

function ResetPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailVisible, setEmailVisible] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [pilotId, setPilotId] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal state
  const [messageStyle, setMessageStyle] = useState(""); // Initialize style

  // Function to handle username verification
  const handleUsernameVerification = async () => {
    // Check if the username is empty
    if (!username.trim()) {
      setMessage("Please enter the username.");
      setMessageStyle("error"); // Set style to error
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/locomotivePilot/verifyUsername",
        { locomotiveName: username }
      );
      if (response.status === 200) {
        setEmailVisible(true);
        setMessage("Username found. Please enter your email.");
        setMessageStyle("success");
      }
    } catch (error) {
      setMessage("Username not found.");
      setMessageStyle("error"); // Set style to error
      setEmailVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to verify email and send OTP
  const handleEmailVerification = async () => {
    if (!email.trim()) {
      setMessage("Please enter the email associated with the username.");
      setMessageStyle("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/locomotivePilot/verifyEmail",
        {
          locomotiveName: username,
          locomotiveEmail: email,
        }
      );
      if (response.status === 200) {
        setMessage("");
        setMessageStyle(""); // Clear style for success
        setPilotId(response.data.locomotivePilotID); // Set the pilot ID here
        await handleSendOtp();
      }
    } catch (error) {
      setMessage("Email not associated with the username.");
      setMessageStyle("error");
      setOtpVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/locomotivePilot/sendOtp",
        {
          locomotiveName: username,
          locomotiveEmail: email,
        }
      );
      if (response.status === 200) {
        setOtpVisible(true);
        setMessage("OTP sent to your email. Please enter it.");
        setMessageStyle("success");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
      setMessageStyle("error"); // Set style to error
      setOtpVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      setMessage("Please enter the OTP sent to your email.");
      setMessageStyle("error"); // Set style to error
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/locomotivePilot/verifyOTP",
        {
          locomotiveEmail: email,
          otp: otp,
        }
      );
      if (response.status === 200) {
        setResetPasswordVisible(true); // Show reset password fields
        setMessage(
          "OTP verified successfully. Please enter your new password."
        );
        setMessageStyle("success");
      }
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Invalid OTP. Please try again.";
      setMessage(errorMsg);
      setMessageStyle("error"); // Set style to error
      setResetPasswordVisible(false); // Hide reset password fields if OTP is invalid
    } finally {
      setLoading(false);
    }
  };

  // Function to verify Reset Password
  const handleResetPassword = async () => {
    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageStyle("error"); // Set style to error
      return;
    }
    setMessage("");
    setMessageStyle("");
    // Ensure pilotId exists before making the request
    if (!pilotId) {
      setMessage("Pilot ID is required to reset password.");
      setMessageStyle("error"); // Set style to error
      return;
    }

    try {
      // Send request to update the password
      const response = await axios.patch(
        `http://localhost:8000/locomotivePilot/updatePassword/${pilotId}`,
        {
          password: newPassword,
        }
      );

      // If the password update is successful
      if (response.status === 200) {
        setShowModal(true); // Show the modal success message
        setTimeout(() => {
          navigate("/"); // Redirect to login page after a delay
        }, 2000);
      }
    } catch (error) {
      // Handle errors if the request fails
      const errorMsg = error.response
        ? error.response.data.message
        : "Failed to reset password.";
      setMessage(errorMsg);
      setMessageStyle("error"); // Set style to error
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

          {!emailVisible && !otpVisible && (
            <Form.Floating className="mb-3">
              <Form.Control
                id="floatingUsername"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="ResetPassword-username-textbox"
              />
              <label
                htmlFor="floatingUsername"
                className="ResetPassword-username-label"
              >
                Username
              </label>
              {/* Display message */}
              <div className={`ResetPassword-message ${messageStyle}`}>
                <p>{message}</p>
              </div>

              {loading ? ( // Show loading state
                <p>Loading...</p>
              ) : (
                <Button
                  variant="#387373"
                  className="ResetPassword-sumbit-button"
                  onClick={handleUsernameVerification}
                >
                  Verify Username
                </Button>
              )}
            </Form.Floating>
          )}

          {emailVisible && !otpVisible && (
            <>
              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingEmail"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ResetPassword-username-textbox"
                />
                <label
                  htmlFor="floatingEmail"
                  className="ResetPassword-username-label"
                >
                  Email
                </label>
                {/* Display message */}
                <div className={`ResetPassword-message ${messageStyle}`}>
                  <p>{message}</p>
                </div>

                {loading ? ( // Show loading state
                  <p>Loading...</p>
                ) : (
                  <Button
                    variant="primary"
                    className="ResetPassword-sumbit-button"
                    onClick={handleEmailVerification}
                  >
                    Verify Email
                  </Button>
                )}
              </Form.Floating>
            </>
          )}
          {otpVisible && !resetPasswordVisible && (
            <>
              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingOtp"
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="ResetPassword-otp-textbox"
                />
                <label
                  htmlFor="floatingOtp"
                  className="ResetPassword-otp-label"
                >
                  OTP
                </label>
                {/* Display message */}
                <div className={`ResetPassword-message ${messageStyle}`}>
                  <p>{message}</p>
                </div>
              </Form.Floating>

              {loading ? ( // Show loading state
                <p>Loading...</p>
              ) : (
                <Button
                  variant="primary"
                  className="ResetPassword-sumbit-button"
                  onClick={handleOtpVerification}
                >
                  Verify OTP
                </Button>
              )}
            </>
          )}

          {resetPasswordVisible && (
            <>
              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingPilotId"
                  type="text"
                  placeholder="Pilot ID"
                  value={pilotId}
                  readOnly
                  className="ResetPassword-pilot-id-textbox"
                />
                <label
                  htmlFor="floatingPilotId"
                  className="ResetPassword-pilot-id-label"
                >
                  Pilot ID
                </label>
              </Form.Floating>

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

              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingConfirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
                {/* Display message */}
                <div className={`ResetPassword-message ${messageStyle}`}>
                  <p>{message}</p>
                </div>
              </Form.Floating>

              <Button
                variant="primary"
                className="ResetPassword-sumbit-button"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </>
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

export default ResetPassword;
