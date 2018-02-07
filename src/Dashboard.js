import React from 'react';
import PropTypes from 'prop-types';

import './css/Dashboard.css';

function Dashboard(props) {
  const styleProp = {
    width: props.isLoggedIn ? '100%' : '75%',
  };
  return (
    <div className="dashboard-wrapper" style={styleProp}>
      DASHBOARD CONTENT
    </div>
  );
}

Dashboard.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Dashboard;
