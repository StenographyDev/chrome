import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

let STENOGRAPHY_API_KEY = "01be3b53-eb8f-4f19-86ab-6f30ee92d74b"

const Popup = () => {

  async function fetchStenography(code) {

    console.log(code)
    let fetchUrl = 'https://stenography-worker.bramses.workers.dev/';

    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "context": "vsc", "code": code, "api_key": STENOGRAPHY_API_KEY, "audience": "all" })
    };

    const resp = await fetch(fetchUrl, options)
    const json = await resp.json()

    return json
  }

  function logInp() {
    const inp = document.getElementById('inp_box')

    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      var currentTab = tabs[0]; // there will be only one in this array      
      let urlStr = currentTab.url.replace('https://github.com/', '')
      const rawLink = `https://raw.githubusercontent.com/${urlStr}`.replace('/blob', '')

      fetch(rawLink)
        .then(data => data.text())
        .then(res => parseStr(res))
        .then(res => {
          return fetchStenography(res)
        })
        .then(res => alert(res.pm))
        .catch(err => console.error(err))

    }

    chrome.tabs.query(query, callback);

    // https://github.com/miguelgrinberg/Flask-HTTPAuth/blob/main/src/flask_httpauth.py

  }


  function removeSmallest(arr) {
    var min = Math.min(...arr);
    return {
      newArr: arr.filter(e => e != min),
      min
    };
  }


  function appendDots(rangestart = 0, lines, cutoff, isTabs) {
    console.log(`Cutting off any lines past ${cutoff} ${isTabs ? 'tabs' : 'spaces'}`)

    let topLines = []

    for (let i = rangestart; i < lines.length; i++) {
      let line = lines[i]
      if (line.search(/\S/) <= cutoff) {
        topLines.push(line)
      }
      if (i >= 1 && lines[i - 1].search(/\S/) <= cutoff && line.search(/\S/) > cutoff) {
        if (isTabs) {
          topLines.push('\t'.repeat(line.search(/\S/)) + '...')
        }
        else {
          topLines.push(' '.repeat(line.search(/\S/)) + '...')
        }
      }
    }

    return topLines
  }


  function parseStr(str = '') {
    let lines = str.split('\n')
    const isTabs = lines[0].includes('\t')
    let topLines = []

    let rangestart = 0
    let rangeend = lines.length

    const spliceList = []
    // remove all empty lines from str
    for (let i = rangestart; i < rangeend; i++) {
      let line = lines[i].replace(/\s/g, "").replace(/\t/g, "")
      if (line === '') {
        spliceList.push(i)
      }
    }

    for (var i = spliceList.length - 1; i >= 0; i--) {
      lines.splice(spliceList[i], 1)
    }

    // add all seen indent levels to set
    let indentLevels = new Set()
    for (let i = rangestart; i < lines.length; i++) {
      let line = lines[i]
      let lineIndent = line.search(/\S/)
      indentLevels.add(lineIndent)
    }

    let indentLevelsList = Array.from(indentLevels)

    // remove -1 if it exists
    if (indentLevelsList.includes(-1)) {
      indentLevelsList = removeSmallest(indentLevelsList).newArr
    }

    const { newArr, min } = removeSmallest(indentLevelsList)
    let cutoff = min // used for final indent cutoff

    // depths 1 and 2
    const firstMin = min
    let secondMin = -1

    // once more for depth + 1
    if (newArr.length > 0) {
      const res = removeSmallest(newArr)
      cutoff = res.min // set cutoff to 2nd depth level
      secondMin = res.min

      // if (newArr.length >= 1) {
      //   for (let i = 0; i < lines.length; i++) {
      //     if (isTabs) lines[i] = lines[i].replace('\t'.repeat(secondMin), '')
      //     else lines[i] = lines[i].replace(' '.repeat(secondMin), '')
      //   }
      // }
    }

    topLines = appendDots(0, lines, cutoff, isTabs)
    const rejoined = topLines.join('\n')

    // too big for OAI prompt!
    if (rejoined.length > 2000) {
      console.log('rejoining')
      cutoff = firstMin
      topLines = []
      topLines = appendDots(0, lines, cutoff, isTabs)
    }


    return topLines.join('\n')
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
