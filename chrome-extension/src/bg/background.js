/**
 * An object used to define and determine the extension state based on the current tab's url.
 *
 * The object defines all three possible states, UNAVAILABLE, INACTIVE & ACTIVE. Each of these states
 * defines the associated icon and extension tooltip title.
 */
const extensionStates = {
  /**
   * The UNAVAILABLE state is when the current tab has loaded a non GitHub based url.
   */
  UNAVAILABLE: {
    ICON_PATH: "../../icons/icon19.png",
    TITLE: "GitHub 1s is unavailable for this site.",
  },
  /**
   * The INACTIVE state is when the current tab has loaded a GitHub based url but not enabled GitHub 1s.
   */
  INACTIVE: {
    ICON_PATH: "../../icons/icon19-inactive.png",
    TITLE: "GitHub 1s is inactive on this site.",
  },
  /**
   * The ACTIVE state is when the current tab has loaded a GitHub 1s based url.
   */
  ACTIVE: {
    ICON_PATH: "../../icons/icon19-active.png",
    TITLE: "GitHub 1s is active on this site.",
  },
  /**
   * Gets the relevant extension state based on the provide url.
   *
   * @param {String} url The url for which the extension state will be determined.
   */
  getExtensionStateFor: function (url) {
    if (!url) {
      throw new Error("url Parameter Is Invalid");
    }

    if (isNotAValidGitHubDomain(url)) {
      return this.UNAVAILABLE;
    }

    return isGitHub1sRootDomain(url) ? this.ACTIVE : this.INACTIVE;
  },
};

/**
 * An object used to define the GitHub related root domain strings.
 */
const extensionRootDomains = {
  GITHUB_1S_ROOT_DOMAIN: "github1s.com",
  GITHUB_ROOT_DOMAIN: "github.com",
};

/**
 * Determines if the provide url contains the GitHub domain name.
 *
 * @param {String} url The url to be tested to determine if it is a GitHub domain name.
 * @returns {Boolean} True if the provided url does not contain the GitHub domain name otherwise false.
 */
function isNotAValidGitHubDomain(url) {
  const GITHUB_DOMAIN_NAME = "github";
  return !url.match(GITHUB_DOMAIN_NAME);
}

/**
 * Determines if the provide url contains the GitHub 1s root domain.
 *
 * @param {String} url The url to be tested to determine if it contains the GitHub 1s Root Domain.
 * @param {String} github1sRootDomain
 * @returns {Boolean} True is the provided url does contain the GitHub 1s root domain otherwise false.
 */
function isGitHub1sRootDomain(url, github1sRootDomain = extensionRootDomains.GITHUB_1S_ROOT_DOMAIN) {
  return url.match(github1sRootDomain);
}

/**
 * Generates an object that contains the next allowable state and associated url.
 *
 * If the previousTabExtensionState is UNAVAILABLE then the previousTabExtensionState and url values are returned.
 *
 * If the previousTabExtensionState is INACTIVE then the ACTIVE state is returned with a new, updated url to represent the transitioned state.
 * If the previousTabExtensionState is ACTIVE then the INACTIVE state is returned with a new, updated url to represent the transitioned state.
 *
 * @param {String} url A String containing the current url for the active tab.
 * @param {Object} previousTabExtensionState An extensionStates state object representing the previous state when the extension icon was clicked
 * in the active tab.
 * @param {Object} rootDomains A rootDomains instance. Used to pass the root domain constant values.
 * @returns{Object} An Object containing the next allowable state and associated url to be applied to the active tab.
 */
function transitionTabExtensionStateUsing(url, previousTabExtensionState, rootDomains = extensionRootDomains) {
  if (previousTabExtensionState === extensionStates.UNAVAILABLE) {
    return {
      newExtensionState: previousTabExtensionState,
      newStateUrl: url,
    };
  }

  let searchValue = "";
  let replacementValue = "";

  switch (previousTabExtensionState) {
    case extensionStates.ACTIVE:
      searchValue = rootDomains.GITHUB_1S_ROOT_DOMAIN;
      replacementValue = rootDomains.GITHUB_ROOT_DOMAIN;
      break;
    case extensionStates.INACTIVE:
      searchValue = rootDomains.GITHUB_ROOT_DOMAIN;
      replacementValue = rootDomains.GITHUB_1S_ROOT_DOMAIN;
      break;
  }

  return {
    newExtensionState: previousTabExtensionState === extensionStates.ACTIVE ? extensionStates.INACTIVE : extensionStates.ACTIVE,
    newStateUrl: url.replace(searchValue, replacementValue),
  };
}

/**
 * Browser Action onClick event handler.
 *
 * This event handler is fired when the extensions icon is clicked. The handler will determine the current state
 * for the active tab and update the tab url if moving to an active state is allowable.
 *
 */
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    const currentTab = tab[0];

    const previousTabExtensionState = extensionStates.getExtensionStateFor(currentTab.url);
    const transitionedTabExtensionState = transitionTabExtensionStateUsing(currentTab.url, previousTabExtensionState);

    chrome.tabs.update(tab.id, { url: transitionedTabExtensionState.newStateUrl });
  });
});

/**
 * Tab onActivated event handler.
 *
 * This event is fired when a tab is activated. The handler will determine the extension state from the
 * tab's url and update the extensions tooltip title and icon for the determined state.
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
    const currentTab = tab[0];
    const activeTabExtensionState = extensionStates.getExtensionStateFor(currentTab.url);

    chrome.browserAction.setTitle({ title: activeTabExtensionState.TITLE });
    chrome.browserAction.setIcon({ path: activeTabExtensionState.ICON_PATH, tabId: tab.id });
  });
});

/**
 * Tab onUpdate event handler.
 *
 * This event is fired when a tab is updated. If the url has been updated then the handler will determine the
 * extension state for the new url. The extension's tooltip title and icon will be updated based on the determined state.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    const activeTabExtensionState = extensionStates.getExtensionStateFor(changeInfo.url);

    chrome.browserAction.setTitle({ title: activeTabExtensionState.TITLE });
    chrome.browserAction.setIcon({ path: activeTabExtensionState.ICON_PATH, tabId: tab.id });
  }
});
