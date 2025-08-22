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

    Object.assign(divGlass.style, {
      top: '0',
      height: 'calc(100% - 20px)'
    })
  }

  const moveListener = () => {
    if(!dialogDiv) return;

    let textWidth = INIT_WIDTH > frameTextArea.offsetWidth ? INIT_WIDTH : frameTextArea.offsetWidth;
    Object.assign(dialogDiv.style, {
      height: frameBody.scrollHeight + 40 + 'px',
      width: textWidth + 20 + 'px'
    })
  }

  const elementFinder = () => {
    frameDoc = dlgFrame.contentDocument;
    if(!frameDoc) return;

    frameBody = frameDoc.getElementsByTagName('BODY')?.[0];
    fixGlass();
    fixTitle();
    const frameForm = frameDoc.getElementById('form1');
    const isOp20 = frameForm && frameForm.action?.includes('editOp20.aspx');
    if(!isOp20) return;

    frameTextArea = frameDoc.getElementById('txtNotes1');
    if(frameTextArea) {
      Object.assign(frameTextArea.style, {
        display: 'block',
        minWidth: '750px',
        minHeight: '60px',
        maxHeight: '400px',
        maxWidth: '99%',
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
          Object.assign(gridEl.style, {
            overflow: 'auto',
            scrollbarGutter: 'stable'
          })
        })
      }

      const allInputs = frameForm.querySelectorAll('input');
      allInputs.forEach((input) => {
        if(input.type === 'text') {
          Object.assign(input.style, {
            border: '2px solid cornflowerblue',
            borderRadius: '5px'
          })
        }
      });

      const partListAnchor = frameDoc.getElementById('butPdfPartList');
      if(partListAnchor) {
        partListAnchor.style.marginTop = '0';
        const pdfImg = partListAnchor.querySelector('img');
        const printSpan = partListAnchor.querySelector('span');
        pdfImg.style.paddingTop = '5px';
        printSpan.style.paddingTop = '5px';
      }

      dialogDiv = document.getElementById('divDialog');
      moveListener();

      frameTextArea.addEventListener('mousedown', (e) => {
        frameDoc.addEventListener('mousemove', moveListener)
        frameDoc.addEventListener('mouseup', () => {
          frameDoc.removeEventListener('mouseup', moveListener)
        })
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
