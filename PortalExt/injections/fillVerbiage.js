/**
 * This function finds certain page elements and injects text. Side panel buttons trigger the message that triggers
 * this function and its inner functions.
 * @param btnName string button ID
 * @param btnTitle string button title
 */
function fillVerbiage(btnName, btnTitle) {
  const iFrame = document.getElementById('dlgFrame');
  btnTitle = btnTitle.replace(/[\n\r\t]/gm, '').replace(/\s+/g, ' ');

  const insertAtCursor = (noteElement, textContent) => {
    let cursorPos = noteElement.selectionStart;
    let v = noteElement.value;
    let textBefore = v.substring(0,  cursorPos);
    let textAfter  = v.substring(cursorPos, v.length);
    noteElement.value = textBefore + textContent + textAfter;

    cursorPos += noteElement.value.length;
    noteElement.focus();
    noteElement.setSelectionRange(cursorPos, cursorPos);
  }

  const dataInsert = (textToInsert) => {
    let txtNotes = iFrame.contentWindow.document.getElementById('txtNotes1');
    txtNotes && insertAtCursor(txtNotes, textToInsert);
  }

  /**
   * Change documentation request select dropdown choices with one click.
   * @param certType String certification type
   */
  const selectCerts = (certType) => {
    let certSelect = certType.split('-')[1];
    const selChoice = [['NONE', '044'], ['FAA', '111'], ['DUAL', '313'], ['EASA', '222']];
    const selectIDs = ['txtRtsDoc', 'drpApprovalStatus', 'drpRepairEligibility'];

    for(let x = 0; x < selChoice.length; x++) {
      if(selChoice[x][0] === certSelect) {
        for(let y = 0; y < selectIDs.length; y++) {
          let sEle = document.getElementById(selectIDs[y]);
          if(sEle)
            sEle.selectedIndex = Number(selChoice[x][1].charAt(y));
          else
            break;
        }
        break;
      }
    }
  }

  const addPassed = (plurality) => {
    let howMany = plurality === 'singlePassed' ? '' : 's';
    howMany = ' After reassembly, the unit' + howMany + ' passed full functional testing.'
    dataInsert(howMany)
  }

  const batteryWork = (plurality) => {
    let howMany = plurality === 'multiBatt' ? ['each unit\'s depleted batteries', 's'] :
      ['the unit\'s depleted battery', ''];
    howMany = 'I replaced '+howMany[0]+'. After reassembly, the unit'+ howMany[1] +
      ' passed full functional testing.'
    dataInsert(howMany);
  }

  if(iFrame != null) {
    if(btnName.startsWith('release')) selectCerts(btnName);
    else if(btnName === 'singlePassed' || btnName === 'multiPassed') addPassed(btnName);
    else if(btnName === 'singleBatt' || btnName === 'multiBatt') batteryWork(btnName);
    else if(btnName === 'moddedBig') dataInsert('\n\n'+btnTitle);
    else if(btnName === 'dmgUnit') dataInsert('\n'+btnTitle);
    else dataInsert(btnTitle);
  }
}
