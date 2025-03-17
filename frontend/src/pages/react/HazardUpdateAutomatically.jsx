// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './../style/HazardUpdate.css';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";

function HazardUpdateAutomatically() {
   const navigate = useNavigate();
    const [locationTypes, setLocationTypes] = useState([]);
    const [selectedLocationType, setSelectedLocationType] = useState('');
    const [locationNames, setLocationNames] = useState([]);
    const [selectedLocationName, setSelectedLocationName] = useState('');
    const [hazards, setHazards] = useState([]);
    const [showHazards, setShowHazards] = useState(false); // State to control hazard display

  // Fetch location types on component mount
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/location/getAll');
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
          const response = await axios.get(`http://localhost:8000/location/getAll?locationType=${selectedLocationType}`);
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

  // Fetch hazards based on selected location name
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        if (selectedLocationName) {
          const response = await axios.get(`http://localhost:8000/hazard/locationName/${selectedLocationName}`);
          setHazards(response.data);
          setShowHazards(true); // Show hazards when hazards are fetched
        } else {
          setHazards([]);
          setShowHazards(false); // Hide hazards when location name is cleared
        }
      } catch (error) {
        console.error('Error fetching hazards:', error);
      }
    };

    fetchHazards();
  }, [selectedLocationName]);

  // Handle selection of location type
  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setSelectedLocationName('');
    setShowHazards(false); // Hide hazards when location type changes
  };

  // Handle selection of location name
  const handleLocationNameSelect = (name) => {
    setSelectedLocationName(name);
  };

  // Handle clear button click
  const handleClear = () => {
    setSelectedLocationType('');
    setSelectedLocationName('');
    setHazards([]);
    setShowHazards(false); // Hide hazards when clear button is clicked
  };

  return (
    <>
       <div className="container-flex vh-100">
      <div className="row vh-100">
        {/* Left side box */}
        <div className="adminViewhazard-location-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="adminViewhazard-LP-hazard-location-header-box container-flex w-100 vh-30">
            <h1 className="adminViewhazard-LP-hazard-location-header-title">View Hazard Location</h1>
          </div>

          <InputGroup className="adminViewhazard-update-hazard-input-dropdown-box mt-5">
            <FloatingLabel controlId="floatingTextarea2" label="Select Route" className="custom-floating-label">
              <Form.Control
                placeholder="selectedLocationType"
                style={{ height: '5px', backgroundColor: 'white' }}
                aria-label="Text input with dropdown button"
                id="adminViewhazard-update-hazard-input"
                value={selectedLocationType}
                onChange={(e) => setSelectedLocationType(e.target.value)} 
              />
            </FloatingLabel>
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="outline-secondary" id="adminViewhazard-update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                <FaRoute />
              </Dropdown.Toggle>
              <Dropdown.Menu className="adminViewhazard-LP-hazard-location-scrollable-dropdown-menu">
                {locationTypes.map((type, index) => (
                  <Dropdown.Item key={index} onClick={() => handleLocationTypeSelect(type)}>{type}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>

          <InputGroup className="adminViewhazard-update-hazard-input-dropdown-box mt-5 mb-5">
            <FloatingLabel controlId="floatingTextarea2" label="Location">
              <Form.Control
                placeholder="Leave a comment here"
                style={{ height: '5px' }}
                aria-label="Text input with dropdown button"
                id="adminViewhazard-update-hazard-input"
                
                value={selectedLocationName}
                onChange={(e) => setSelectedLocationName(e.target.value)} 
              />
            </FloatingLabel>
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="outline-secondary" id="adminViewhazard-update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                <MdAddLocationAlt />
              </Dropdown.Toggle>
              <Dropdown.Menu className="adminViewhazard-LP-hazard-location-scrollable-dropdown-menu">
                {locationNames.map((name, index) => (
                  <Dropdown.Item key={index} onClick={() => handleLocationNameSelect(name)}>{name}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>

          <div className="adminViewhazard-LP-hazard-location-button-box1 container-flex vh-30">
            <Button variant="dark" className="adminViewhazard-LP-hazard-location-search-button" onClick={handleClear}>Clear</Button>
          </div>

          <div className="adminViewhazard-LP-hazard-location-button-box2 container-flex vh-30">
            <Button variant="dark" className="adminViewhazard-LP-hazard-location-back-button"  onClick={() => navigate('/adminhomepage')}>Back</Button>
          </div>
        </div>

        {/* Right side box */}
        <div className="adminViewhazard-location-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="adminViewhazard-location-location-box container-flex">
            <h1 className="adminViewhazard-location-heading">
              {selectedLocationType && selectedLocationName ? selectedLocationName : 'Select the location'}
            </h1>
          </div>

          {selectedLocationType && selectedLocationName &&  (
            <div className="adminViewhazard-location-possible-main-box container-flex">
              <div className="row">
                <div className="adminViewhazard-location-possible-header-box container-flex">
                  <h2 className="adminViewhazard-location-possible-header-heading">
                    Possible Hazards
                  </h2>
                </div>

                <div className="adminViewhazard-location-possible-hazard-box container-flex">
                  <div className="row">
                    {hazards.length > 0 ? (
                      hazards.map((hazard, index) => (
                        <div key={index} className="adminViewhazard-location-possible-hazard-box2 container-flex">
                          <h2 className="adminViewhazard-location-possible-content-heading">{hazard.HazardType}</h2>
                        </div>
                      ))
                    ) : (
                      <div className="adminViewhazard-location-possible-hazard-box2 container-flex">
                        <h2 className="adminViewhazard-location-possible-content-heading">No hazards</h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>

  );

}

export default HazardUpdateAutomatically