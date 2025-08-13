/**
 * Make the "Operation" modal's resizing fit the changes to the textarea element in the modal.
 * Fix a select input width.
 */
if(window === window.top) {
  const INIT_WIDTH = 750;
  let dialogDiv, frameBody, frameTextArea, dlgFrame, frameDoc, divGlass;

  const fixTitle = () => {
    const dlgT = frameDoc.querySelector('.dlgTitle');
    if(!dlgT) return;
    dlgT.style.height = '';

    const titleSpan = dlgT.getElementsByTagName('SPAN')?.[0];
    if(titleSpan) titleSpan.style.top = '2px';

    const dlgClose = frameDoc.getElementById('dlgClose');
    if(!dlgClose.width) {
      dlgClose.src = dlgClose.src.slice(0, dlgClose.src.indexOf('%20'));
      dlgClose.width = 19;
    }


    const nestedDlgFrame = frameDoc.getElementById('dlgFrame'),
      nestedDialogDiv = frameDoc.getElementById('divDialog');
    if(!nestedDlgFrame || !nestedDialogDiv) return;

    nestedDlgFrame.style.width = nestedDialogDiv.style.width;
  }

  const fixGlass = () => {
    divGlass = frameDoc.getElementById('divGlass');
    if(!divGlass) return;

    divGlass.style.top = '0';
    divGlass.style.height = 'calc(100% - 20px)';
  }

  const moveListener = () => {
    if(!dialogDiv) return;

    dialogDiv.style.height = frameBody.scrollHeight + 40 + 'px';
    let textWidth = INIT_WIDTH > frameTextArea.offsetWidth ? INIT_WIDTH : frameTextArea.offsetWidth;
    dialogDiv.style.width = textWidth + 20 + 'px';
  }

  const elementFinder = () => {
    frameDoc = dlgFrame.contentDocument;
    frameBody = frameDoc.getElementsByTagName('BODY')?.[0];
    frameTextArea = frameDoc.getElementById('txtNotes1');

    if(frameTextArea) {
      frameTextArea.style.display = 'block';
      frameTextArea.style.minWidth = '750px';
      frameTextArea.style.maxHeight = '400px';
      dialogDiv = document.getElementById('divDialog');
      moveListener();
      fixTitle();
      fixGlass();

      frameTextArea.addEventListener('mousedown', () => {
        frameDoc.addEventListener('mousemove', moveListener)
        frameDoc.addEventListener('mouseup', moveListener)
      })
    }
  }

  dlgFrame = document.getElementById('dlgFrame');
  if(dlgFrame) {
    dlgFrame.style.height = '100%';
    dlgFrame.userSelect = 'none';
    elementFinder();
  }

  const customerSelect = document.getElementById('ctl00_ctl00_cphDlgs_cphReturnDlgs_drpCustomer');
  if(customerSelect) customerSelect.style.maxWidth = '100%';
}
