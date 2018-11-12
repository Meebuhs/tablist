// When the popup loads, populate the output with the list of urls
window.onload = function() {
    let output = document.getElementById('output');

    chrome.tabs.query({"currentWindow": true}, tabs => {
        tabs.map((tab, index) => {
            let add = (index === 0) ? "" : output.textContent + "\n";
            output.textContent = add + tab.url;
        });
    });
};