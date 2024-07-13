console.log('injected');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let resSend = {};

    if(request.message === "myMessage") {
        console.log("received message");
        resSend = {good: 'hearingFromYou'};
    }

    sendResponse(resSend);
    return true;
});