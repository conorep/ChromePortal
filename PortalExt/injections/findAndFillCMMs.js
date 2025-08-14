/**
 * This content script finds the CMM input, looks at the parent window to get + parse data used in building the
 *  input string, then inserts that string.
 *  This works in the 'Op20' modal CMM input.
 */
(() => {
  const partNumID = 'ctl00_ctl00_cphSite_cphReturn_lblPart';
  const CMMInputID = 'txtDrawing';

  const cmmInVar = document.getElementById(CMMInputID);
  if(cmmInVar && !cmmInVar.value) {
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
