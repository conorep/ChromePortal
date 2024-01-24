const PORTAL_ORIGIN = 'http://apps.custom-control.com';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open side panel',
        contexts: ['all']
    });
});
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
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
});

function doTheLogin(logN, logP) {
    const iframe = document.getElementById("dlgFrame");
    if(iframe != null){
        iframe.contentWindow.document.getElementById("loginCtl_UserName").value = logN;
        iframe.contentWindow.document.getElementById("loginCtl_Password").value = logP;
        iframe.contentWindow.document.getElementById("loginCtl_LoginButton").click();
        console.log('someone is here');
    } else if(document.getElementById("loginCtl_UserName")) {
        document.getElementById("loginCtl_UserName").value = logN;
        document.getElementById("loginCtl_Password").value = logP;
        document.getElementById("loginCtl_LoginButton").click();
        console.log('someone is here');
    }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        if(request.message === "tryLogin") {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
            let storeStuff = chrome.storage.local.get();
            storeStuff.then(res => {
                console.log(res);
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: doTheLogin,
                    args: [res.uName, res.uPass]
                }).then(() => {
                    console.log("script injected?")
                })
            })
            console.log(tab);

            return true;
        }
    }
);


const loginFunction = async (resObj) => {
    if(resObj && resObj.hasOwnProperty('uName') && resObj.hasOwnProperty('uPass')) {
        chrome.tabs.sendMessage(sender.tab.id,{uName: resObj.uName, uPass: resObj.uPass})
    }
}

async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: './html/offscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    }).catch(() => {});
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {};
createOffscreen().then(r => null);


