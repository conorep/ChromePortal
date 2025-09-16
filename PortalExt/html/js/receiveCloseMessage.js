chrome.runtime.onMessage.addListener((request) => {
  if(request.hasOwnProperty('closePortalPanel'))
    window.close();
})
