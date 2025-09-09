/**
 * Make the "Operation" modal's resizing fit the changes to the textarea element in the modal.
 * Fix a select input width.
 */
if(!window.alreadyInjected) {
  window.alreadyInjected = true;
  const fixGlass = () => {
    const divGlass = window.document.getElementById('divGlass');
    if(!divGlass) return;

    const thisHeight = window === window.top ? '100%' : 'calc(100% - 20px)';
    Object.assign(divGlass.style, { top: '0', height: thisHeight })
  }
  fixGlass();
}

if(window === window.top) {
  const INIT_WIDTH = 750;
  const textAreaStyle = {
    display: 'block',
    minWidth: '98.9%',
    minHeight: '60px',
    maxHeight: '400px',
    maxWidth: '98.9%',
    resize: 'vertical',
    border: '2px solid grey',
    borderRadius: '5px',
    marginTop: '5px',
    marginBottom: '10px'
  };

  let dialogDiv, frameBody, frameForm, frameTextArea, dlgFrame, frameDoc;

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

  const moveListener = (certainTextArea) => {
    if(!dialogDiv)
      dialogDiv = document.getElementById('divDialog');

    if(!dialogDiv) return;

    let textWidth = !certainTextArea || INIT_WIDTH > certainTextArea.offsetWidth ? INIT_WIDTH
      : certainTextArea.offsetWidth;
    const styleObj = {
      height: frameBody.scrollHeight + 40 + 'px',
      width: textWidth + 20 + 'px',
      borderRadius: '5px',
      border: 'solid #8dbcfd 3px'
    }
    Object.assign(dialogDiv.style, styleObj)
  }

  const fixDialogSize = (certainTextArea) => {
    moveListener(certainTextArea);

    if(frameTextArea) certainTextArea.addEventListener('mousedown', () => {
      frameDoc.addEventListener('mousemove', () => moveListener(certainTextArea))
      frameDoc.addEventListener('mouseup', () => {
        frameDoc.removeEventListener('mouseup', moveListener)
      })
    })
  }

  const selectAndInputFixes = () => {
    const selectEle = frameDoc.getElementsByTagName('SELECT'),
      op30Inputs = frameDoc.querySelectorAll('input[type="text"]');
    const inputBorderStyle = { border: 'solid 1px black' };
    [...op30Inputs, ...selectEle].forEach(input => Object.assign(input.style, inputBorderStyle));
  }

  const styleFixesOp10 = () => {
    const notes2 = frameDoc.getElementById('txtNotes2');
    Object.assign(textAreaStyle, { minWidth: '98%', width: '98%' });

    [frameTextArea, notes2].forEach(tArea => {
      if(tArea) {
        Object.assign(tArea.style, textAreaStyle);
        fixDialogSize(tArea);
      }
    })

    selectAndInputFixes();
  }

  const styleFixesOp20 = () => {
    if(frameTextArea) {
      Object.assign(frameTextArea.style, {
        display: 'block',
        minWidth: '750px',
        minHeight: '60px',
        maxHeight: '400px',
        maxWidth: '99%',
        resize: 'vertical',
        border: '2px solid grey',
        borderRadius: '5px',
        marginTop: '5px',
        marginBottom: '10px'
      })

      let completeDiv = frameDoc.getElementById('complete1');
      if(completeDiv) completeDiv.style.paddingTop = '5px';

      const fieldsetParent = frameForm.querySelector('fieldset:has(.sizingContainer)');
      if(fieldsetParent) {
        Object.assign(fieldsetParent.style, {
          display: 'flex',
          flexFlow: 'column wrap',
          justifySelf: 'stretch',
          alignItems: 'center'
        })
        Object.assign(frameForm.querySelector('.sizingContainer').style, { minWidth: '100%' })
        const partPnl = frameForm.querySelector('#pnlAddPart');
        if(partPnl) partPnl.style.marginLeft = '0';
      }

      const frameGrid = frameForm.querySelector('div.grid');
      if(frameGrid) Object.assign(frameGrid.style, { minWidth: '99%' })

      const gridTableContainers = frameForm.querySelectorAll('table#grdParts_h, div.gridBody table');
      if(gridTableContainers) {
        gridTableContainers.forEach((tblC) => {
          Object.assign(tblC.style, { minWidth: '100%' })
        });

        const gridEls = frameForm.querySelectorAll('#grdParts_h th, div.gridBody td');
        gridEls.forEach((tCell) => {
          if(tCell.tagName === 'TH' && (!tCell.scope || tCell.scope === ''))
            tCell.style.display = 'none';
          else
            Object.assign(tCell.style, { border: 'solid 1px black' })
        })
      }

      const gridBodyDiv = frameForm.querySelector('div.gridBody');
      if(gridBodyDiv) {
        Object.assign(gridBodyDiv.style, { marginTop: '-1px' })
        const gridBodyDeleteCells = gridBodyDiv.querySelectorAll('td:has(a)');
        gridBodyDeleteCells.forEach((dCell) => dCell.style.textAlign = 'center');

        const gridHeadAndBody = frameForm.querySelectorAll('div.gridHeader, div.gridBody');
        gridHeadAndBody.forEach((gridEl) => {
          Object.assign(gridEl.style, { overflow: 'auto', scrollbarGutter: 'stable' })
        })
      }

      const allInputs = frameForm.querySelectorAll('input');
      allInputs.forEach((input) => {
        if(input.type === 'text')
          Object.assign(input.style, { border: '2px solid cornflowerblue', borderRadius: '5px' })
      });

      const partListAnchor = frameDoc.getElementById('butPdfPartList');
      if(partListAnchor) {
        partListAnchor.style.marginTop = '0';
        const pdfImg = partListAnchor.querySelector('img');
        const printSpan = partListAnchor.querySelector('span');
        pdfImg.style.paddingTop = '5px';
        printSpan.style.paddingTop = '5px';
      }

      fixDialogSize(frameTextArea);
    }
  }

  const txtNotesFixesOp30 = () => {
    const notes2 = frameDoc.getElementById('txtNotes2'),
      notes3 = frameDoc.getElementById('txtNotes3');

    if(notes3?.readOnly) return;

    [frameTextArea, notes2, notes3].forEach(tArea => {
      if(tArea) {
        Object.assign(tArea.style, textAreaStyle);
        fixDialogSize(tArea);
      }
    })

    selectAndInputFixes();
  }

  const elementFinder = () => {
    frameDoc = dlgFrame.contentDocument;
    if(!frameDoc) return;

    frameBody = frameDoc.getElementsByTagName('BODY')?.[0];
    fixTitle();

    frameTextArea = frameDoc.getElementById('txtNotes1');
    frameForm = frameDoc.getElementById('form1');

    if(!frameForm) return;

    const isOp10 = frameForm.action?.includes('editOp10.aspx'),
      isOp20 = frameForm.action?.includes('editOp20.aspx'),
      isOp30 = frameForm.action?.includes('editOp30.aspx');

    if(isOp10) styleFixesOp10();
    else if(isOp20) styleFixesOp20();
    else if(isOp30) txtNotesFixesOp30();
  }

  dlgFrame = document.getElementById('dlgFrame');
  if(dlgFrame) {
    dlgFrame.style.height = '100%';
    dlgFrame.userSelect = 'none';
    elementFinder();
  }

  const customerSelect = document.getElementById('ctl00_ctl00_cphDlgs_cphReturnDlgs_drpCustomer');
  if(customerSelect) customerSelect.style.maxWidth = '100%';

  if(dialogDiv) {
    const bodyWidth = document.body.width,
      dialogWidth = dialogDiv.width,
      leftNum = bodyWidth - dialogWidth / 2;
    dialogDiv.style.left = leftNum +'px';

    $('.ui-draggable').draggable({ iframeFix: true, containment: "document" });
  }
}
