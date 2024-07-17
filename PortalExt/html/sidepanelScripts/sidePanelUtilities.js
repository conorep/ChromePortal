chrome.runtime.connect({ name: 'sidePanelUtil' });

document.addEventListener('click', (e) => {
  let currBtn = e.target.id;
  chrome.runtime.sendMessage({message: 'tryInsert', btnID: currBtn}, function(response) {
    if(chrome.runtime.lastError) {
      return true;
    }
  });
})
