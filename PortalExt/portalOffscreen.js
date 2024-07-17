chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'myMessage') {
        sendResponse({good: 'hearingFromYou'});
        return true;
    }
});