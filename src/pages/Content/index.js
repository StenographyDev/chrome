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
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #fff;
            color: #000;
            border-radius: 10px;
            text-align: center;
        `
    );
    modal.innerHTML = `<div>
            <button style="width: 30px;
                font-size: 20px;
                color: #c0c5cb;
                align-self: flex-end;
                float: right;
                background-color: transparent;
                border: none;
                margin-bottom: 10px;">
                ✖</button>
            <p>${data}</p>
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
            }
        });

    }
);

printLine("Using the 'printLine' function from the Print Module");