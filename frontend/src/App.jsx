/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectRoute from './pages/react/SelectRoute  ';
import Home from './pages/react/HomePage ';

function App() {
  const [routeDetails, setRouteDetails] = useState(null);

  const handleRouteSelection = (routeDetails) => {
    setRouteDetails(routeDetails);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRoute onRouteSelected={handleRouteSelection} />} />
        <Route path="/home" element={<Home routeDetails={routeDetails} />} />
      </Routes>
    </Router>
  );
}

export default App;
