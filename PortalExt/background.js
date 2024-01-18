const PORTAL_ORIGIN = 'http://apps.custom-control.com';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open side panel',
        contexts: ['all']
    });
});

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    checkURL(tab, tabId);
});

const checkURL = async (tab, tabId) => {
    const url = new URL(tab.url);
    if(url.origin.includes(PORTAL_ORIGIN)) {
        await chrome.sidePanel.setOptions({
            tabId,
            path: 'sidepanel.html',
            enabled: true
        });
    } else {
        await chrome.sidePanel.setOptions({
            tabId,
            enabled: false
        });
    }
}