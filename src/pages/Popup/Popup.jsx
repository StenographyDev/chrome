import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {

  function logInp() {
    const inp = document.getElementById('inp_box')
    console.log('test')
    console.log(inp.value)

    fetch('https://raw.githubusercontent.com/dgca/relay-hasura-demo/main/src/App.tsx')
      .then(data => data.text())
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          EDIT <code>src/pages/Popup/Popup.js</code> and save to reload.
        </p>
        <input id="inp_box" />
        <button onClick={logInp}>Click sub</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
