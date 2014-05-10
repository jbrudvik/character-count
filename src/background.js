var manifest = chrome.runtime.getManifest();

var inactiveIcons = manifest.browser_action.default_icon;
var activeIcons = {
  '19': 'icons/active-19.png',
  '38': 'icons/active-38.png'
};

var inactiveTitle = manifest.browser_action.default_title;
var activeTitle = 'Stop showing line lengths';


var active = false;

function toggleActiveState() {
  chrome.browserAction.setIcon({
    path: active ? inactiveIcons : activeIcons
  });

  chrome.browserAction.setTitle({
    title: active ? inactiveTitle : activeTitle
  });

  active = !active;
}

chrome.browserAction.onClicked.addListener(toggleActiveState);
