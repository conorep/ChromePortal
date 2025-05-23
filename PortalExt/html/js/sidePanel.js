const nameInput = document.getElementById('nameIn');
const passInput = document.getElementById('passIn');

document.getElementById('logSesh').addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'tryLogin' }, () => {
        if(chrome.runtime.lastError) return true;
    });
});

document.getElementById('clearSesh').addEventListener('click', () => {
    chrome.storage.local.clear()
      .then(() => {
          nameInput.value = '';
          passInput.value = '';
      })
      .catch(onError)
});

const onError = (e) => console.error(e);

const setInitCreds = () => {
    chrome.storage.local.get().then(res => {
        res.hasOwnProperty('uName') && nameInput.setAttribute('value', res.uName);
        res.hasOwnProperty('uPass') && passInput.setAttribute('value', res.uPass);
    });
}

nameInput.addEventListener('input', (e) => {
    chrome.storage.local.set({ uName: e.target.value })
})
passInput.addEventListener('input', (e) => {
    chrome.storage.local.set({ uPass: e.target.value })
})

const gettingStoredSettings = chrome.storage.local.get();
gettingStoredSettings.then(setInitCreds, onError);
