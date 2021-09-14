import React from 'react';
import './Popup.css';

let STENOGRAPHY_API_KEY = null

const Popup = () => {

  async function fetchStenography(code) {
    let fetchUrl = 'https://stenography-worker.stenography.workers.dev/';

    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "context": "vsc", "code": code, "api_key": STENOGRAPHY_API_KEY, "audience": "pm" })
    };

    const resp = await fetch(fetchUrl, options)
    const json = await resp.json()

    return json
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      // console.log('loading evt listener')
      if (request.msg === "something_completed") {
        //  To do something
        // console.log(request.data.subject)
        // console.log(request.data.content)
        alert(request.data.content)
      }
    }
  );

  async function handleClick() {
    // chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    chrome.runtime.openOptionsPage(function () {
      console.log('open options page')
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleClick}>View Settings Page</button>
      </header>
    </div>
  );
};

export default Popup;
