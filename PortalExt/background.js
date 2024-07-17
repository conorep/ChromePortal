"use strict";

const PORTAL_ORIGIN = 'apps.custom-control.com';
const loginPg = 'html/portalLogSP.html';
const utilPg = 'html/mainSP.html';
const loginPath = 'injections/doLogin.js';
const verbPath = 'injections/fillVerbiage.js';

function lastErrs() {
    if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
    }
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    console.log('tabs updated', tabId, info, tab);
    if (!tab?.url) return;

    if(!info.status || info.status !== 'complete') return;

    let { host } = new URL(tab.url);
    console.log(host)
    if(host?.includes(PORTAL_ORIGIN)) {
        console.log('YEP, the url!', host);
        await checkThePage(host, tabId);
    } else {
        console.log('NOPE, not the url!', host);
        chrome.sidePanel.setOptions({
            tabId: tabId,
            enabled: false
        }).then(r => lastErrs);
    }
});

chrome.webNavigation.onCompleted.addListener(async (info) => {
    console.log('webnavcomplete', info);
    if(info?.url?.includes(PORTAL_ORIGIN)) {
        await checkThePage(info.url, info.tabId);
    }
})

chrome.runtime.onConnect.addListener(async (port) => {
    if(port.name === 'sidePanelLog' || port.name === 'sidePanelUtil') {
        let theTab = await getCurrentTab();
        if(theTab?.url?.includes(PORTAL_ORIGIN)) {
            await checkThePage(theTab.url, theTab.id);
        }
        port.onDisconnect.addListener(async () => {
            console.log('Side panel closed.');
        });
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(request, sender)
    if(request.message) {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        if(request.message === "tryLogin") {
            let storeStuff = chrome.storage.local.get();
            storeStuff.then(res => {
                let currTarget = { tabId: tab.id };
                chrome.scripting.executeScript({
                    target: currTarget,
                    files: [loginPath]
                }).then(() => {
                    chrome.scripting.executeScript({
                        target: currTarget,
                        args: [res.uName, res.uPass],
                        func: (...args) => doLogin(...args),
                    });
                    sendResponse({login: 'good'});
                })
                return true;
            })
        } else if(request.message === 'tryInsert') {
            let defaultTarget = { tabId: tab.id, allFrames : true };
            chrome.scripting.executeScript({
                target: defaultTarget,
                files: [verbPath]
            }).then(() => {
                chrome.scripting.executeScript({
                    target: defaultTarget,
                    args: [request.btnID],
                    func: (...args) => fillVerbiage(...args),
                });
                sendResponse({insert: 'good'});
            })
            return true;
        }

    }
});

/**
 * Get the active tab.
 * @returns {Promise<chrome.tabs.Tab>}
 */
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

/**
 * This function checks the URL of a page and sets the side panel page accordingly.
 * @param theURL URL of current page
 * @param theTabId tab ID
 * @returns {Promise<void>}
 */
async function checkThePage(theURL, theTabId) {
    console.log('url/tabid', theURL, theTabId);
    let thePath = theURL.includes('/login.aspx') ? loginPg : utilPg;

    chrome.sidePanel.setOptions({ enabled: true, path: thePath, tabId: theTabId }).then(r => lastErrs);
}

async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: './html/portalOffscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    }).catch(() => {});
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {};
createOffscreen().then(r => null);


