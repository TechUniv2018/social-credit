import React from 'react';
import logo from './media/logo.svg';
import './css/App.css';

import Login from './Login';
import Dashboard from './Dashboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = false;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Social Credit</h1>
        </header>
        <div className="App-content">
          <Login isLoggedIn={this.isLoggedIn} />
          <Dashboard isLoggedIn={this.isLoggedIn} />
        </div>
      </div>
    );
  }
}

export default App;
