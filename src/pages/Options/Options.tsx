import React, { useState, useEffect } from 'react';
import './Options.css';
import Fuse from 'fuse.js'
import CodeCard from './CodeCard'

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

// chrome.runtime.sendMessage({ greeting: searchTerm }, function (response) {
//   console.log(response);
// });

const searchFuse = (searchTerm: string): any => {
  if (searchTerm.length === 0) return allExplanations
  return fuse.search(searchTerm)
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [apiKey, setApiKey] = useState('');

  const removeExplanationFromStorage = (id: string) => {
    console.log('removing explanation from storage: ' + id);
    chrome.storage.local.get("explanations", function (result) {
      let explanations = result["explanations"];
      explanations = explanations.filter((explanation: any) => explanation.metadata.id !== id);
      chrome.storage.local.set({ "explanations": explanations }, function () {
        console.log('Value is set to ' + explanations);
      });
      console.log(explanations)
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



  useEffect(() => {
    chrome.storage.local.get("explanations", function (result) {
      if (result["explanations"]) {
        explanations = result["explanations"]
        allExplanations = result["explanations"]
        fuse = new Fuse(explanations, options);
        setSearchResults(explanations)
      }
    })
  }, []);

  return <div className="OptionsContainer">{title.toUpperCase()} PAGE
    <br />
    <input type="text" placeholder="Search" onChange={evt => setSearchResults(searchFuse(evt.target.value))} />
    <ul>{listItems}</ul>
  </div>;
};

export default Options;
