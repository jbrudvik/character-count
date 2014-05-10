var activeIcons = {
  path: {
    '19': 'icons/active-19.png',
    '38': 'icons/active-38.png'
  }
};

var inactiveIcons = {
  path: {
    '19': 'icons/inactive-19.png',
    '38': 'icons/inactive-38.png'
  }
};

var active = false;

function toggleIcon() {
  chrome.browserAction.setIcon(active ? inactiveIcons : activeIcons);
  active = !active;
}

chrome.browserAction.onClicked.addListener(toggleIcon);
