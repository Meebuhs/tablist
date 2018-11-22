import "../css/popup.scss"

const output = document.getElementById("output");
const copyTabsPane = document.getElementById("copy-tabs");
const loadTabsPane = document.getElementById("load-tabs");

// When the popup loads, populate the output with the list of urls
window.onload = function() {
    chrome.tabs.query({"currentWindow": true}, tabs => {
      output.innerHTML = tabs.map(tab => tab.url).join("\n");

      // Gets height on contents with a min of 60 and max of 200
      const clampedHeight = Math.min(Math.max(60, output.scrollHeight), 200);
      output.style.height = `${clampedHeight}px`;
    });
};

document.getElementById("copy").addEventListener("click", copyText);
document.getElementById("load").addEventListener("click", loadTabs);
document.getElementById("back-to-copy").addEventListener("click", backToCopy);

// Handles tab creation from pasted list
function pasteHandler(e) {
    const pasteText = e.clipboardData.getData('Text');
    const urls = pasteText.split("\n");
    urls.map(url => chrome.tabs.create({ url }));
}

// Selects the text within output and copies it to the clipboard
function copyText() {
    output.select();
    document.execCommand("copy");
}

// Displays the load tab
function loadTabs() {
    document.addEventListener("paste", pasteHandler);
    copyTabsPane.classList.add("hidden");
    loadTabsPane.classList.remove("hidden");
}

// Displays the copy tab
function backToCopy() {
    document.removeEventListener("paste", pasteHandler);
    loadTabsPane.classList.add("hidden");
    copyTabsPane.classList.remove("hidden");
}
