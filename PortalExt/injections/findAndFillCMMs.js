/**
 * This content script, when injected by the extension's service worker: finds the CMM input, looks at the parent
 *  window to get + parse data used in building the input string, then inserts that string.
 */
(() => {
  const partNumID = 'ctl00_ctl00_cphSite_cphReturn_lblPart';
  const CMMInputID = 'txtDrawing';

  let cmmInVar = document.getElementById(CMMInputID);
  if(cmmInVar) {
    let partNumVar = window.parent.document.getElementById(partNumID);
    if(partNumVar) {
      let partVal = partNumVar.innerText;
      if(partVal && partVal !== '') {
        partVal = partVal.split('-')[0];
        cmmInVar.value = partVal + '-CMM-01';
      }
    }
  }
})();
