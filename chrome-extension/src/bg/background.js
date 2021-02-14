chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    const currentTab = tab[0];
    const currentTabUrl = currentTab.url;

    const GITHUB_DOMAIN_NAME = "github";
    if (!currentTabUrl.match(GITHUB_DOMAIN_NAME)) return;

    const GITHUB_ROOT_DOMAIN = "github.com";
    const GITHUB_1S_ROOT_DOMAIN = "github1s.com";

    let newTabUrl = "";
    let extensionIconPath = "../../icons/icon19.png";
    let extensionTooltip = "GitHub 1s Disabled";

    if (currentTabUrl.indexOf(GITHUB_1S_ROOT_DOMAIN) >= 0) {
      newTabUrl = currentTabUrl.replace(GITHUB_1S_ROOT_DOMAIN, GITHUB_ROOT_DOMAIN);
    } else {
      newTabUrl = currentTabUrl.replace(GITHUB_ROOT_DOMAIN, GITHUB_1S_ROOT_DOMAIN);
      extensionIconPath = "../../icons/icon19-active.png";
      extensionTooltip = "GitHub 1s Enabled";
    }

    chrome.tabs.update(tab.id, { url: newTabUrl });
    chrome.browserAction.setTitle({ title: extensionTooltip });
    chrome.browserAction.setIcon({ path: extensionIconPath, tabId: tab.id });
  });
});
