import { printLine } from './modules/print';

// TODO: only log on dev mode


var pageX;
var pageY;

document.onmousemove = function (e) {
    var x = e.pageX;
    var y = e.pageY;
    pageX = x;
    pageY = y;
};

const showModal = (pageX, pageY, data) => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "style", `
    width: 300px;
    top: 40px;
    left: calc(50% - 500px);
    bottom: 40px;
    z-index: 100;
    `
    );
    modal.innerHTML = `<div>
        <div>
            <button style="padding: 4px 4px; font-size: 16px; border: none; border-radius: 10px;">x</button>
        </div>
        <div>
            <p>${data}</p>
        </div>
    </div>`;
    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
        document.body.removeChild(modal);
    });
}

function uuid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        showModal(pageX, pageY, request.data)

        const initExplanations = []

        chrome.storage.local.get("explanations", function (result) {
            if (result["explanations"] === undefined) {
                initExplanations.push({
                    explanation: request.data,
                    code: request.code,
                    metadata: {
                        id: uuid(),
                    }
                })
                chrome.storage.local.set({ "explanations": initExplanations }, function () { });
            } else {
                const explanations = result["explanations"];
                explanations.push({
                    explanation: request.data,
                    code: request.code,
                    metadata: {
                        id: uuid(),
                    }
                })
                chrome.storage.local.set({ "explanations": explanations }, function () { });
                console.log(explanations)
            }
        });

    }
);

printLine("Using the 'printLine' function from the Print Module");


