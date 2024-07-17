chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let resSend = {};

    if(request.message === "myMessage") {
        resSend = {good: 'hearingFromYou'};
    }

    sendResponse(resSend);
    return true;
});