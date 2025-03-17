/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { GiHazardSign } from "react-icons/gi";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import "./../style/UpdateHazard.css";

function Checking() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('Elephant'); // Default selection for hazard type

  const [formData, setFormData] = useState({
    hazardType: 'Elephant', // Default selection for hazard type
    locationName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/hazard', formData);
      console.log(response.data); // Log response data to verify if the data is saved correctly
      setError('');
      setSuccess(true);
      setFormData({
        hazardType: 'Elephant', // Reset to default selection
        locationName: '',
      });
    } catch (error) {
      console.error('Hazard Reporting failed:', error);
      setError(error.response?.data?.error || 'Hazard Reporting failed. Please try again.');
      setShowErrorModal(true);
    }
  };
  
  const handleCloseErrorModal = () => setShowErrorModal(false);

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setSelectedMethod(value);
    setFormData({
      ...formData,
      hazardType: value
    });
  };

  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [locationNames, setLocationNames] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [hazards, setHazards] = useState([]);

  // Fetch location types on component mount
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/location');
        const uniqueTypes = [...new Set(response.data.map(location => location.locationType))];
        setLocationTypes(uniqueTypes);
      } catch (error) {
        console.error('Error fetching location types:', error);
      }
    };

    fetchLocationTypes();
  }, []);

  // Fetch location names based on selected location type
  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        if (selectedLocationType) {
          const response = await axios.get(`http://localhost:4000/api/location?locationType=${selectedLocationType}`);
          const filteredNames = response.data
            .filter(location => location.locationType === selectedLocationType)
            .map(location => location.locationName);
          setLocationNames(filteredNames);
        }
      } catch (error) {
        console.error('Error fetching location names:', error);
      }
    };

    fetchLocationNames();
  }, [selectedLocationType]);

  // Handle selection of location type
  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setSelectedLocationName(''); // Reset selected location name when location type changes
    setFormData({
      ...formData,
      locationName: ''
    });
    setLocationNames([]); // Clear previous location names
  };

  // Handle selection of location name
  const handleLocationNameSelect = (name) => {
    setSelectedLocationName(name);
    setFormData({
      ...formData,
      locationName: name
    });
  };

  // Fetch hazards based on selected location name
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        if (selectedLocationName) {
          const response = await axios.get(`http://localhost:4000/api/hazard/locationName/${selectedLocationName}`);
          setHazards(response.data);
        }
      } catch (error) {
        console.error('Error fetching hazards:', error);
      }
    };

    fetchHazards();
  }, [selectedLocationName]);

  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          <div className="update-hazard-header-box container-flex">
            <div className="update-hazard-title">Report Hazard</div>
          </div>

          <div className="update-hazard-main-left col-sm-12 col-md-9 col-lg-9 col-xl-9">
            <Form onSubmit={handleSubmit}>
            <InputGroup className="update-hazard-input-dropdown-box">
    <FloatingLabel controlId="floatingTextarea2" label="Select Route">
      <Form.Control 
        aria-label="Text input with dropdown button"
        placeholder="Leave a comment here"
        style={{ height: '5px' }}
        id="update-hazard-input"
        value={selectedLocationType}
        onChange={(e) => setSelectedLocationType(e.target.value)} // Update state on input change
      />
    </FloatingLabel>
    <Dropdown align="end">
      <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
        <FaRoute />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {locationTypes.map((type, index) => (
          <Dropdown.Item key={index} onClick={() => handleLocationTypeSelect(type)}>{type}</Dropdown.Item>
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
         
          onChange={handleChange} // Update state on input change
      />
    </FloatingLabel>
    <Dropdown align="end">
      <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
        <MdAddLocationAlt />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {locationNames.map((name, index) => (
          <Dropdown.Item key={index} onClick={() => handleLocationNameSelect(name)}>{name}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  </InputGroup>

              <div className="admin-hazard-location-payment-methods">
                <label className={`admin-hazard-location-method ${selectedMethod === 'Elephant' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="hazardType"
                    value="Elephant"
                    checked={selectedMethod === 'Elephant'}
                    onChange={handleRadioChange}
                    className='admin-hazard-location-radio-button'
                  />
                  <span className="admin-hazard-location-method-text">Elephant</span>
                </label>
                <label className={`admin-hazard-location-method ${selectedMethod === 'Bull' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="hazardType"
                    value="Bull"
                    checked={selectedMethod === 'Bull'}
                    onChange={handleRadioChange}
                    className='admin-hazard-location-radio-button'
                  />
                  <span className="admin-hazard-location-method-text">Bull</span>
                </label>
                <label className={`admin-hazard-location-method ${selectedMethod === 'Landslide' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="hazardType"
                    value="Landslide"
                    checked={selectedMethod === 'Landslide'}
                    onChange={handleRadioChange}
                    className='admin-hazard-location-radio-button'
                  />
                  <span className="admin-hazard-location-method-text">Landslide</span>
                </label>
              </div>
            </Form>
          </div>

          <div className="update-hazard-main-right col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="update-hazard-button-box">
              <Form onSubmit={handleSubmit}>
                <Button type="submit" variant="outline-dark" className="update-hazard-button">Submit</Button>{' '}
                <Button variant="outline-dark" className="update-hazard-button" onClick={() => navigate('/homepage')}>Back</Button>{' '}
              </Form>
            </div>
          </div>

          {success && (
            <Modal show={success} onHide={() => setSuccess(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Hazard Reporting successful!</Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={() => setSuccess(false)}>Close</Button>
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
                <Button variant="danger" onClick={handleCloseErrorModal}>Close</Button>
              </Modal.Footer>
            </Modal>
          )}
          <h1>enna ife da ithu </h1>
        </div>
      </div>
    </>
  );
}

export default Checking;
