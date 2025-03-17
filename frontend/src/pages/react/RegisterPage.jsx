/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "./../style/RegisterPage.css";
import { useNavigate } from 'react-router-dom';
import { GiElephant } from "react-icons/gi";
import { MdLandslide } from "react-icons/md";
import { FaTrainSubway } from "react-icons/fa6";
import { FaCarSide } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaCloudSunRain } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

function RegisterPage() {
  const [formData, setFormData] = useState({
    locomotiveName: '',
    locomotiveEmail: '',
    locomotivePhoneNo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

  // validation for text filed 
  if (formData.locomotiveName.trim() === "" && formData.locomotiveEmail.trim() === "" && formData.locomotivePhoneNo.trim() === "") {
    setError("All fields are required.");
    setShowErrorModal(true);
    return;
  } else if (formData.locomotiveName.trim() === "") {
    setError("Locomotive pilot field is empty.");
    setShowErrorModal(true);
    return;
  } else if (formData.locomotiveEmail.trim() === "") {
    setError("Locomotive Email field is empty.");
    setShowErrorModal(true);
    return;
  } else if (formData.locomotivePhoneNo.trim() === "") {
    setError("Locomotive Phone Number field is empty.");
    setShowErrorModal(true);
    return;
  }

  const nameRegex = /^[a-zA-Z\s]*$/;
  if (!nameRegex.test(formData.locomotiveName.trim())) {
    setError("Locomotive Name should not contain numbers or symbols.");
    setShowErrorModal(true);
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(formData.locomotiveEmail.trim())) {
    setError("Invalid email format.");
    setShowErrorModal(true);
    return;
  }

  const phoneRegex = /^[0-9\s]*$/;
  if (!phoneRegex.test(formData.locomotivePhoneNo.trim())) {
    setError("Phone number should not contain letters or symbols.");
    setShowErrorModal(true);
    return;
  }

   
  try {
    const response = await axios.post('http://localhost:8000/locomotivePilot/addLocomotivePilot', formData);
    console.log(response.data);
    setError(''); // Clear previous errors
    setSuccess(true); // Show success message
    setFormData({ locomotiveName: '', locomotiveEmail: '', locomotivePhoneNo: '' }); // Reset form

    // Redirect after success
    setTimeout(() => {
      navigate('/');
    }, 2000);
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.response && error.response.data) {
      setError(error.response.data.error || 'Registration failed. Please try again.'); // Informative error
    } else {
      setError('Registration failed. Please try again.'); // Generic error
    }
    setShowErrorModal(true); // Show error modal
  }
};

  const handleCloseErrorModal = () => setShowErrorModal(false);



  return (
    <div>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* left side bar start */}
          <div className="RegisterPage-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="hazard-RegisterPage-header-box container-flex">
              <div className="hazard-RegisterPage-header-title">Sri Lanka Railway Safety System</div>
            </div>
            <div className="hazard-RegisterPage-description-box container-flex">
              <div className="hazard-RegisterPage-header-description"><p>The login process for our Railway Safety System is straightforward and secure. Locomotive pilots or admins simply input their email and password on the login page. The system then verifies these details, ensuring only authorized personnel gain access. Upon successful verification, users are redirected to the main home page, where they can access tailored options and settings designed to facilitate a seamless navigation experience within the system.</p></div>
            </div>
            <div className="hazard-RegisterPage-line-box container-flex"></div>
            <div className="hazard-RegisterPage-circle-box container-flex">
              <div className="hazard-RegisterPage-circle1 container-flex">
                <GiElephant className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <MdLandslide className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <FaTrainSubway className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <FaCarSide className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <FaUserTie className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <FaCloudSunRain className="icon" />
              </div>
              <div className="hazard-RegisterPage-circle container-flex">
                <FaMapLocationDot className="icon" />
              </div>
            </div>
          </div>
          {/* left side bar end */}

          <div className="RegisterPage-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="hazard-RegisterPage-heading-box container-flex">
              <div className="hazard-RegisterPage-heading-title">Sign up Form</div>
            </div>
            <div className="hazard-RegisterPage-heading-line-box container-flex"></div>

            <Form onSubmit={handleSubmit}>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingName"
                  type="text"
                  name="locomotiveName"
                  placeholder="Name"
                  value={formData.locomotiveName}
                  onChange={handleChange}
                  className="hazard-RegisterPage-input-text-box"
                />
                <label htmlFor="floatingName">Name</label>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingEmail"
                  type="email"
                  name="locomotiveEmail"
                  placeholder="Email"
                  value={formData.locomotiveEmail}
                  onChange={handleChange}
                  className="hazard-RegisterPage-input-text-box"
                />
                <label htmlFor="floatingEmail">Email</label>
              </Form.Floating>
              <Form.Floating className="mb-3">
                <Form.Control
                  id="floatingPhoneNo"
                  type="tel"
                  name="locomotivePhoneNo"
                  placeholder="Phone Number"
                  value={formData.locomotivePhoneNo}
                  onChange={handleChange}
                  className="hazard-RegisterPage-input-text-box"
                />
                <label htmlFor="floatingPhoneNo">Phone Number</label>
              </Form.Floating>
              <div className="hazard-RegisterPage-login-button-box container-flex">
                <Button type="submit" className="hazard-RegisterPage-login-button">Sign up</Button>
              </div>
              <div className="hazard-RegisterPage-register-button-box container-flex">
                <Button className="hazard-RegisterPage-signup-button" onClick={() => navigate('/')}>Sign in</Button>
              </div>
            </Form>

            {success && (
              <Modal show={success} onHide={() => setSuccess(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Registration successful! You are redirecting to login page !</Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={() => setSuccess(false)}>Close</Button>
                </Modal.Footer>
              </Modal>
            )}

            {error && (
              <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                <Modal.Header closeButton className="modal-header">
                  <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">{error}</Modal.Body>
                <Modal.Footer className="modal-footer">
                  <Button 
                  variant="danger" 
                  onClick={handleCloseErrorModal}
                  className="modal-close-btn"
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
