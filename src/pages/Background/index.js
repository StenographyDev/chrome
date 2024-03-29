import secrets from 'secrets';

// let STENOGRAPHY_API_KEY = secrets.STENOGRAPHY_API_KEY
let STENOGRAPHY_API_KEY

chrome.storage.local.get("apiKey", function (result) {
    if (result["apiKey"]) {
        // console.log("apiKey found: " + result["apiKey"]);
        STENOGRAPHY_API_KEY = result["apiKey"]
    } else {
        STENOGRAPHY_API_KEY = null
    }
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(request)
        if ("open-options" in request) {
            chrome.runtime.openOptionsPage();
            sendResponse({ farewell: "open options page" });
        } else if ("modal-shown" in request) {
            sendResponse({ farewell: "ack" });
        } else {
            STENOGRAPHY_API_KEY = request.apiKey;
            sendResponse({ farewell: "api key is set" });
        }

    }
);


// on install show tutorial page
chrome.runtime.onInstalled.addListener((details) => {
    const currentVersion = chrome.runtime.getManifest().version
    const previousVersion = details.previousVersion
    const reason = details.reason

    // console.log(`Previous Version: ${previousVersion}`)
    // console.log(`Current Version: ${currentVersion}`)

    switch (reason) {
        case 'install':
            // console.log('New User installed the extension.')
            chrome.storage.local.set({ "tutorial": "first-run" }, function () {
                // console.log('Value is set to first-run');
                chrome.runtime.openOptionsPage();
            });
            break;
        case 'update':
            // console.log('User has updated their extension.')
            chrome.storage.local.set({ "tutorial": "first-run" }, function () {
                // console.log('Value is set to first-run');
                chrome.runtime.openOptionsPage();
            });
            break;
        case 'chrome_update':
        case 'shared_module_update':
        default:
            // console.log('Other install events within the browser')
            break;
    }

})

async function fetchStenography(code) {
    // console.log('fetching steno with api key: ' + STENOGRAPHY_API_KEY)
    if (!STENOGRAPHY_API_KEY) {
        return { message: 'Please provide an <a id="apikey-options">API key</a> to use this extension.' }
    }
    let fetchUrl = 'https://stenography-worker.stenography.workers.dev/';

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "context": "chrome", "code": code, "populate": true, "stackoverflow": true, "api_key": STENOGRAPHY_API_KEY, "audience": "pm" })
    };

    const resp = await fetch(fetchUrl, options)
    const json = await resp.json()

    return json
}

function getSelection() {
    console.log(window.getSelection().toString())
    return window.getSelection().toString()
}

function highlightRightClick(highlight) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabID = tabs[0].id;
        chrome.scripting.executeScript({ target: { tabId: tabID }, function: getSelection }, (selection) => {
            const highlightTrimmed = selection[0].result.trimStart()
            console.log(highlightTrimmed)
            chrome.action.setBadgeBackgroundColor(
                { color: [255, 255, 255, 127] },  // Green
                () => { /* ... */ },
            );
            chrome.action.setBadgeText({ text: '🤖' }, () => { console.log('loading') });
            fetchStenography(highlightTrimmed).then(res => {
                let fetchResp
                if (res.message) { // error
                    if (res.message.includes('Unauthorized POST')) {
                        fetchResp = 'The <a id="apikey-options">API key</a> you provided is invalid. Please check your API key and try again.'
                    } else {
                        console.log(res)
                        fetchResp = res.message
                    }
                } else {
                    if ("stackoverflow" in res && "stackOverflowURLs" in res.stackoverflow && res.stackoverflow.stackOverflowURLs.length > 0) {
                        let StackOverflowSuggestions = `<ul style="list-style:none;">`
                        for (let i = 0; i < res.stackoverflow.stackOverflowURLs.length; i++) {
                            StackOverflowSuggestions += `<li><a href="${res.stackoverflow.stackOverflowURLs[i].url}" target="_blank">${res.stackoverflow.stackOverflowURLs[i].question}</a></li>`
                        }
                        StackOverflowSuggestions += `</ul>`
                        fetchResp = res.pm + '<br /><br /><b>Stack Overflow Search Suggestions:</b><br />' + StackOverflowSuggestions
                    } else {
                        fetchResp = res.pm
                    }
                }

                chrome.tabs.sendMessage(tabs[0].id, { data: fetchResp, code: highlightTrimmed });
                chrome.action.setBadgeBackgroundColor(
                    { color: [0, 0, 0, 0] },
                    () => { },
                );
                chrome.action.setBadgeText({ text: '' }, () => { console.log('loaded') });
            }).catch(err => {
                chrome.action.setBadgeBackgroundColor(
                    { color: [0, 0, 0, 0] },
                    () => { },
                );
                chrome.action.setBadgeText({ text: '' }, () => { console.log('errored') });
                chrome.tabs.sendMessage(tabs[0].id, { data: err, code: null });
            }).finally(res => {
                // assume something broke and comment out badge
                chrome.action.setBadgeBackgroundColor(
                    { color: [0, 0, 0, 0] },
                    () => { },
                );
                chrome.action.setBadgeText({ text: '' }, () => { console.log('is in finally') });
                selection = null
            })
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
}, function () {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
    }
});

chrome.contextMenus.onClicked.addListener(highlightRightClick);