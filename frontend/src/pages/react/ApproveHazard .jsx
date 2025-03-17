/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../style/ApproveHazard .css';
import { RiMessage2Fill } from 'react-icons/ri';
import { GiElephant } from 'react-icons/gi';
import { FaLocationDot } from 'react-icons/fa6';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

function ApproveHazard() {
  const [notifications, setNotifications] = useState([]);

  const [hazardCount, setHazardCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [inputLocation, setInputLocation] = useState('');
  const [inputHazard, setInputHazard] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [locationHazards, setLocationHazards] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false);
  const [selectedHazardId, setSelectedHazardId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/pilotHazard/getHazard')
      .then(response => {
        const { data } = response;
        if (data && Array.isArray(data.hazards)) {
          setNotifications(data.hazards);
          setHazardCount(data.hazards.length);
        } else {
          console.error('Expected an array in response.data.hazards but received:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching hazard data:', error);
      });
  }, []);




  const handleNotificationClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const markAsRead = (HazardID) => {
    if (!HazardID) {
      console.error("hazardID is missing!");
      return;
    }
    axios.get(`http://localhost:8000/pilotHazard/getHazardById/${HazardID}`)
      .then(response => {
        console.log("Hazard details:", response.data);
        setSelectedHazardId(HazardID);
      setShowModal(false);
      })
      .catch(error => {
        console.error("Error fetching hazard or pilot details:", error);
      });
  };


  const handleAcceptClick = async (type, value) => {
    if (type === 'hazard') {
      setInputHazard(value);
    } else if (type === 'location') {
      setInputLocation(value);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const month = monthNames[monthIndex];
  
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
  
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    const time = `${formattedHours}:${formattedMinutes} ${period}`;
  
    return { day, month, year, time };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    // Proceed with the form submission
    submitData();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const submitData = async () => {
    try {
      // Perform the POST request
      const postResponse = await axios.post('http://localhost:8000/hazard/addHazard', {
        LocationName: inputLocation,
        HazardType: inputHazard
      });
      console.log('POST response:', postResponse.data); // Log response data

      // Check if a hazard ID is selected for deletion
      if (selectedHazardId) {
        // Perform the DELETE request
        await axios.delete(`http://localhost:8000/pilotHazard/deleteHazardById/${selectedHazardId}`);
        console.log('DELETE successful'); // Log success message
      }

      // Update state after successful operations
      setSuccessMessage('Hazard data saved successfully and hazard deleted if applicable!');
      setErrorMessage('');
      setInputLocation('');
      setInputHazard('');

      // Navigate to a different page if needed
      navigate('/adminhomepage');

    } catch (error) {
      console.error('Operation failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Set error message from server response
      } else {
        setErrorMessage('Failed to save hazard data or delete hazard. Please try again.'); // Set a generic error message
      }
      setSuccessMessage('');
      setShowErrorModal(true); // Show error modal
    }
  };


  const handleDecline = () => {
    if (!selectedHazardId) {
      setErrorMessage('No hazard selected for deletion.');
      return;
    }
    setShowDeclineConfirmModal(true); // Show confirmation modal
  };

  const handleDeclineConfirm = async () => {
    setShowDeclineConfirmModal(false);
    try {
      await axios.delete(`http://localhost:8000/pilotHazard/deleteHazardById/${selectedHazardId}`);
      setSuccessMessage('Hazard deleted successfully!');
      setNotifications(notifications.filter(notification => notification.HazardID !== selectedHazardId));
      setSelectedHazardId(null);
      navigate('/adminhomepage');

    } catch (error) {
      console.error('Error deleting hazard:', error);
      setErrorMessage('Failed to delete hazard. Please try again.');
    }
  };

  const handleDeclineCancel = () => setShowDeclineConfirmModal(false);


  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          <div className="ApproveHazard-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="ApproveHazard-header-box container-flex w-100 vh-30">
              <h1 className="ApproveHazard-title">Approve Hazard</h1>
            </div>
            <div className="ApproveHazard-newhazard-box container-flex vh-30">
              <div className="row">
                <div className="ApproveHazard-newhazard-heading-box container-flex">
                  <div className="ApproveHazard-newhazard-heading-title-box container-flex">
                    <h1>New Hazards Update</h1>
                  </div>
                  <div className="ApproveHazard-newhazard-heading-notification-box container-flex">
                    <button
                      type="button"
                      className="ApproveHazard-notification-button-box-icon btn btn-primary position-relative"
                      onClick={handleNotificationClick}
                    >
                      <RiMessage2Fill className='ApproveHazard-message-icon' />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        <Badge bg="danger" className="ApproveHazard-badge-position">{hazardCount}</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="ApproveHazard-newhazard-content-box container-flex">
                  <div className="row">
                    <div className="ApproveHazard-detail-box container-flex">
                      <div className="ApproveHazard-detail-name-box container-flex">
                        <p>Name:</p>
                        <p>{selectedNotification && `${selectedNotification.locomotiveName}`}</p>
                      </div>
                      <div className="ApproveHazard-detail-loco-phone-box container-flex">
                        <p>LP Phone No:</p>
                        <p>{selectedNotification && `${selectedNotification.locomotivePhoneNo}`}</p>

                      </div>
                      <div className="ApproveHazard-detail-station-phone-box container-flex">
                        <p>Station Phone No:</p>
                        <p>{selectedNotification && `${selectedNotification.locationContactNumber}`}</p>
                      </div>
                    </div>
                    <div className="ApproveHazard-description-box container-flex">
                    <p>
  {selectedNotification && (() => {
    const { day, month, year, time } = formatDate(selectedNotification.Date); // Use `Date` here
    return `IN ${selectedNotification.locationName}, On ${day} ${month} ${year} at ${time}, ${selectedNotification.HazardType} hazard was reported.`;
  })()}
</p>
                    </div>
                    <div className="ApproveHazard-accept-box container-flex">
                      <div className="row">
                        <div className="ApproveHazard-hazard-btn-box container-flex">
                          <div className="ApproveHazard-hazard-left-icon-box">
                            <GiElephant />
                          </div>
                          <div className="ApproveHazard-hazard-middle-input-box">
                            <p>{selectedNotification && selectedNotification.HazardType}</p>
                          </div>
                          <div className="ApproveHazard-hazard-right-button-box">
                            <Button
                              className="ApproveHazard-hazard-right-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('hazard', selectedNotification.HazardType)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                        <div className="ApproveHazard-location-btn-box container-flex">
                          <div className="ApproveHazard-hazard-left-icon-box">
                            <FaLocationDot />
                          </div>
                          <div className="ApproveHazard-hazard-middle-input-box">
                            <p>{selectedNotification && selectedNotification.locationName}</p>
                          </div>
                          <div className="ApproveHazard-hazard-right-button-box">
                            <Button
                              className="ApproveHazard-hazard-right-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('location', selectedNotification.locationName)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ah-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="ah-right-header-box container-flex vh-30">
              <h1>Approval Hazard</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <InputGroup className="ah-input-dropdown-box ">
                <Form.Control
                  placeholder="Location"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  style={{ height: '70px', fontSize: '5vh', color: '#387373', fontWeight: 'bolder' }}
                  aria-label="Text input with dropdown button"
                  id="ah-input-location"
                />
                <Button
                  variant="outline-secondary"
                  title="Select Route"
                  id="ah-input-group-dropdown-2"
                  align="end"
                  className="ah-dropdown-box-button"

                >
                  <div className="ApproveHazard-hazard-right-hazard-icon">
                    <FaLocationDot />
                  </div>
                </Button>
              </InputGroup>

              <div className="ApproveHazard-hazard-icon-box2 container-flex">
                {locationHazards.map((hazard, index) => (
                  <div key={index} className="ApproveHazard-hazard-content container-flex">
                    <h2 className="ApproveHazard-hazard-icon">{hazard.HazardType}</h2>
                  </div>
                ))}
              </div>



              <InputGroup className="ah-input-dropdown-box ">
                <Form.Control
                  placeholder="Hazard"
                  value={inputHazard}
                  onChange={(e) => setInputHazard(e.target.value)}
                  style={{ height: '70px', fontSize: '5vh', color: '#387373', fontWeight: 'bolder' }}
                  aria-label="Text input with dropdown button"
                  id="ah-input-hazard"
                />
                <Button
                  variant="outline-secondary"
                  title="Select Route"
                  id="ah-input-group-dropdown-2"
                  align="end"
                  className="ah-dropdown-box-button"

                >
                  <div className="ApproveHazard-hazard-right-hazard-icon">
                    <GiElephant />
                  </div>
                </Button>
              </InputGroup>
            </Form>

            <form onSubmit={handleSubmit}>
              <div className="ah-box button-box container-flex">
                <Button
                  variant="outline-dark"
                  className="ah-button"
                  type="submit"
                >
                  Approve
                </Button>
              </div>
            </form>

            <form onSubmit={handleDecline}>
              <div className="ah-box button-box container-flex">
                <Button
                  variant="outline-dark"
                  className="ah-button"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </div>

            </form>

            <div className="ah-box button-box container-flex">
              <Button
                variant="outline-dark"
                className="ah-button"
                onClick={() => navigate('/adminhomepage')}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <Modal show={true} onHide={() => setSuccessMessage('')}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setSuccessMessage('')}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      )}

      {errorMessage && (
        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hazard Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p>{`Hazard Reporting ${index + 1}`}</p>
              <Button
                variant="outline-success"
                onClick={() => {
                  setSelectedNotification(notification); // Set the selected notification when clicked
                  // handleViewReport(notification.HazardID); // Optional: View report logic (if needed)
                  markAsRead(notification.HazardID);
                }}
              >
                View Report
              </Button>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save the data?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeclineConfirmModal} onHide={handleDeclineCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Decline</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this hazard?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeclineCancel}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleDeclineConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ApproveHazard;
