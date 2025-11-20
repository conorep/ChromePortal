"use strict";

const PORTAL_ORIGIN = 'apps.custom-control.com',
  PORTAL_EDIT = 'editReturn.aspx',
  LOGIN_PG = 'html/portalLogSP.html',
  UTIL_PG = 'html/mainSP.html',
  LOGIN_PATH = 'injections/doLogin.js',
  VERB_PATH = 'injections/fillVerbiage.js',
  CMM_PATH = 'injections/auto/findAndFillCMMs.js',
  ENTER_AND_ALERTS_PATH = 'injections/auto/keydownAndAlertBlocker.js',
  OP10_INSERT_PATH = 'injections/auto/fillEmptyOp10ParetoCodes.js',
  INFO_TAB_PATH_FIX = 'injections/auto/fixInfoElements.js',
  RESIZE_FRAME_PATH = 'injections/auto/resizeFrame.js',
  SET_EDIT_CMM_PATH = 'injections/auto/setCMM.js',
  MAKE_TAIL_BTN = 'injections/auto/tailNumberBtn.js',
  ZERO_ADMIN_HOURS = 'injections/auto/zeroQuoteAdminHours.js',
  PANEL_OPEN_STATE = 'injections/checkOpenState.js',
  MULTI_UPLOAD = 'injections/multFileUpload.js';

const checkErr = () => chrome.runtime.lastError && console.log(chrome.runtime.lastError);

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.tabs.onActivated.addListener(activatedTabURL);

chrome.runtime.onConnect.addListener(checkTabURL);

chrome.webNavigation.onBeforeNavigate.addListener((info) => {
  const isOuterFrame = info.frameType === 'outermost_frame';
  if(!isOuterFrame) return;

  chrome.windows.getCurrent({ populate: true }, (windowRes) => {
    for(const winTab of windowRes.tabs) {
      const includesPortal = winTab.url?.includes(PORTAL_ORIGIN);

      chrome.sidePanel.getOptions({ tabId: winTab.id }, (options) => {
        if(includesPortal && options?.enabled && winTab.pendingUrl?.includes?.(PORTAL_ORIGIN) === false)
          chrome.runtime.sendMessage({ closePortalPanel: true }, checkErr);
      })
    }
  })
})

chrome.webNavigation.onCompleted.addListener((info) => {
  if(info?.url?.includes(PORTAL_ORIGIN))
    checkThePage(info.url, info.tabId);
})

chrome.action.onClicked.addListener(async (tab) => {
  chrome.action.isEnabled(tab.id, (res) => {
    if(!res) return null;

    chrome.sidePanel.open({ windowId: tab.windowId }, () => {
      if(chrome.runtime.lastError) return null;
      injectResizeEventDispatcher(tab.id);
    });
  })
});

chrome.commands.onCommand.addListener(openAllTabs);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.hasOwnProperty('cmmState')) {
    chrome.storage.local.get(null, (res => { console.log(res) }));
  } else if(request.hasOwnProperty('panelIsOpen')) {
    let senderTab = sender.tab.id;

    if(!request.panelIsOpen)
      chrome.sidePanel.open({ tabId: senderTab }, checkErr);
    else
      chrome.runtime.sendMessage({ closePortalPanel: true }, checkErr);
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
            args: [request.btnID, request.btnTitle],
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if(info.menuItemId === 'portalSidebar') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [PANEL_OPEN_STATE]
    }, () => {
      chrome.runtime.lastError ? console.log(chrome.runtime.lastError) : null
    });
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Chrome Portal Extension',
    contexts: ['all'],
    documentUrlPatterns: ['http://apps.custom-control.com/*'],
    id: 'portalSidebar'
  }, () => {
    if(chrome.runtime.lastError) console.log(chrome.runtime.lastError);
  });
})

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
    target: { tabId: tabID },
    func: () => window.dispatchEvent(new Event('resize'))
  }, checkErr)
}

function injectListeners(currTab) {
  const bigTarget = { tabId: currTab, allFrames : true };
  const scriptsToInsert = [
    ENTER_AND_ALERTS_PATH, OP10_INSERT_PATH, INFO_TAB_PATH_FIX, RESIZE_FRAME_PATH,
    MAKE_TAIL_BTN, SET_EDIT_CMM_PATH, ZERO_ADMIN_HOURS
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
  chrome.tabs.query({url: 'http://'+PORTAL_ORIGIN+'/*'}, (tabs) => {
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
  if(!theURL || !theTabId) return;
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
