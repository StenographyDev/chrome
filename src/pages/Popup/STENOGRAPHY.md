# /Users/bram/Desktop/PARA/Projects/chrome-extension-boilerplate-react/src/pages/Popup/Popup.jsx -- 2021-06-09T03:18:03.414Z

## DEV:

 The function takes in three parameters: rangestart, lines, and cutoff.
 The first parameter is the starting point for the dots. It starts at 0 and increases by 1 each time it's called.
 The second parameter is how many lines of text to append dots to before stopping. 
 The third parameter is a number that determines when we stop adding dots to the string (in this case, tabs are used). 
 Finally, there's an optional fourth argument which can be either true or false depending on whether you want your strings with tabs or without them

## PM:


This function will append dots to the end of a string.

```
function appendDots(rangestart = 0, lines, cutoff, isTabs) {
    ...
  }
```

# /Users/bram/Desktop/PARA/Projects/chrome-extension-boilerplate-react/src/pages/Popup/Popup.jsx -- 2021-06-09T03:18:30.277Z

## DEV:

 ""
 "This function will fetch the stenography API key from our server and use it to log in."

## PM:


This code is importing React, the library that powers this app. It's also importing a SVG file called "logo.svg" and some CSS files from the project folder.

```
import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
let STENOGRAPHY_API_KEY = "01be3b53-eb8f-4f19-86ab-6f30ee92d74b"
const Popup = () => {
  async function fetchStenography(code) {
    ...
  }
  function logInp() {
    ...
  }
  function removeSmallest(arr) {
    ...
  }
  function appendDots(rangestart = 0, lines, cutoff, isTabs) {
    ...
  }
  function parseStr(str = '') {
    ...
  }
  return (
    ...
  );
};
export default Popup;
```

