/**
 * This function finds certain page elements and injects text. Side panel buttons trigger the message that triggers
 * this function and its inner functions.
 * @param btnName string button ID
 */
function fillVerbiage(btnName) {
  if(btnName === 'singlePassed' || btnName === 'multiPassed') {
    addPassed(btnName);
  } else if(btnName === 'singleBatt' || btnName === 'multiBatt') {
    batteryWork(btnName);
  }

  function addPassed(plurality) {
    let iFrame = document.getElementById("dlgFrame");
    if(iFrame != null) {
      let howMany = plurality === 'singlePassed' ? '' : 's';
      howMany = " After reassembly, the unit" + howMany + " passed full functional testing."
      dataInsert(iFrame, howMany)
    }
  }

  function batteryWork(plurality) {
    let iFrame = document.getElementById("dlgFrame");
    if(iFrame != null) {
      let howMany = plurality === 'singleBatt' ? ['each unit\'s depleted batteries', 's'] :
        ['the unit\'s depleted battery', ''];
      howMany = "I replaced "+howMany[0]+". After reassembly, the unit"+ howMany[1] +
        " passed full functional testing."
      dataInsert(iFrame, howMany);
    }
  }

  function dataInsert(iFrame, textToInsert) {
    let txtNotes = iFrame.contentWindow.document.getElementById('txtNotes1');
    if(txtNotes) {
      txtNotes.value += textToInsert;
    }
  }
}
