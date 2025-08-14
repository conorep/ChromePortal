/**
 *  This content script tunes up a pre-existing automated manual name creator.
 *  This works in the portal's RWO edit view and inserts the text in an input found in the 'Info' RWO tab.
 */
const loseFocusHandler = (e) => {
  let currTextVal = e.target.value;
  if(currTextVal.trim() !== '' && currTextVal.length > 4) {
    const mainManualInput = document.getElementById('txtCompMaintManual');
    //NEXT UP: add some invalidators tied to purchased parts that should have no CMM
    if(mainManualInput && mainManualInput.value === 'No Valid CMM' || mainManualInput.value.trim() === '') {
      currTextVal = currTextVal.slice(0, 3).toUpperCase() + '-CMM-01';
      mainManualInput.value = currTextVal;
    }
  }
}

if(window === window.top && window.location.pathname.endsWith('editReturn.aspx')) {
  const partNumInput = document.getElementById('txtPart');
  if(partNumInput) partNumInput.addEventListener('blur', loseFocusHandler);
}
