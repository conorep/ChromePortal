// let authCredentials = {
//     uName: 'Conor1',
//     uPass: 'Chrissy1'
// }

document.getElementById('logSesh').addEventListener('click', (e) => {
    let getSesh = chrome.storage.local.get();
    getSesh.then((res) => {
        console.log(res);
    })
}, true)

function onError(e) {
    console.error(e);
}

function checkStoredSettings(storedSettings) {
    setInitCreds()
}

function setInitCreds() {
    let nameInput = document.getElementById('nameIn');
    let passInput = document.getElementById('passIn');

    const setStuff = chrome.storage.local.get();
    setStuff.then(res => {
        console.log(res);
        if(res.hasOwnProperty('uName')) {
            nameInput.setAttribute('value', res.uName);
        }
        if(res.hasOwnProperty('uPass')) {
            passInput.setAttribute('value', res.uPass);
        }
    });
}

document.getElementById('nameIn').addEventListener('input', (e) => {
    console.log(e.target.value);
    chrome.storage.local.set({uName: e.target.value})
})
document.getElementById('passIn').addEventListener('input', (e) => {
    console.log(e.target.value);
    chrome.storage.local.set({uPass: e.target.value})
})


const gettingStoredSettings = chrome.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);



