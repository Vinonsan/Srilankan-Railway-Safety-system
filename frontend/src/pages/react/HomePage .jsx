/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./../style/HomePage .css";
import { FaWind } from "react-icons/fa";
import { IoIosCloudyNight } from "react-icons/io";
import { FaCloudRain, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BsFillCloudFog2Fill } from "react-icons/bs";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { FaRoute } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const HomePage = (props) => {
  const navigate = useNavigate();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isGreen, setIsGreen] = useState(false);
  const [time, setTime] = useState(new Date()); // State to hold current time
  const [location, setLocation] = useState(""); // Start with an empty string (or use "unknown" or another value)
  const valuelocation = useLocation();
  const [hazards, setHazards] = useState([]);
  const [nexthazards, setNextHazards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextLocation, setNextLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  console.log(valuelocation);
  const [weatherLocation1, setWeatherLocation1] = useState({});
  const [weatherLocation2, setWeatherLocation2] = useState({});
  const [message, setMessage] = useState(null); // Message to display (obstacle detected or route clear)
  const [isObstacleDetected, setIsObstacleDetected] = useState(false); // To track if obstacle was detected
  const [timer, setTimer] = useState(null); // To manage timeout for clearing messages
  const [currentHazardIndex, setCurrentHazardIndex] = useState(0);
  const [NextHazardIndex, setNextHazardIndex] = useState(0);
  const currentHazard = hazards[currentHazardIndex];
  const nextHazard = nexthazards[NextHazardIndex];
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const currentLocation = useLocation(); 

  // const [locationRoute,setLocationRoute]=useState('Location Route');


  useEffect(() => {
    // Show popup every 10 minutes
    const interval = setInterval(() => {
      setIsPopupVisible(true);
    }, 60000); // 10 minutes in milliseconds

    setTimer(interval);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);



  const handleLocationChange = (e) => {
    setNextLocation(e.target.value);
  };



  // Helper function for visibility status
  const getVisibilityStatus = (visibilityKm) => {
    if (visibilityKm >= 10) {
      return "Good visibility";
    } else if (visibilityKm >= 5) {
      return "Average visibility";
    } else {
      return "Low visibility";
    }
  };

  const WindHazard = (wind_speed) => {
    if (wind_speed > 30) {
      return "Warning! High winds detected.";
    } else {
      return "No wind hazards detected !";
    }
  };

  // Weather state for both locations
  const [weather, setWeather] = useState({
    current: {
      temperature: 0,
      chance_of_rain: 0,
      rain_prob: "loading",
      wind_speed: 0,
      rain_level: "loading",
      visibility_status: "N/A",
    },
    next: {
      temperature: 0,
      chance_of_rain: 0,
      rain_prob: "loading",
      wind_speed: 0,
      rain_level: "loading",
      visibility_status: "N/A",
    },
  });

  const handleButtonClick = () => {
    setIsContentVisible(!isContentVisible);
    setIsGreen(!isGreen);
  };

  const weatherApiKey = "422e1d8e08dad104d47a623408c8f5a1";

  // Fetch weather data for both locations
  const fetchWeatherData = async (location, nextLocation) => {
    try {
      console.log("Fetching weather data...");
      const [response1, response2] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${nextLocation}&appid=${weatherApiKey}&units=metric`
        ),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(`Error: ${response1.status}, ${response2.status}`);
      }

      const data1 = await response1.json();
      const data2 = await response2.json();

      const visibilityInKm1 = (data1.visibility / 1000).toFixed(0);
      const visibilityInKm2 = (data2.visibility / 1000).toFixed(0);

      const weatherLocation1 = {
        temperature: Math.round(data1.main.temp),
        chance_of_rain: data1.clouds.all,
        rain_prob: data1.weather[0].main,
        wind_speed: Math.round(data1.wind.speed * 3.6).toFixed(0),
        rainlevel: data1.weather[0].description,
        weathervisibility: visibilityInKm1 || "N/A",
        visibilityStatus: getVisibilityStatus(visibilityInKm1),
        WindBasedHazard: WindHazard(Math.round(data1.wind.speed * 3.6)),
      };

      const weatherLocation2 = {
        temperature: Math.round(data2.main.temp),
        chance_of_rain: data2.clouds.all,
        rain_prob: data2.weather[0].main,
        wind_speed: Math.round(data2.wind.speed * 3.6).toFixed(0),
        rainlevel: data2.weather[0].description,
        weathervisibility: visibilityInKm2 || "N/A",
        visibilityStatus: getVisibilityStatus(visibilityInKm2),
        WindBasedHazard2: WindHazard(Math.round(data2.wind.speed * 3.6)),
      };

      setWeatherLocation1(weatherLocation1);
      setWeatherLocation2(weatherLocation2);
      console.log("Weather data fetched:", weatherLocation1, weatherLocation2);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    const startLocation = valuelocation.state?.startLocation || "unknown location";
    
    // Check if location is not set already
    if (location === "loading") {
      setLocation(startLocation); // Only set it if it's still "loading"
    }
  
    console.log("Starting location set:", startLocation);
    fetchWeatherData(startLocation, nextLocation);
  }, [valuelocation.state, nextLocation, location]);
  

  // Format the time and date
  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const fetchHazards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/hazard/locationName/${location}`
        );
        if (response.data && Array.isArray(response.data)) {
          setHazards(response.data);
          setError(null);
        } else {
          setHazards([]);
          setError("Hazards data is empty or not in expected format.");
        }
      } catch (error) {
        setHazards([]);
        setError("Failed to load hazard data.");
      } finally {
        setLoading(false);
      }
    };
    
  }, [location]);

  useEffect(() => {
    const fetchNextHazards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/hazard/locationName/${nextLocation}`
        );
        if (response.data && Array.isArray(response.data)) {
          setNextHazards(response.data);
          setError(null); // Clear previous errors
        } else {
          setNextHazards([]);
          setError("Received data is not in the expected format.");
        }
      } catch (error) {
        setNextHazards([]); // Clear hazards on error
        setError("Failed to load hazard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNextHazards();
  }, [nextLocation]);

  useEffect(() => {
    // Display each hazard in a loop with a 2-second interval if hazards are available
    if (hazards.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentHazardIndex((prevIndex) => (prevIndex + 1) % hazards.length);
      }, 5000); // Change hazard every 2 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [hazards]); // Re-run effect when hazards array changes


  useEffect(() => {
    // Display each hazard in a loop with a 2-second interval if hazards are available
    if (nexthazards.length > 0) {
      const intervalId = setInterval(() => {
        setNextHazardIndex((prevIndex) => (prevIndex + 1) % nexthazards.length);
      }, 5000); // Change hazard every 2 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [nexthazards]); // Re-run effect when hazards array changes


  
// Function to determine the hazard area based on hazard type
const getHazardArea = (hazard) => {
  if (!hazard || !hazard.HazardType) {
    return "Unknown Area";
  }
  const hazardType = hazard.HazardType.toLowerCase();
  switch (hazardType) {
    case "bull":
      return "Bull Zone Alert! Stay Alert!";
    case "elephant":
      return "Elephant Zone Alert! Stay Alert!";
    case "landslide":
      return "Landslide Zone Alert! Stay Alert!";
    default:
      return "Unknown Area";
  }
};

  

  // Function to determine the hazard area based on hazard type
  const getNextHazardArea = (hazardType) => {
    switch (hazardType.toLowerCase()) {
      case "bull":
        return "Bull Zone Alert! Stay Alert!";
      case "elephant":
        return "Elephant Zone Alert! Stay Alert!";
      case "landslide":
        return "Landslide Zone Alert! Stay Alert!";
      default:
        return "Unknown Area";
    }
  };

  const getWeatherHazard = (weatherLocation1) => {
    switch (weatherLocation1.visibilityStatus.toLowerCase()) {
      case "Average visibility":
        return "low visiblity ! becareful";
      case "Low visibility":
        return "low visiblity ! becareful";
      default:
        return "clear visiblity";
    }
  };

  const fetchNextLocation = async (currentLocation) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/location/nextLocation/${currentLocation}`
      );
      if (response.data && response.data.locationName) {
        setNextLocation(response.data.locationName);
        console.log("Next location fetched:", response.data.locationName);
      }
    } catch (error) {
      console.error("Error fetching next location:", error);
    }
  };

  useEffect(() => {
    if (location && location !== "loading") {
      fetchNextLocation(location);
    }
  }, [location]);

  useEffect(() => {
    // Establish SSE connection with the backend
    const eventSource = new EventSource(
      "http://localhost:5000/start-detection"
    );

    // Listen for messages from the server
    eventSource.onmessage = (event) => {
      console.log("Received from server:", event.data); // Log the data for debugging

      if (event.data.includes("Bull detected")) {
        // If an obstacle (Bull) is detected
        setMessage("Obstacle detected");
        setIsObstacleDetected(true);

        // Clear any existing timer
        if (timer) {
          clearTimeout(timer);
        }

        // Set a new 10-second timer to change the message to 'Route clear' after detection
        const newTimer = setTimeout(() => {
          setMessage("Route clear");
          setIsObstacleDetected(false); // Reset the obstacle detection
        }, 10000); // 10 seconds timer

        setTimer(newTimer); // Store the new timer ID to reset it if another detection occurs
      } else {
        // If no obstacle detected, show the route clear message only if it's not currently detecting an obstacle
        if (!isObstacleDetected) {
          setMessage("Route clear");
        }
      }

      setLoading(false); // Stop loading once the result is received
    };

    // Handle errors from SSE
    eventSource.onerror = (error) => {
      console.error("Error occurred while receiving updates:", error);
      eventSource.close(); // Close the SSE connection
      setLoading(false); // Stop loading on error
    };

    // Cleanup the connection and timer when the component unmounts
    return () => {
      eventSource.close();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isObstacleDetected, timer]); // Re-run the effect when either the obstacle status or timer changes
 
  useEffect(() => {
    const interval = setInterval(() => {
      setShowArrow((prev) => !prev); // Toggle arrow visibility
    }, 5000); // Toggle every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  useEffect(() => {
    const savedLocation = localStorage.getItem('location'); // Retrieve location from localStorage
    if (savedLocation) {
      setLocation(savedLocation); // Initialize location state with the saved value
    }
  }, []);
  

useEffect(() => {
  // Only set initial location if it's still "loading"
  if (location === "loading" || location === "") {
    const startLocation = valuelocation.state?.startLocation || "unknown location";
    setLocation(startLocation); // Set location when it's loading or empty
  }

  // Fetch weather data when the location changes
  console.log("Fetching weather for location:", location);
  fetchWeatherData(location, nextLocation); // Fetch based on current location
}, [location, nextLocation]); // Trigger effect when location changes


 // Update location from query params or route path if required
 useEffect(() => {
  const queryParams = new URLSearchParams(currentLocation.search);
  const newLocation = queryParams.get('location');
  if (newLocation) {
    setLocation(newLocation);
    localStorage.setItem('location', newLocation); // Store the location in localStorage
  }
}, [currentLocation]); // Run when route changes


const handleInputChange = (event) => {
  setInputValue(event.target.value);
};

const handleSubmit = () => {
  const newLocation = inputValue.trim();
  if (newLocation) {
    console.log("Valid Input. Updating Location:", newLocation);
    
    // Set the new location state temporarily
    setLocation(newLocation); // This will update location for the current session

    // Close the modal
    setIsPopupVisible(false);

    // You can optionally trigger a page refresh, if you need to re-render
    // window.location.reload();  // This is not necessary if no state persistence is needed
  } else {
    alert("Please enter a valid location!");
  }
};


const handlePopupClose = () => {
  setIsPopupVisible(false);
};



const handleArrowClick = () => {
  if (nextLocation) {
    console.log("Arrow clicked. Updating Location to:", nextLocation);

    // Update the location state to the next location
    setLocation(nextLocation);

    // Optionally, trigger any additional actions like fetching weather or hazards
    fetchWeatherData(nextLocation, ""); // You can pass the following location if available

    // Update localStorage to persist the new location if needed
    localStorage.setItem("location", nextLocation);
  } else {
    alert("Next location not available!");
  }
};


  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* left side container box start */}
          <div className="HomePage-left-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4 container-flex">
            <div className="HomePage-left-box">
              <div className="HomePage-left-top-box container-flex">
                <div className="row">
                  <div className="HomePage-left-top-side-button-box container-flex">
                    <button onClick={handleButtonClick}>
                      <h3>
                        <TbLayoutSidebarLeftExpandFilled />
                      </h3>
                    </button>
                  </div>
                  <div
                    className={`HomePage-left-top-side-content-box container-flex ${
                      isGreen ? "green-background" : ""
                    }`}
                  >
                    {isGreen ? (
                      <div className="navigation-buttons container-flex">
                        <button
                          className="nav-button"
                          onClick={() => navigate("/updatehazard")}
                        >
                          Report Hazard
                        </button>
                        <button
                          className="nav-button"
                          onClick={() => navigate("/hazardlocation")}
                        >
                          view hazard location
                        </button>
                        <button
                          className="nav-button"
                          onClick={() => navigate("/")}
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      isContentVisible && (
                        <div className="row">
                          <div className="HomePage-left-top-side-content-date-box container-flex">
                            <h6>{formattedDate}</h6>
                          </div>
                          <div className="HomePage-left-top-side-content-time-box container-flex">
                            <h6>{formattedTime}</h6>
                          </div>
                          <div className="HomePage-left-top-side-content-location-box container-flex">
                            <h6>{location}</h6>
                          </div>
                          <div className="HomePage-left-top-side-content-weather-box container-flex">
                            <h6>
                              chance of rain {weatherLocation1.chance_of_rain}%
                            </h6>
                          </div>
                         
                          <div className="HomePage-left-top-side-content-weather2-box container-flex">
                            <div className="row">
                              <div className="HomePage-left-top-side-content-temperature-box container-flex">
                                <h6>{weatherLocation1.temperature}°C</h6>
                              </div>
                              
                              <div className="HomePage-left-top-side-content-rain-box container-flex">
                                <div className="row">
                                  <div className="HomePage-left-top-side-content-rain-icon-box container-flex">
                                    <h1>
                                      <FaCloudRain />
                                    </h1>
                                  </div>
                                  <div className="HomePage-left-top-side-content-rain-icon-label-box container-flex">
                                    <h6>{weatherLocation1.rain_prob}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                             
                        </div>
                        
                        
                      )
                    )}
                    {/* Animated Arrow */}
        {showArrow && (
          <div className="animated-arrow-container">
            <div className="animated-left-arrow"></div>
            <div className="animated-right-arrow" onClick={handleArrowClick}>
            
            </div>
          </div>
        )}
              
      {/* Modal Popup */}

