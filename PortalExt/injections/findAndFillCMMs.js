/**
 * This content script, when injected by the extension's service worker, does one of two things:
 * 1. finds a unit's part number, removes all but the prefix, and saves that to storage
 * 2. finds the CMM input, gets the CMM storage value, and injects it (with the -CMM-01 text) into the input,
 *  then removes the value from storage
 */
(() => {
  const partNumID = 'ctl00_ctl00_cphSite_cphReturn_lblPart';
  const CMMInputID = 'txtDrawing';
  const cmmText = 'currCMMText';

  let partNumVar = document.getElementById(partNumID);
  if(partNumVar) {
    let partVal = partNumVar.innerText;

    if(partVal && partVal !== '') {
      partVal = partVal.split('-')[0];
      chrome.storage.local.set({currCMMText: partVal})
    }
  }

  let cmmInVar = document.getElementById(CMMInputID)
  if(cmmInVar) {
    chrome.storage.local.get(cmmText).then((res) => {
      if(res?.currCMMText) {
        cmmInVar.value = res.currCMMText + '-CMM-01';
        chrome.storage.local.remove(cmmText);
      }
    })
  }
})();
