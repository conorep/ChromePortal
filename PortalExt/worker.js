"use strict";

const PORTAL_ORIGIN = 'apps.custom-control.com',
  PORTAL_EDIT = 'editReturn.aspx',
  LOGIN_PG = 'html/portalLogSP.html',
  UTIL_PG = 'html/mainSP.html',
  LOGIN_PATH = 'injections/doLogin.js',
  VERB_PATH = 'injections/fillVerbiage.js',
  CMM_PATH = 'injections/findAndFillCMMs.js',
  ENTER_AND_ALERTS_PATH = 'injections/keydownAndAlertBlocker.js',
  OP10_INSERT_PATH = 'injections/fillEmptyOp10ParetoCodes.js',
  INFO_TAB_PATH_FIX = 'injections/fixInfoElements.js',
  RESIZE_FRAME_PATH = 'injections/resizeFrame.js',
  RESIZE_PAGE_PATH = 'injections/setMinPageWidth.js',
  SET_EDIT_CMM_PATH = 'injections/setCMM.js',
  MAKE_TAIL_BTN = 'injections/tailNumberBtn.js',
  MULTI_UPLOAD = 'injections/multFileUpload.js';

const checkErr = () => {
    chrome.runtime.lastError && console.log(chrome.runtime.lastError);
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.tabs.onActivated.addListener(activatedTabURL);

chrome.runtime.onConnect.addListener(checkTabURL);

chrome.webNavigation.onCompleted.addListener((info) => {
    if(info?.url?.includes(PORTAL_ORIGIN)) {
        checkThePage(info.url, info.tabId);
    }

    if(info?.url?.startsWith('https://www.google.com/search')) {
        chrome.scripting.executeScript({
            target: { tabId: info.tabId }, func: () => {
                let allH1s = document.querySelectorAll('h1');
                [...allH1s].every((h1Ele) => {
                    if(h1Ele.innerHTML === 'AI Overview') {
                        h1Ele.closest('div[data-hveid]').remove();
                        return false;
                    }
                    return true;
                })
            }
        }, checkErr)
    }
})

chrome.action.onClicked.addListener(async (tab) => {
    chrome.action.isEnabled(tab.id, (res) => {
        if(res) {
            chrome.sidePanel.open({ windowId: tab.windowId }, () => {
                if(chrome.runtime.lastError) { return null; }
                injectResizeEventDispatcher(tab.id);
            });
        }
    })
});

chrome.commands.onCommand.addListener(openAllTabs);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.hasOwnProperty('cmmState')) {
        chrome.storage.local.get(null, (res => { console.log(res) }));
    } else if(request.message) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {

            if(request.message === 'tryLogin') {
                chrome.storage.local.get(null, (res => {
                    let currTarget = { tabId: tab.id };
                    chrome.scripting.executeScript({
                        target: currTarget,
                        files: [LOGIN_PATH]
                    }, () => {
                        checkErr();
                        chrome.scripting.executeScript({
                            target: currTarget,
                            args: [res.uName, res.uPass],
                            func: (...args) => doLogin(...args),
                        }, () => {
                            checkErr();
                            sendResponse({ login: 'good' });
                            return true;
                        });
                    })
                }));
            } else if(request.message === 'tryInsert' && request.btnID !== '') {
                let defaultTarget = { tabId: tab.id, allFrames: true };
                chrome.scripting.executeScript({
                    target: defaultTarget,
                    files: [VERB_PATH]
                }, () => {
                    checkErr();
                    chrome.scripting.executeScript({
                        target: defaultTarget,
                        args: [request.btnID],
                        func: (...args) => fillVerbiage(...args),
                    }, () => {
                        checkErr();
                        sendResponse({ insert: 'good' });
                        return true;
                    })
                })
            } else {
                sendResponse({});
                return true;
            }
            return true;
        })
    }
    sendResponse({});
    return true;
});

function activatedTabURL(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, (res) => {
        chrome.sidePanel.setOptions({
              tabId: activeInfo.tabId,
              enabled: res && res.url?.includes(PORTAL_ORIGIN)
          }, checkErr);
    })
}

function openAllTabs() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId }, () => {
                checkErr();
                injectResizeEventDispatcher(tab.id);
            })
        });
    })
}

function injectResizeEventDispatcher(tabID) {
    chrome.scripting.executeScript({
        target: { tabId: tabID }, func: () => {
            window.dispatchEvent(new Event('resize'));
        }
    }, checkErr)
}

function injectListeners(currTab) {
    const bigTarget = { tabId: currTab, allFrames : true };
    const scriptsToInsert = [
      ENTER_AND_ALERTS_PATH, OP10_INSERT_PATH, INFO_TAB_PATH_FIX, RESIZE_FRAME_PATH,
        MAKE_TAIL_BTN, RESIZE_PAGE_PATH, SET_EDIT_CMM_PATH
    ];

    chrome.storage.local.get(null, (res) => {
        if(res?.cmmState) scriptsToInsert.push(CMM_PATH);
        chrome.scripting.executeScript({
            target: bigTarget,
            files: scriptsToInsert
        }, () => {
            chrome.runtime.lastError ?
              console.log(chrome.runtime.lastError)
              : null
        });
    })
}

function checkTabURL() {
    chrome.tabs.query({ url: 'http://'+PORTAL_ORIGIN+'/*' }, (tabs) => {
        tabs.forEach((theTab) => {
            if(theTab.url.includes(PORTAL_ORIGIN)) {
                checkThePage(theTab.url, theTab.id);
            }
        })
    });
}

/**
 * This function checks the URL of a page and sets the side panel page accordingly.
 * @param theURL URL of current page
 * @param theTabId tab ID
 */
function checkThePage(theURL, theTabId) {
    if(!theURL || !theTabId) {
        return;
    }

    if(theURL.includes(PORTAL_ORIGIN)) {
        let thePath = theURL.includes('/login.aspx') ? LOGIN_PG : UTIL_PG + '?portalEdit='+theURL.includes(PORTAL_EDIT);

        chrome.sidePanel.setOptions({ path: thePath, enabled: true, tabId: theTabId }, () => {
            checkErr();
            injectListeners(theTabId);
        });
    } else {
        chrome.sidePanel.setOptions({ tabId: theTabId, enabled: false });
    }
}

function createOffscreen() {
    chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] }, (contexts) => {
        if(!contexts || contexts?.length > 0) { return; }
        chrome.offscreen.createDocument({
            url: './html/portalOffscreen.html',
            reasons: ['BLOBS'],
            justification: 'keep service worker running',
        }, checkTabURL)
    })

}
self.onmessage = () => {};
createOffscreen();
