import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

var pageX;
var pageY;

document.onmousemove = function (e) {
    var x = e.pageX;
    var y = e.pageY;
    // do what you want with x and y
    pageX = x;
    pageY = y;
    // console.log(pageX, pageY);
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('loading evt listener')
        console.log(request.data)
        // alert(request.data + '\npageX:' + pageX + '\npageY:' + pageY)
        showModal(pageX, pageY, request.data)

        const initExplanations = [
            {
                'code': '() => {}',
                'explanation': 'test explanation',
                'metadata': {}
            }
        ]

        chrome.storage.local.get("explanations", function (result) {
            if (result["explanations"] === undefined) {
                chrome.storage.local.set({ "explanations": initExplanations }, function () {
                    console.log('Value is set to ' + initExplanations);
                });
            } else {
                const explanations = result["explanations"];
                explanations.push({
                    explanation: request.data,
                    code: request.code,
                    metadata: {}
                })
                chrome.storage.local.set({ "explanations": explanations }, function () {
                    console.log('Value is set to ' + explanations);
                });
                console.log(explanations)
            }
        });

        chrome.runtime.sendMessage({
            response: "something_completed",
            data: {
                subject: "Done",
                content: "testing"
            }
        });

        if (request.msg === "something_completed") {
            //  To do something
            alert(request.data.content)
        }
    }
);

printLine("Using the 'printLine' function from the Print Module");


