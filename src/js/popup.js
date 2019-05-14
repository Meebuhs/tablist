import "../css/popup.scss"

const output = document.getElementById("output"),
    copyTabsPane = document.getElementById("copy-tab-pane"),
    loadTabsPane = document.getElementById("load-tab-pane"),
    copyTabButton = document.getElementById("copy-tab-button"),
    loadTabButton = document.getElementById("load-tab-button"),
    includeAllToggle = document.getElementById("include-all-toggle");

const newline = "\n";
const windowDelimiter = `${newline}---${newline}`;

document.getElementById("copy").addEventListener("click", copyText);
copyTabButton.addEventListener("click", showCopyTab);
loadTabButton.addEventListener("click", showLoadTab);
includeAllToggle.addEventListener("click", populateOutput);

// When the popup loads, populate the output with the list of urls
window.onload = function () {
    populateFromCurrentWindow();
};

// Populate the output
function populateOutput() {
    toggleIncludeAll();

    if (includeAllToggle.getAttribute('checked')) {
        populateFromCurrentWindow();
    } else {
        populateFromAllWindows();
    }
}

// Toggles the checked value of the include all slider
function toggleIncludeAll() {
    includeAllToggle.getAttribute('checked') ?
        includeAllToggle.removeAttribute('checked')
        :
        includeAllToggle.setAttribute('checked', 'true');
}

// Populate the list of tabs for the current window
function populateFromCurrentWindow() {
    chrome.tabs.query({"currentWindow": true}, tabs => {
        output.innerHTML = tabs.map(tab => tab.url).join(newline);
        setOutputHeight();
    });

}

// Populate the list of tabs for all windows
function populateFromAllWindows() {
    let data = {};
    chrome.tabs.query({}, tabs => {
        tabs.map(tab => {
            if (data[tab.windowId]) {
                data[tab.windowId].push(tab.url);
            } else {
                data[tab.windowId] = [tab.url];
            }

        });

        output.innerHTML = (Object.keys(data).map(key => data[key].join(newline)).join(windowDelimiter));
        setOutputHeight();
    })
}

// Gets height on contents with a min of 60 and max of 200
function setOutputHeight() {
    output.style.height = '1px';
    const clampedHeight = Math.min(Math.max(60, output.scrollHeight), 200);
    output.style.height = `${clampedHeight}px`;
}

// Handles tab creation from pasted list
function pasteHandler(e) {
    const pasteText = e.clipboardData.getData('Text');
    const windows = pasteText.split(windowDelimiter);
    if (windows.length === 1) {
        pasteText.split(newline).map(url => url !== "" ? chrome.tabs.create({ url }) : null)
    } else {
        windows.map(window => chrome.windows.create({url: window.split(newline).filter(url => url !== "")}));
    }
}

// Selects the text within output and copies it to the clipboard
function copyText() {
    output.select();
    document.execCommand("copy");
}

// Displays the load tab
function showLoadTab() {
    document.addEventListener("paste", pasteHandler);
    copyTabsPane.classList.add("hidden");
    loadTabsPane.classList.remove("hidden");
    copyTabButton.classList.remove("selected");
    loadTabButton.classList.add("selected");
}

// Displays the copy tab
function showCopyTab() {
    document.removeEventListener("paste", pasteHandler);
    loadTabsPane.classList.add("hidden");
    copyTabsPane.classList.remove("hidden");
    copyTabButton.classList.add("selected");
    loadTabButton.classList.remove("selected");
}
