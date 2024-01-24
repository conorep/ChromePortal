console.log('injected');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('something')
    let thisScript = "<script id='newScriptStuff' type='text/javascript'>() => (console.log('injected'))</script>"
    if (message.message === "myMessage") {
        console.log("recieved message");
    }
});

/*chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        alert('HIIII')
        if (request.hasOwnProperty('uName')) {
            console.log(sender, request, sendResponse)
            tryLogFunc(request);
        }
    }
);

const tryLogFunc = (resObj) => {
    alert('HIIII')
    if(resObj && resObj.hasOwnProperty('uName') && resObj.hasOwnProperty('uPass')) {
        const iframe = document.getElementById("dlgFrame");
        if(iframe != null){
            iframe.contentWindow.document.getElementById("loginCtl_UserName").value = "conor";
            iframe.contentWindow.document.getElementById("loginCtl_Password").value = "Chrissy";
            iframe.contentWindow.document.getElementById("loginCtl_LoginButton").click();
            console.log('someone is here');
        } else if(document.getElementById("loginCtl_UserName")) {
            document.getElementById("loginCtl_UserName").value = "conor";
            document.getElementById("loginCtl_Password").value = "Chrissy";
            document.getElementById("loginCtl_LoginButton").click();
            console.log('someone is here');
        }
    }
}*/