<Modal show={isPopupVisible} onHide={handlePopupClose} centered>
  <Modal.Header closeButton>
    <Modal.Title style={{ color: "#355e5e", fontWeight: "bold" }}>
      Change Location
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <input
      type="text"
      placeholder="Enter a new location"
      value={inputValue} // Controlled input
      onChange={handleInputChange} // Update input value on change
      className="form-control"
      style={{
        border: "1px solid #355e5e",
        borderRadius: "4px",
        padding: "10px",
      }}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="danger"
      onClick={handlePopupClose} // Close modal on cancel
      style={{
        backgroundColor: "#c82333",
        color: "#e4f2e7",
        border: "none",
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleSubmit} // Set location on submit
      style={{
        backgroundColor: "#355e5e",
        color: "#e4f2e7",
        border: "none",
      }}
    >
      Set Location
    </Button>
  </Modal.Footer>
</Modal>

                  </div>
                </div>
               
              </div>
              <div className="HomePage-left-middle-box container-flex">
                <div className="row">
                  <div className="HomePage-left-middle-wind-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-wind-icon-box container-flex">
                        <h1>
                          <FaWind />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-wind-icon-label-box container-flex">
                        <h4>{weatherLocation1.wind_speed} km/h</h4>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-middle-rainfall-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                        <h1>
                          <IoIosCloudyNight />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                        <h1>{weatherLocation1.rain_prob}</h1>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-middle-fog-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-fog-icon-box container-flex">
                        <h1>
                          <BsFillCloudFog2Fill />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                        <h1>{weatherLocation1.visibilityStatus}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="HomePage-left-bottom-box container-flex">
                <div className="row">
                  <div className="HomePage-left-bottom-output1-box container-flex">
                  <div>
      {hazards.length > 0 ? (
  <p>{getHazardArea(hazards[currentHazardIndex]?.HazardType)}</p>
) : (
  <p>No hazards found for this location</p>
)}

    </div>

                  </div>

                  <div className="HomePage-left-bottom-output1-box container-flex">
                    {weatherLocation1.WindBasedHazard}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* left side container box end */}

          {/* middle side container box start */}
          <div className="HomePage-middle-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <div className="HomePage-middle-main-content-box container-flex">
              <div className="row">
                <div className="HomePage-middle-main-top-content-box container-flex">
                  <p>
                    {" "}
                    {valuelocation.state?.selectedLocationType +
                      " " +
                      "Route" || "not selected"}{" "}
                  </p>
                </div>
                <div className="HomePage-middle-main-top-content-box container-flex">
                  <p>
                    {" "}
                    {valuelocation.state?.startLocation || "not selected"}{" "}
                  </p>
                  <FaRoute />
                  <p> {valuelocation.state?.endLocation || "not selected"} </p>
                </div>
                <div className="HomePage-middle-main-middle-content-box container-flex">
                  {loading ? (
                    <div className="result-loading">Processing video...</div>
                  ) : (
                    <div
                      className={`result ${
                        isObstacleDetected ? "obstacle-detected" : "no-obstacle"
                      }`}
                    >
                      {message && <h2>{message}</h2>}
                    </div>
                  )}
                </div>

                <div className="HomePage-middle-main-bottom-content-box container-flex"></div>
              </div>
            </div>
          </div>
          {/* middle side container box end */}

          {/* right side container box start */}
          <div className="HomePage-bottom-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <div className="HomePage-bottom-box">
              <div className="HomePage-bottom-top-box container-flex">
                <div className="row">
                  <div className="HomePage-bottom-top-side-content-next-location-box container-flex">
                    <h6>Next Location</h6>
                  </div>
                  <div className="HomePage-bottom-top-side-content-location-box container-flex">
                    <h6>{nextLocation || "Loading next location..."}</h6>
                  </div>
                  <div className="HomePage-bottom-top-side-content-weather-box container-flex">
                    <h6>chance of rain {weatherLocation2.chance_of_rain}%</h6>
                  </div>
                  <div className="HomePage-bottom-top-side-content-weather2-box container-flex">
                    <div className="row">
                      <div className="HomePage-bottom-top-side-content-temperature-box container-flex">
                        <h6>{weatherLocation2.temperature}°C</h6>
                      </div>
                      <div className="HomePage-bottom-top-side-content-rain-box container-flex">
                        <div className="row">
                          <div className="HomePage-bottom-top-side-content-rain-icon-box container-flex">
                            <h1>
                              <FaCloudRain />
                            </h1>
                          </div>
                          <div className="HomePage-bottom-top-side-content-rain-icon-label-box container-flex">
                            <h6>{weatherLocation2.rain_prob}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="HomePage-left-middle-box container-flex">
                <div className="row">
                  <div className="HomePage-left-middle-wind-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-wind-icon-box container-flex">
                        <h1>
                          <FaWind />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-wind-icon-label-box container-flex">
                        <h4>{weatherLocation2.wind_speed} km/h</h4>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-middle-rainfall-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                        <h1>
                          <IoIosCloudyNight />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                        <h1>{weatherLocation2.rain_prob}</h1>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-middle-fog-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-fog-icon-box container-flex">
                        <h1>
                          <BsFillCloudFog2Fill />
                        </h1>
                      </div>
                      <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                        <h1>{weatherLocation2.visibilityStatus}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="HomePage-left-bottom-box container-flex">
                <div className="row">
                  <div className="HomePage-left-bottom-output1-box container-flex">
                    <div>
                      {loading ? (
                        <p>Loading hazards...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : nexthazards.length === 0 ? (
                        <p>No hazards found for this location</p>
                      ) : (
                        <div>
                          {/* Simple line output for hazard area */}
                          <p>{getNextHazardArea(nextHazard.HazardType)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="HomePage-left-bottom-output1-box container-flex">
                    <p>{weatherLocation2.WindBasedHazard2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right side container box end */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
