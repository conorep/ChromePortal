"use strict";

const PORTAL_ORIGIN = 'apps.custom-control.com',
  PORTAL_EDIT = 'editReturn.aspx',
  LOGIN_PG = 'html/portalLogSP.html',
  UTIL_PG = 'html/mainSP.html',
  LOGIN_PATH = 'injections/doLogin.js',
  VERB_PATH = 'injections/fillVerbiage.js',
  CMM_PATH = 'injections/findAndFillCMMs.js',
  BETTER_ENTER_PATH = 'injections/fixSearchEnter.js',
  OP10_INSERT_PATH = 'injections/fillEmptyOp10ParetoCodes.js',
  INFO_TAB_PATH_FIX = 'injections/fixInfoElements.js',
  RESIZE_FRAME_PATH = 'injections/resizeFrame.js',
  MAKE_TAIL_BTN = 'injections/tailNumberBtn.js',
  MULTI_UPLOAD = 'injections/multFileUpload.js';

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
        chrome.storage.local.get().then(res => { console.log(res) })
    } else if(request.message) {
        (async() => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

            if(request.message === 'tryLogin') {
                let storeStuff = chrome.storage.local.get();

                storeStuff.then(res => {
                    let currTarget = { tabId: tab.id };
                    chrome.scripting.executeScript({
                        target: currTarget,
                        files: [LOGIN_PATH]
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
                    files: [VERB_PATH]
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
    let scriptsToInsert = [BETTER_ENTER_PATH, OP10_INSERT_PATH, INFO_TAB_PATH_FIX, RESIZE_FRAME_PATH, MAKE_TAIL_BTN];
    chrome.storage.local.get().then((res) => {
        if(res?.cmmState) {
            scriptsToInsert.push(CMM_PATH);
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
    let thePath = theURL.includes('/login.aspx') ? LOGIN_PG : UTIL_PG + '?portalEdit='+theURL.includes(PORTAL_EDIT);
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
self.onmessage = () => {};
createOffscreen().then(() => null);
