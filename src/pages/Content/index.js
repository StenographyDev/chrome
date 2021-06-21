import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('loading evt listener')
        console.log(request.data)
        alert(request.data)
        if (request.msg === "something_completed") {
            //  To do something
            console.log(request.data.subject)
            console.log(request.data.content)
            alert(request.data.content)
        }
    }
);

printLine("Using the 'printLine' function from the Print Module");


