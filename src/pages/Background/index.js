import secrets from 'secrets';

let STENOGRAPHY_API_KEY = secrets.STENOGRAPHY_API_KEY
// let STENOGRAPHY_API_KEY = null

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request)
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

    console.log(`Previous Version: ${previousVersion}`)
    console.log(`Current Version: ${currentVersion}`)

    switch (reason) {
        case 'install':
            console.log('New User installed the extension.')
            chrome.storage.local.set({ "tutorial": "first-run" }, function () {
                console.log('Value is set to first-run');
                chrome.runtime.openOptionsPage();
            });
            break;
        case 'update':
            console.log('User has updated their extension.')
            chrome.storage.local.set({ "tutorial": "first-run" }, function () {
                console.log('Value is set to first-run');
                chrome.runtime.openOptionsPage();
            });
            break;
        case 'chrome_update':
        case 'shared_module_update':
        default:
            console.log('Other install events within the browser')
            break;
    }

})

async function fetchStenography(code) {
    console.log('fetching steno with api key: ' + STENOGRAPHY_API_KEY)
    if (!STENOGRAPHY_API_KEY) {
        return { message: 'Please provide an <a id="apikey-options">API key</a> to use this extension.' }
    }
    let fetchUrl = 'https://stenography-worker.stenography.workers.dev/';

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "context": "chrome", "code": code, "populate": true, "api_key": STENOGRAPHY_API_KEY, "audience": "pm" })
    };

    const resp = await fetch(fetchUrl, options)
    const json = await resp.json()

    return json
}

function getSelection() {
    return window.getSelection().toString()
}

function highlightRightClick(highlight) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabID = tabs[0].id;
        chrome.scripting.executeScript({ target: { tabId: tabID }, function: getSelection }, (selection) => {
            const highlightTrimmed = selection[0].result.trimStart()
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
                        fetchResp = res.message
                    }
                } else {
                    fetchResp = res.pm.trim()
                }

                chrome.tabs.sendMessage(tabs[0].id, { data: fetchResp, code: highlightTrimmed });
                chrome.action.setBadgeBackgroundColor(
                    { color: [0, 0, 0, 0] },
                    () => { },
                );
                chrome.action.setBadgeText({ text: '' }, () => { console.log('loaded') });
            }).catch(err => {
                console.error(err)
                chrome.action.setBadgeBackgroundColor(
                    { color: [0, 0, 0, 0] },
                    () => { },
                );
                chrome.action.setBadgeText({ text: '' }, () => { console.log('loaded') });
                chrome.tabs.sendMessage(tabs[0].id, { data: err, code: null });
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