import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <div className="App-intro">
        <Login />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
