/**
 * This content script gets injected into Portal screens and, when it finds the Operation 10 - Test box, checks
 * whether it has text content or not. If no, the pareto code verbiage gets inserted dynamically.
 */
(() => {
  const paretoCodeBlock = 'Failure Mode/NTF: \nWarranty (W)/Non-Warranty (NW)/Non-Warranty No-Charge (NWNC): \n' +
    'Pareto Code: ';
  const op10TextAreaID = 'txtNotes2';
  let testOpTextarea = document.getElementById(op10TextAreaID);

  if(testOpTextarea && !testOpTextarea?.readOnly) {
    console.log(testOpTextarea?.readOnly);
    if(testOpTextarea.innerHTML.trim() === '') {
      testOpTextarea.value = paretoCodeBlock;
    }
  }
})();
