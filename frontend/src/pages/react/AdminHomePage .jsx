/* eslint-disable no-unused-vars */

import React from "react";
import "./../style/AdminHomePage .css";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import approvehazard from '../assets/ApproveHazard.jpg';
import hazardlocation from '../assets/HazardLocation.jpg';
import locomotivepilot from '../assets/LocomotivePilot.jpg';
import updatehazard from '../assets/UpdateHazard.jpg';

import { useNavigate } from 'react-router-dom';

function AdminHomePage() {
  const navigate = useNavigate();
  return (
    <>
   
   <div className="AdminHomePage-left-container-flex ">
  <div className="row">

    <div className="col-12 AdminHomePage-heading-box vh-20">
      <h1 className="AdminHomePage-heading-title ">Admin Home Page</h1>
    </div>
  </div>
</div>

<div className="AdminHomePage-right-container-flex ">
  <div className="row">
    <div className="col-sm-12 col-md-6 col-lg-3 AdminHomePage-card-box-1">
        <div className="AdminHomePage-inserted-card-box-1"> 
          <Card style={{ width: '100%',height:'100%',borderWidth:5,}} className="AdminHomePage-inserted-card">
            <Card.Img variant="top" src={approvehazard} className="AdminHomePage-inserted-card-box-image"/>
              <Card.Body>
              <Card.Title className="AdminHomePage-inserted-card-box-title"><h1>Approve Hazard</h1></Card.Title>
              <Card.Text className="AdminHomePage-inserted-card-box-text">
              <p>This will display the newly reported hazards and details of
              the reporting locomotive pilot.</p>
            </Card.Text>
            
              <Button variant="dark" className="AdminHomePage-inserted-card-box-button"  onClick={() => navigate('/approvehazard')}>Approve Hazard</Button>
           </Card.Body>
          </Card>
        </div>
    </div>
    <div className="col-sm-12 col-md-6 col-lg-3 AdminHomePage-card-box-2">
        <div className="AdminHomePage-inserted-card-box-2"> 
        <Card style={{ width: '100%',height:'100%',borderWidth:5,}} className="AdminHomePage-inserted-card">
            <Card.Img variant="top" src={hazardlocation} className="AdminHomePage-inserted-card-box-image"/>
              <Card.Body>
              <Card.Title className="AdminHomePage-inserted-card-box-title"><h1>View Hazard</h1></Card.Title>
              <Card.Text className="AdminHomePage-inserted-card-box-text">
              <p>The administrative officer can update hazards here, which
              locomotive pilot fails to report.</p>
            </Card.Text>
              <Button variant="dark" className="AdminHomePage-inserted-card-box-button"onClick={() => navigate('/adminviewhazardlocation')}>View Hazard Location</Button>
           </Card.Body>
          </Card>
        </div>
    </div>
    <div className="col-sm-12 col-md-6 col-lg-3 AdminHomePage-card-box-3">
        <div className="AdminHomePage-inserted-card-box-3"> 
        <Card style={{ width: '100%',height:'100%',borderWidth:5,}} className="AdminHomePage-inserted-card">
            <Card.Img  variant="top" src={locomotivepilot} className="AdminHomePage-inserted-card-box-image"/>
              <Card.Body>
              <Card.Title className="AdminHomePage-inserted-card-box-title"><h1>Locomotive Pilot</h1></Card.Title>
              <Card.Text className="AdminHomePage-inserted-card-box-text">
              <p>Administrative officers can use this interface to update
              locomotive pilot details and add details</p>
            </Card.Text>
              <Button variant="dark" className="AdminHomePage-inserted-card-box-button" onClick={() => navigate('/updatelpdetails')}>Locomotive pilot </Button>
           </Card.Body>
          </Card>
        </div>
    </div>
    <div className="col-sm-12 col-md-6 col-lg-3 AdminHomePage-card-box-4">
        <div className="AdminHomePage-inserted-card-box-4"> 
        <Card style={{ width: '100%',height:'100%',borderWidth:5,}} className="AdminHomePage-inserted-card">
            <Card.Img variant="top" src={updatehazard} className="AdminHomePage-inserted-card-box-image"/>
              <Card.Body>
              <Card.Title className="AdminHomePage-inserted-card-box-title"><h1>Update Hazard</h1></Card.Title>
              <Card.Text className="AdminHomePage-inserted-card-box-text">
              <p>Admin can approve and update hazards which is reported by
              locomotive pilots.</p>
            </Card.Text>
              <Button variant="dark" className="AdminHomePage-inserted-card-box-button" onClick={() => navigate('/adminhazardlocation')}>Update hazards</Button>
           </Card.Body>
          </Card>
        </div>
    </div>
  </div>
</div>
    </>
  );
}

export default AdminHomePage;
