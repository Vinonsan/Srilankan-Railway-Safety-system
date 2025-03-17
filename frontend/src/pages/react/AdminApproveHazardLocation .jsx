/* eslint-disable no-unused-vars */
import React from "react";
import "./../style/AdminApproveHazardLocation .css";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
function AdminApproveHazardLocation() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = React.useState('card');
  return (
    
    <>
      {/* this is the main dision of screen  */}
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* *************************************this is the left side box start********************************************************** */}
          <div className="main-left col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="AdminApproveHazardLocation-heading-box container-flex w-100 vh-30">
              <h1 className="AdminApproveHazardLocation-title">Hazard Location</h1>
            </div>

            <div className="AdminApproveHazardLocation-radio-box container-flex   vh-30 ">
              
            <div className="admin-hazard-location-payment-methods">
            <label className={`admin-hazard-location-method ${selectedMethod === 'card' ? 'selected' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                    className='admin-hazard-location-radio-button'
                />
                <span className="admin-hazard-location-method-text">Elephant</span>
            </label>
            <label className={`admin-hazard-location-method ${selectedMethod === 'cash' ? 'selected' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={selectedMethod === 'cash'}
                    onChange={() => setSelectedMethod('cash')}
                    className='admin-hazard-location-radio-button'

                />
                <span className="admin-hazard-location-method-text">Bull</span>
            </label>
            <label className={`admin-hazard-location-method ${selectedMethod === 'paypal' ? 'selected' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={selectedMethod === 'paypal'}
                    onChange={() => setSelectedMethod('paypal')}
                    className='admin-hazard-location-radio-button'

                />
                <span className="admin-hazard-location-method-text">Landslide</span>
            </label>
            <label className={`admin-hazard-location-method ${selectedMethod === 'bitcoin' ? 'selected' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    value="bitcoin"
                    checked={selectedMethod === 'bitcoin'}
                    onChange={() => setSelectedMethod('bitcoin')}
                    className='admin-hazard-location-radio-button'

                />
                <span className="admin-hazard-location-method-text">Other</span>
            </label>
        </div>
              
            </div>

            <div className="AdminApproveHazardLocation-button-box1 container-flex ">
              <Button className="AdminApproveHazardLocation-update-button">Update</Button>
            </div>

            <div className="AdminApproveHazardLocation-button-box2 container-flex ">
              <Button className="AdminApproveHazardLocation-cancel-button" onClick={() => navigate('/approvehazard')}>Cancel</Button>
            </div>
          </div>
          {/* this is the left side box end */}

          {/* ***********************************************this is the right side box start************************************************ */}
          <div className="AdminApproveHazardLocation-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="AdminApproveHazardLocation-right-heading-box container-flex w-100 vh-30">
              <h1 className="AdminApproveHazardLocation-right-title">Hazard Location</h1>
            </div>

            <div className="AdminApproveHazardLocation-right-location-box container-flex  vh-30">
              <h1 className="AdminApproveHazardLocation-right-location">Anuradhapura New Town</h1>
            </div>

            <div className="AdminApproveHazardLocation-right-new-hazard-heading-main-box container-flex  vh-30">
              <div className="row">
                <div className="AdminApproveHazardLocation-right-new-hazard-heading-box container-flex  vh-30">
                  <h3 className="AdminApproveHazardLocation-right-new-hazard-heading">New Hazard</h3>
                </div>

                <div className="AdminApproveHazardLocation-right-new-hazard-box container-flex  vh-30">
                  <h3 className="AdminApproveHazardLocation-right-new-hazard-heading">Elephant</h3>
                </div>
              </div>
            </div>

            <div className="AdminApproveHazardLocation-right-hazard-heading-main-box container-flex  vh-30">
              <div className="row">
                <div className="AdminApproveHazardLocation-right-hazard-title-box container-flex  ">
                  <h4 className="AdminApproveHazardLocation-right-new-hazard-heading">Possible Hazard</h4>
                </div>

                <div className="AdminApproveHazardLocation-right-hazard-box container-flex  ">
                  <h3 className="AdminApproveHazardLocation-right-hazard">Elephant</h3>
                </div>

                <div className="AdminApproveHazardLocation-right-hazard-box container-flex ">
                  <h3 className="AdminApproveHazardLocation-right-hazard">Elephant</h3>
                </div>

                <div className="AdminApproveHazardLocation-right-hazard-box container-flex ">
                  <h3 className="AdminApproveHazardLocation-right-hazard">Elephant</h3>
                </div>

                <div className="AdminApproveHazardLocation-right-hazard-box container-flex ">
                  <h3 className="AdminApproveHazardLocation-right-hazard">Elephant</h3>
                </div>
              </div>
            </div>
          </div>
          {/* this is the right side box end*/}

          {/* ********************************************************************************************** */}
        </div>
      </div>
    </>
  );
}

export default AdminApproveHazardLocation;
