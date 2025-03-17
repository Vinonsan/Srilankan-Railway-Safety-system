/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./../style/AdminHazardLocation.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

function AdminHazardLocation() {
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState("");

  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState("");
  const [locationNames, setLocationNames] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [hazards, setHazards] = useState([]);

  const [formData, setFormData] = useState({
    HazardType: "Bull", // Default selection for hazard type
    LocationName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  const resetPageState = () => {
    setFormData({
      HazardType: "Bull", // Reset to default hazard type
      LocationName: "",
    });
    setSelectedLocationType("");
    setSelectedLocationName("");
    setSelectedMethod("");
    setHazards([]); // Reset hazards list to show "No hazards"
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation checks
    if (selectedLocationType.trim() === "" && selectedMethod.trim() === "") {
      setError(
        "Please select the location route, location name, and hazard type."
      );
      setShowErrorModal(true);
      return;
    } else if (selectedLocationType.trim() === "") {
      setError("Please select the location route and location name.");
      setShowErrorModal(true);
      return;
    } else if (
      selectedLocationName.trim() === "" &&
      selectedMethod.trim() === ""
    ) {
      setError("Please select the location name and hazard type.");
      setShowErrorModal(true);
      return;
    } else if (selectedLocationName.trim() === "") {
      setError("Please select the location name.");
      setShowErrorModal(true);
      return;
    }

    if (selectedMethod.trim() === "") {
      setError("Please select the hazard type.");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/hazard/addHazard",
        formData
      );
      console.log(response.data); // Log response data to verify if the data is saved correctly
      setError("");
      setSuccess(true);

      resetPageState(); // Reset the page state after successful submission

    } catch (error) {
      console.error("Hazard Reporting failed:", error);
      setError(
        error.response?.data?.error ||
          "Hazard Reporting failed. Please try again."
      );
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setSelectedMethod(value);
    setFormData({
      ...formData,
      HazardType: value,
    });
  };

  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setSelectedLocationName(""); // Reset selected location name when location type changes
    setFormData({
      ...formData,
      LocationName: "",
    });
    setLocationNames([]); // Clear previous location names
  };

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        if (selectedLocationName) {
          const response = await axios.get(
            `http://localhost:8000/hazard/locationName/${selectedLocationName}`
          );
          console.log(response.data); // Log response data for inspection
          setHazards(Array.isArray(response.data) ? response.data : []); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching hazards:", error);
        setHazards([]); // Default to an empty array in case of error
      }
    };
    fetchHazards();
  }, [selectedLocationName]);

  const handleLocationNameSelect = (name) => {
    setSelectedLocationName(name);
    setFormData({
      ...formData,
      LocationName: name,
    });
  };

  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          <div className="admin-hazard-location-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="admin-hazard-location-header-box container-flex">
              <div className="admin-hazard-location-title">
                Hazards Locations
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <InputGroup className="update-hazard-input-dropdown-box">
                <FloatingLabel
                  controlId="floatingTextarea2"
                  label="Select Route"
                >
                  <Form.Control
                    placeholder="Leave a comment here"
                    style={{ height: "5px" }}
                    aria-label="Text input with dropdown button"
                    id="update-hazard-input"
                    value={selectedLocationType}
                    onChange={(e) => setSelectedLocationType(e.target.value)}
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
                  <Dropdown.Menu>
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
                    aria-label="Text input with dropdown button"
                    id="update-hazard-input"
                    name="locationName"
                    value={selectedLocationName || formData.locationName}
                    placeholder="Leave a comment here"
                    style={{ height: "5px" }}
                    onChange={handleChange} // Update state on input change
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
                  <Dropdown.Menu>
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

              <div className="admin-hazard-location-left-radio-button-box container-flex">
                <div className="admin-hazard-location-payment-methods">
                  <label
                    className={`admin-hazard-location-method ${
                      selectedMethod === "Elephant" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="hazardType"
                      value="Elephant"
                      checked={selectedMethod === "Elephant"}
                      onChange={handleRadioChange}
                      className="admin-hazard-location-radio-button"
                    />
                    <span className="admin-hazard-location-method-text">
                      Elephant
                    </span>
                  </label>
                  <label
                    className={`admin-hazard-location-method ${
                      selectedMethod === "Bull" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="hazardType"
                      value="Bull"
                      checked={selectedMethod === "Bull"}
                      onChange={handleRadioChange}
                      className="admin-hazard-location-radio-button"
                    />
                    <span className="admin-hazard-location-method-text">
                      Bull
                    </span>
                  </label>
                  <label
                    className={`admin-hazard-location-method ${
                      selectedMethod === "Landslide" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="hazardType"
                      value="Landslide"
                      checked={selectedMethod === "Landslide"}
                      onChange={handleRadioChange}
                      className="admin-hazard-location-radio-button"
                    />
                    <span className="admin-hazard-location-method-text">
                      Landslide
                    </span>
                  </label>
                </div>
              </div>

              <div className="admin-hazard-location-button-box">
                <div className="row">
                  <Button
                    type="submit"
                    className="admin-hazard-location-button"
                    variant="dark"
                  >
                    Update
                  </Button>
                  <Button
                    className="admin-hazard-location-button"
                    variant="dark"
                    onClick={() => navigate("/adminhomepage")}
                  >
                    Back to Homepage
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div className="admin-hazard-location-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="right-admin-hazard-location-header-box container-flex">
              <h1 className="right-admin-hazard-location-header-heading">
                Hazard Location
              </h1>
            </div>
            <div className="right-admin-hazard-location-header-box-line container-flex"></div>
            <div className="right-admin-hazard-location-location-box container-flex">
              <h2 className="right-admin-hazard-location-location-heading">
                {selectedLocationName}
              </h2>
            </div>
            <div className="right-admin-hazard-location-possible-hazards-main-box container-flex">
              <div className="row">
                <div className="right-admin-hazard-location-possible-hazards-title-box container-flex">
                  <h3 className="right-admin-hazard-location-possible-hazards-title">
                    Possible Hazards
                  </h3>
                </div>
                {hazards.length > 0 ? (
                  hazards.map((hazard, index) => (
                    <div
                      key={index}
                      className="hazard-location-possible-hazard-box2 container-flex"
                    >
                      <h2 className="hazard-location-possible-content-heading">
                        {hazard.HazardType}
                      </h2>
                    </div>
                  ))
                ) : (
                  <div className="hazard-location-possible-hazard-box2 container-flex">
                    <h2 className="hazard-location-possible-content-heading">
                      No hazards
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>

          {success && (
            <Modal show={success} onHide={() => setSuccess(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Hazard Reporting successful!</Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={() => setSuccess(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {error && (
            <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{error}</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleCloseErrorModal}>
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

export default AdminHazardLocation;
