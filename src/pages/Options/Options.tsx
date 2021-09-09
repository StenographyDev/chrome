import React, { useState, useEffect } from 'react';
import './Options.css';
import Fuse from 'fuse.js'
import CodeCard from './CodeCard'
// @ts-ignore  
import logo from '../../assets/img/chrome-invo.gif';


interface Props {
  title: string;
}

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: true,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.4,
  distance: 500,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: [
    "explanation",
    "code"
  ]
};

// start out empty
let explanations: any = []
let fuse = new Fuse(explanations, options);
let allExplanations: any = []


/*
This code is checking if the "explanations" key exists in the local storage and if it does, 
it will create a new Fuse object with that value.
- generated by stenography 🤖
*/
chrome.storage.local.get("explanations", function (result) {
  if (result["explanations"]) {
    explanations = result["explanations"]
    fuse = new Fuse(explanations, options);
  }
});



const searchFuse = (searchTerm: string): any => {
  if (searchTerm.length === 0) return allExplanations
  return fuse.search(searchTerm)
}

const setApiKey = (apiKey: string | undefined) => {
  console.log('setting apikey from options')
  if (!apiKey) return
  chrome.storage.local.set({ "apiKey": apiKey }, function () {
    console.log("apiKey set to " + apiKey);
  });
  chrome.runtime.sendMessage({ "apiKey": apiKey }, function (response) {
    console.log(response);
  });
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isTutorial, setIsTutorial] = useState(true)

  const removeExplanationFromStorage = (id: string) => {
    console.log('removing explanation from storage: ' + id);
    chrome.storage.local.get("explanations", function (result) {
      let explanations = result["explanations"];
      explanations = explanations.filter((explanation: any) => explanation.metadata.id !== id);
      chrome.storage.local.set({ "explanations": explanations }, function () {
        console.log('Value is set to ' + explanations);
      });
      setSearchResults(explanations)
    });
  }

  const listItems = searchResults.map((searchResult: any) => {
    if ("item" in searchResult) {
      return <li>
        <CodeCard code={searchResult.item.code} explanation={searchResult.item.explanation} id={searchResult.item.metadata.id} onChildClick={removeExplanationFromStorage} />
      </li>
    } else {
      return <li>
        <CodeCard code={searchResult.code} explanation={searchResult.explanation} id={searchResult.metadata.id} onChildClick={removeExplanationFromStorage} />
      </li>
    }

  });




  // run the tutorial
  chrome.storage.local.get("tutorial-done", function (result) {
    if (!result["tutorial-done"]) {
      chrome.storage.local.set({ "tutorial-done": 'tutorial-done' }, function () {
        console.log("tutorial set to done");
      });
    } else {
      console.log("tutorial already done");
      setIsTutorial(false)
    }
  })

  useEffect(() => {

    // get and set local explanations
    chrome.storage.local.get("explanations", function (result) {
      if (result["explanations"]) {
        explanations = result["explanations"]
        allExplanations = result["explanations"]
        fuse = new Fuse(explanations, options);
        setSearchResults(explanations)
      }
    })

    // get and set api key
    chrome.storage.local.get("apiKey", function (result) {
      if (result["apiKey"]) {
        console.log("apiKey found: " + result["apiKey"]);
        let apiKey = result["apiKey"]
        setApiKeyInput(apiKey)
        // send api key to background script
        chrome.runtime.sendMessage({ "apiKey": apiKey }, function (response) {
          console.log(response);
        });
      }
    })


  }, []);

  if (isTutorial) {
    return <div>
      <h1>Tutorial</h1>
      <pre>
        <h2>How To Steno</h2>
        <p>In this gif we are highlighting some code and letting the AI do its thing</p>
        <img src={logo}></img>
        <h2>Try It!</h2>
        <p>First we'll need to get an API key</p>
        <p>
          <b>Get an API key <a href="https://stenography-worker.stenography.workers.dev/">here</a></b>
        </p>
        <p>Set your API key</p>
        <input id="api_input" type="text" placeholder="Set API Key" value={apiKeyInput} onChange={evt => setApiKeyInput(evt.target.value)} />
        <button onClick={() => {
          alert('set api key!')
          setApiKey(apiKeyInput)
        }}>set it</button>
        <h2>NICE!</h2>
        <p>Go to <a target="_blank" href="https://github.com/bramses/awesome-stenography/blob/main/javascript/react-test-base.js">this repo</a> and try it out!</p>
      </pre>
    </div>
  } else {
    return <div className="OptionsContainer">
      <p><a target="_blank" href="https://stenography-worker.stenography.workers.dev/">API Page - Documentation</a></p>
      <br />
      <input id="api_input" type="text" placeholder="Set API Key" value={apiKeyInput} onChange={evt => setApiKeyInput(evt.target.value)} />
      <button onClick={() => {
        alert('set api key!')
        setApiKey(apiKeyInput)
      }}>set it</button>
      <br />
      <h1>Local History</h1>
      <h4>Erased when local storage is cleared</h4>
      <input type="text" placeholder="Search" onChange={evt => setSearchResults(searchFuse(evt.target.value))} />
      <ul>{listItems}</ul>
    </div>;
  }
};

export default Options;
