import secrets from 'secrets';

let STENOGRAPHY_API_KEY = secrets.STENOGRAPHY_API_KEY

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(JSON.stringify(request));
        console.log(request.apiKey);
        STENOGRAPHY_API_KEY = request.apiKey;
        console.log(`set api key ${STENOGRAPHY_API_KEY}`)
        sendResponse({ farewell: "goodbyeabove" });
    }
);

async function fetchStenography(code) {
    console.log('fetching steno with api key: ' + STENOGRAPHY_API_KEY)
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

function getSelection() {
    return window.getSelection().toString()
}

function highlightRightClick(code) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabID = tabs[0].id;
        chrome.scripting.executeScript({ target: { tabId: tabID }, function: getSelection }, (selection) => {
            const highlitedTrimmed = selection[0].result.trimStart()
            fetchStenography(highlitedTrimmed).then(res => {
                let fetchResp
                if (res.message) { // error
                    fetchResp = res.message
                } else {
                    fetchResp = res.pm
                }

                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { data: fetchResp, code: highlitedTrimmed }, function (response) {
                        console.log("Message from the content script:");
                        console.log(response);
                    });
                });
            }).catch(err => console.error(err))
        });
    });
}
/*
This code creates a context menu for the selection.
*/
chrome.contextMenus.create({
    id: 'steno',
    title: "Stenography",
    contexts: ["selection"],  // ContextType
});

chrome.contextMenus.onClicked.addListener(highlightRightClick);