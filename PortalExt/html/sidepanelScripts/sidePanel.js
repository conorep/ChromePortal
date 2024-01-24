document.getElementById('logSesh').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({message: 'tryLogin'}, function(response) {
        console.log(response);
        return true;
    });
    return true;
}, true)

function onError(e) {
    console.error(e);
}

function setInitCreds() {
    let nameInput = document.getElementById('nameIn');
    let passInput = document.getElementById('passIn');

    const setStuff = chrome.storage.local.get();
    setStuff.then(res => {
        if(res.hasOwnProperty('uName')) {
            nameInput.setAttribute('value', res.uName);
        }
        if(res.hasOwnProperty('uPass')) {
            passInput.setAttribute('value', res.uPass);
        }
    });
}

document.getElementById('nameIn').addEventListener('input', (e) => {
    chrome.storage.local.set({uName: e.target.value})
})
document.getElementById('passIn').addEventListener('input', (e) => {
    chrome.storage.local.set({uPass: e.target.value})
})


const gettingStoredSettings = chrome.storage.local.get();
gettingStoredSettings.then(setInitCreds, onError);

