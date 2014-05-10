// TODO: Figure out why this isn't working

var enabled = false;

function toggleIcon() {
  chrome.browserAction.setIcon({
    path: enabled ? 'icon-inactive.png' : 'icon-active.png'
  });
  enabled = !enabled;
}

chrome.browserAction.onClicked.addListener(toggleIcon);

console.log('loaded');
