// eslint-disable-next-line no-unused-vars
import React from "react";
import "./../style/ViewHazard .css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function ViewHazard() {
  const navigate = useNavigate();

  navigate("adminhomepage");

  return (
    <>
      {/* ..........this is the main division of screen.......... */}
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* ..........this is the left side box start.......... */}
          <div className="hazard-location-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="hazard-location-header-box container-flex w-100 vh-30">
              <h1 className="hazard-location-header-title">View Hazard</h1>
            </div>

            <div className="hazard-location-dropdown-box container-flex vh-30">
              <input
                type="text"
                placeholder="Enter the location"
                className="hazard-location-dropdown-textbox"
              />
            </div>

            <div className="hazard-location-button-box1 container-flex vh-30">
              <Button className="hazard-location-search-button">Search</Button>
            </div>

            <div className="hazard-location-button-box2 container-flex vh-30">
              <Button
                className="hazard-location-back-button"
                onClick={() => navigate("/adminhomepage")}
              >
                Back
              </Button>
            </div>
          </div>
          {/* ..........left side box ended.......... */}

          {/* ..........this is the right side box.......... */}
          <div className="hazard-location-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="hazard-location-location-box container-flex vh-30">
              <h1 className="hazard-location-heading">Kekkirawa</h1>
            </div>
            <div className="hazard-location-possible-main-box container-flex vh-30">
              <div className="row">
                <div className="hazard-location-possible-header-box container-flex">
                  <h2 className="hazard-location-possible-header-heading">
                    Possible Hazards
                  </h2>
                </div>
                <div className="hazard-location-possible-content-box1 container-flex">
                  <h2 className="hazard-location-possible-content-heading">
                    Bull
                  </h2>
                </div>
                <div className="hazard-location-possible-content-box1 container-flex">
                  <h2 className="hazard-location-possible-content-heading">
                    Elephant
                  </h2>
                </div>
                <div className="hazard-location-possible-content-box1 container-flex">
                  <h2 className="hazard-location-possible-content-heading">
                    Landslide
                  </h2>
                </div>
                <div className="hazard-location-possible-content-box1 container-flex">
                  <h2 className="hazard-location-possible-content-heading">
                    Other
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* ..........right side box ended.......... */}
        </div>
      </div>
    </>
  );
}

export default ViewHazard;
