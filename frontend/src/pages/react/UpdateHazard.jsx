/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { GiHazardSign } from "react-icons/gi";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Modal from "react-bootstrap/Modal";
import "./../style/UpdateHazard.css";
import axios from "axios";

function UpdateHazard() {
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState("");
  const [locationNames, setLocationNames] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  // const [locationHazards, setLocationHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState("");
  const [pilotIds, setPilotIds] = useState([]);
  const [selectedPilotId, setSelectedPilotId] = useState("");
  const handlePilotIdSelect = (id) => {
    setSelectedPilotId(id);
  };

  // Fetch location types on component mount
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/location/getAll"
        );
        const uniqueTypes = [
          ...new Set(response.data.map((location) => location.locationType)),
        ];
        setLocationTypes(uniqueTypes);
      } catch (error) {
        console.error("Error fetching location types:", error);
      }
    };

    fetchLocationTypes();
  }, []);

  // Fetch location names based on selected location type
  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        if (selectedLocationType) {
          const response = await axios.get(
            `http://localhost:8000/location/getAll?locationType=${selectedLocationType}`
          );
          const filteredNames = response.data
            .filter(
              (location) => location.locationType === selectedLocationType
            )
            .map((location) => location.locationName);
          setLocationNames(filteredNames);
        }
      } catch (error) {
        console.error("Error fetching location names:", error);
      }
    };
    fetchLocationNames();
  }, [selectedLocationType]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      HazardType: selectedHazard,
    }));
  }, [selectedHazard]);

  // Handle selection of location type
  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setSelectedLocationName(""); // Reset selected location name when location type changes
    setLocationNames([]); // Clear previous location names
    // setLocationHazards([]); // Clear previous location hazards
  };

  // Handle selection of location name
  const handleLocationNameSelect = (name) => {
    setSelectedLocationName(name);
    setFormData({ ...formData, locationName: name });
  };

  // Fetch hazards for selected location on search button click
  // const handleSearch = async () => {
  //   try {
  //     if (selectedLocationName) {
  //       const response = await axios.get(`http://localhost:4000/api/hazard?locationName=${selectedLocationName}`);
  //       setLocationHazards(response.data); // Assuming the API returns an array of hazards
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location hazards:', error);
  //   }
  // };

  // Function to handle selection of hazard type
  const handleHazardSelect = (HazardType) => {
    setSelectedHazard(HazardType); // Update selectedHazard state
  };

  // reporting hazard function
  const [formData, setFormData] = useState({
    Date: "",
    HazardType: "",
    locationName: "",
    description: "",
    locomotivePilotID: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check if all fields are empty
    if (
      formData.description.trim() === "" &&
      formData.Date.trim() === "" &&
      formData.HazardType.trim() === "" &&
      formData.locationName.trim() === "" &&
      formData.locomotivePilotID.trim() === "" &&
      selectedLocationType.trim() === ""
    ) {
      setError("All fields are empty. Please fill all the fields.");
      setShowErrorModal(true);
      return;
    }

    // Validation check if more than 1 field is empty
    const fields = {
      "Date and Time": formData.Date.trim(),
      "Location Route": selectedLocationType.trim(),
      "Location Name": formData.locationName.trim(),
      "Hazard Type": formData.HazardType.trim(),
      Description: formData.description.trim(),
      "Locomotive Pilot ID": formData.locomotivePilotID.trim(),
    };

    const emptyFields = Object.keys(fields).filter((key) => fields[key] === "");

    if (emptyFields.length > 1) {
      setError(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setShowErrorModal(true);
      return;
    }

    // Individual field validations
    if (selectedLocationType.trim() === "") {
      setError("Location Route Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.locationName.trim() === "") {
      setError("Location Name Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.Date.trim() === "") {
      setError("Date & Time Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.HazardType.trim() === "") {
      setError("Hazard Type Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.description.trim() === "") {
      setError("Description Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.locomotivePilotID.trim() === "") {
      setError("Locomotive Pilot ID Field Is Empty.");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/pilotHazard/addHazard",
        formData
      );
      console.log(response.data); // Handle success response
      setError(""); // Clear any previous errors
      setSuccess(true); // Show success message

      // Reset the form data to clear all inputs
      setFormData({
        Date: "",
        HazardType: "",
        locationName: "",
        description: "",
        locomotivePilotID: "",
      });

      // Clear additional selected states
      setSelectedLocationType("");
      setSelectedLocationName("");
      setSelectedDate(null);
      setSelectedHazard("");
    } catch (error) {
      console.error("Hazard Reporting failed:", error); // Log the error
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set error message from server response
      } else {
        setError("Hazard Reporting failed. Please try again."); // Set a generic error message
      }
      setShowErrorModal(true); // Show error modal
    }
  };
  useEffect(() => {
    const fetchPilotIds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/locomotivePilot/getAll"
        );
        setPilotIds(response.data.map((pilot) => pilot.locomotivePilotID));
      } catch (error) {
        console.error("Error fetching pilot IDs:", error);
      }
    };
    fetchPilotIds();
  }, [selectedPilotId]);

  const handleCloseErrorModal = () => setShowErrorModal(false);
  return (
    <>
      {/* ..........this is the main division of screen.......... */}
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* ..........this is the left side box start.......... */}
          <div className="update-hazard-header-box container-flex ">
            <div className="update-hazard-title">Report Hazard</div>
          </div>
          <div className="update-hazard-main-left col-sm-12 col-md-9 col-lg-9 col-xl-9">
            <div>
              <Form onSubmit={handleSubmit}>
                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Date & Time "
                  >
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: "5px" }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={
                        selectedDate
                          ? selectedDate.format("YYYY-MM-DD HH:mm")
                          : ""
                      }
                      // readOnly
                    />
                  </FloatingLabel>
                  <Dropdown
                    show={showCalendar}
                    onToggle={toggleCalendar}
                    align="end"
                  >
                    <Dropdown.Toggle
                      as={Button}
                      variant="outline-secondary"
                      id="update-hazard-input-group-dropdown-2"
                      className="custom-dropdown-toggle"
                    >
                      <MdDateRange />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0 border-0">
                      <Datetime
                        onChange={(date) => {
                          setSelectedDate(date);
                          setShowCalendar(false);
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            Date: date.format("YYYY-MM-DD HH:mm"),
                          }));
                        }}
                        input={false}
                        open={true}
                        value={formData.Date}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Location Route"
                  >
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: "5px" }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedLocationType}
                      // readOnly
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as={Button}
                      variant="outline-secondary"
                      id="update-hazard-input-group-dropdown-2"
                      className="custom-dropdown-toggle"
                    >
                      <FaRoute />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="update-hazard-scrollable-dropdown">
                      {locationTypes.map((type, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleLocationTypeSelect(type)}
                        >
                          {type}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Location">
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: "5px" }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedLocationName || formData.locationName}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as={Button}
                      variant="outline-secondary"
                      id="update-hazard-input-group-dropdown-2"
                      className="custom-dropdown-toggle"
                    >
                      <MdAddLocationAlt />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="update-hazard-scrollable-dropdown">
                      {locationNames.map((name, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleLocationNameSelect(name)}
                        >
                          {name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Hazard type"
                  >
                    <Form.Control
                      placeholder="Select Hazard type"
                      style={{ height: "5px" }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedHazard || formData.HazardType}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as={Button}
                      variant="outline-secondary"
                      id="update-hazard-input-group-dropdown-2"
                      className="custom-dropdown-toggle"
                    >
                      <GiHazardSign />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleHazardSelect("Elephant")}
                      >
                        Elephant
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleHazardSelect("Bull")}>
                        Bull
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleHazardSelect("Landslide")}
                      >
                        Landslide
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Description"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      id="update-hazard-input"
                      style={{ height: "100px" }}
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                    />
                  </FloatingLabel>
                </InputGroup>
              </Form>
            </div>
          </div>
          {/* ..........left side box ended.......... */}

          <div className="update-hazard-main-left col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="update-hazard-button-box">
              <Form onSubmit={handleSubmit}>
                {/* Input Group with Dropdown */}
                <InputGroup className="UpdateHazardDetails-input-dropdown-box mb-3">
                  <FloatingLabel
                    controlId="floatinglocomotivePilotID"
                    label="Pilot ID"
                  >
                    <Form.Control
                      id="UpdateHazardDetails-input"
                      type="text"
                      name="Pilot ID"
                      placeholder="locomotivePilotID"
                      value={formData.locomotivePilotID}
                      onChange={handleChange}
                      className="hazard-RegisterPage-input-text-box"
                      readOnly // Ensures manual editing is disabled
                    />
                  </FloatingLabel>

                  {/* Dropdown for LocomotivePilotID */}
                  <DropdownButton
                    variant="outline-secondary"
                    title="LP Id"
                    id="input-group-dropdown-2"
                  >
                    <div className="dropdown-menu-scrollable">
                      {pilotIds.map((id) => (
                        <Dropdown.Item
                          key={id}
                          onClick={() =>
                            handleChange({
                              target: { name: "locomotivePilotID", value: id },
                            })
                          }
                        >
                          {id}
                        </Dropdown.Item>
                      ))}
                    </div>
                  </DropdownButton>
                </InputGroup>
                {/* Submit and Back Buttons */}
                <Button
                  type="submit"
                  variant="outline-dark"
                  className="update-hazard-button"
                >
                  Submit
                </Button>{" "}
                <Button
                  variant="outline-dark"
                  className="update-hazard-button"
                  onClick={() => navigate("/homepage")}
                >
                  Back
                </Button>{" "}
              </Form>
            </div>
          </div>

          {success && (
            <Modal show={success} onHide={() => setSuccess(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Hazard Reporting successfully!</Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={() => setSuccess(false)}>
                  Close
                </Button>
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
    </>
  );
}

export default UpdateHazard;
