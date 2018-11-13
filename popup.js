// When the popup loads, populate the output with the list of urls
window.onload = function() {
    let output = document.getElementById('output');

    chrome.tabs.query({"currentWindow": true}, tabs => {
        tabs.map((tab, index) => {
            let add = (index === 0) ? "" : output.innerHTML + "<br />";
            output.innerHTML = add + tab.url;
        });
    });
};

// Binds copyText to the copy button clicked event
document.getElementById("copy").addEventListener("click", copyText);

// Selects the text within output and copies it to the clipboard
function copyText() {
    let range = document.createRange();
    range.selectNode(document.getElementById("output"));
    window.getSelection().addRange(range);
    document.execCommand("copy");
}