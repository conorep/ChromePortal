"use strict";

const PORTAL_ORIGIN = 'apps.custom-control.com';
const loginPg = 'html/portalLogSP.html';
const utilPg = 'html/mainSP.html';
const loginPath = 'injections/doLogin.js';
const verbPath = 'injections/fillVerbiage.js';
const cmmPath = 'injections/findAndFillCMMs.js';
const betterEnterPath = 'injections/fixSearchEnter.js';
const op10InsertPath = 'injections/fillEmptyOp10ParetoCodes.js';
let navJustTriggered = false;

function lastErrs() {
    if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
    }
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab?.url) return;

    if(!info.status || info.status !== 'complete') return;

    if(!navJustTriggered) {
        await checkHost(tab);
    } else {
        navJustTriggered = false;
    }
});

chrome.tabs.onActivated.addListener(checkTabURL);

chrome.runtime.onConnect.addListener(checkTabURL);

chrome.webNavigation.onCompleted.addListener(async (info) => {
    if(info?.url?.includes(PORTAL_ORIGIN)) {
        navJustTriggered = true;
        await checkThePage(info.url, info.tabId);
    }
})

chrome.action.onClicked.addListener(async (tab) => {
    checkHost(tab).then(() => {
        chrome.action.isEnabled(tab.id, (res) => {
            if(res) {
                chrome.sidePanel.open({windowId: tab.windowId}, () => {
                    if(chrome.runtime.lastError) { return true; }
                });
            }
        })
    })
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.hasOwnProperty('cmmState')) {
        console.log('got cmmState', request.cmmState);
        chrome.storage.local.get().then(res => {
            console.log(res)
        })
    } else if(request.message) {
        (async() => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

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
                        }).then(() => {
                            sendResponse({login: 'good'});
                            return true;
                        });
                    })
                })
            } else if(request.message === 'tryInsert' && request.btnID !== '') {
                let defaultTarget = { tabId: tab.id, allFrames : true };

                chrome.scripting.executeScript({
                    target: defaultTarget,
                    files: [verbPath]
                }).then(() => {
                    chrome.scripting.executeScript({
                        target: defaultTarget,
                        args: [request.btnID],
                        func: (...args) => fillVerbiage(...args),
                    }).then(() => {
                        sendResponse({ insert: 'good' });
                        return true;
                    })
                })
            } else {
                sendResponse({});
                return true;
            }
        })();
        return true;
    }
    sendResponse({});
    return true;
});

chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({active: true})
    chrome.sidePanel.open({ tabId: tab.id }, () => {
        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            return true;
        }
    });
});

async function checkHost(tab) {
    let tabId = tab.id;
    let checkURL = new URL(tab.url);
    if(checkURL.host === PORTAL_ORIGIN) {
        await checkThePage(checkURL.href, tabId);
    } else {
        chrome.sidePanel.setOptions({ tabId: tabId, enabled: false }).then(lastErrs);
    }
}

async function checkTabURL() {
    let theTab = await getCurrentTab();
    if(theTab?.url?.includes(PORTAL_ORIGIN)) {
        await checkThePage(theTab.url, theTab.id);
    }
}

async function injectListeners(currTab) {
    let bigTarget = { tabId: currTab, allFrames : true };
    let scriptsToInsert = [betterEnterPath, op10InsertPath];
    chrome.storage.local.get().then((res) => {
        if(res?.cmmState) {
            scriptsToInsert.push(cmmPath);
        }
        chrome.scripting.executeScript({
            target: bigTarget,
            files: scriptsToInsert
        });
    })
}

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
    let thePath = theURL.includes('/login.aspx') ? loginPg : utilPg;
    chrome.sidePanel.setOptions({ tabId: theTabId, path: thePath, enabled: true }).then(() => {
        lastErrs();
        injectListeners(theTabId);
    });
}

async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: './html/portalOffscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    }).catch(() => {}).then(async () => {
        await checkTabURL();
    })
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {};
createOffscreen().then(r => null);


