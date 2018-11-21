const output = document.getElementById('output');

// When the popup loads, populate the output with the list of urls
window.onload = function() {
    chrome.tabs.query({"currentWindow": true}, tabs => {
      output.innerHTML = tabs.map(tab => tab.url).join("\n");

      // Gets height on contents with a min of 60 and max of 200
      const clampedHeight = Math.min(Math.max(60, output.scrollHeight), 200);
      output.style.height = clampedHeight + "px";
    });
};

// Binds copyText to the copy button clicked event
document.getElementById("copy").addEventListener("click", copyText);

// Selects the text within output and copies it to the clipboard
function copyText() {
    output.select();
    document.execCommand("copy");
}
