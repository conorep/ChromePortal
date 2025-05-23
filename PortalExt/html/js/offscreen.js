const triggerKeepAlive = setInterval(async () => {
    (await navigator.serviceWorker.ready).active.postMessage('keepAlive');
}, 20e3);
console.log(triggerKeepAlive)