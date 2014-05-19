var manifest = chrome.runtime.getManifest();

var inactiveIcons = manifest.browser_action.default_icon;
var activeIcons = {
  '19': 'icons/active-19.png',
  '38': 'icons/active-38.png'
};

var inactiveTitle = manifest.browser_action.default_title;
var activeTitle = 'Stop showing line lengths';


var active = false;


function setActiveState(activeState) {
  active = activeState;

  chrome.browserAction.setIcon({
    path: active ? activeIcons : inactiveIcons
  });

  chrome.browserAction.setTitle({
    title: active ? activeTitle : inactiveTitle
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { active: active });
  });
}

function toggleActiveState() {
  setActiveState(!active);
}


chrome.browserAction.onClicked.addListener(toggleActiveState);

chrome.runtime.onMessage.addListener(function (message) {
  setActiveState(!!message.active);
});
