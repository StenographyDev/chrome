console.log('This is the background page?');
console.log('Put the background scripts here.');

let STENOGRAPHY_API_KEY = "01be3b53-eb8f-4f19-86ab-6f30ee92d74b"

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
    console.log(indentLevelsList)

    // remove -1 if it exists
    if (indentLevelsList.includes(-1)) {
        indentLevelsList = removeSmallest(indentLevelsList).newArr
    }

    // remove 0 if it exists
    if (indentLevelsList.includes(0)) {
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
    }

    topLines = appendDots(0, lines, cutoff, isTabs)
    const rejoined = topLines.join('\n')

    // too big for OAI prompt!
    if (rejoined.length > 1250) {
        console.log('rejoining')
        cutoff = firstMin
        topLines = []
        topLines = appendDots(0, lines, cutoff, isTabs)
    }

    return topLines.join('\n')
}

async function fetchStenography(code) {
    console.log('fetching steno')
    let fetchUrl = 'https://stenography-worker.bramses.workers.dev/';

    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "context": "vsc", "code": code, "api_key": STENOGRAPHY_API_KEY, "audience": "pm" })
    };

    const resp = await fetch(fetchUrl, options)
    const json = await resp.json()

    return json
}

function highlightRightClick(code) {
    console.log(parseStr(code.selectionText))
    fetchStenography(parseStr(code.selectionText)).then(res => {
        console.log(res.pm)

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { data: res.pm }, function (response) {
                console.log("Message from the content script:");
                console.log(response);
            });
        });
    }).catch(err => console.error(err))
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