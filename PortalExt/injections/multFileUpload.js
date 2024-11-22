/**
 * This content script alters the file upload input element to a 'multiple' variant and overrides the single-upload
 * 'uploadFile' function found in Portal's 'FileUpload.aspx' file.
 *
 * TODO: look at this for possibly using a hidden iframe
 * https://stackoverflow.com/questions/1833451/javascript-multiple-file-upload-sequentially-one-at-a-time
 */
(() => {
  const iFrame = document.getElementById('dlgFrame');
  const formFunc = (frame) => {
    const frmUp = 'frmUpload';
    const getFrmUp = frame.contentWindow.document.getElementById(frmUp);
    if(getFrmUp) {
      getFrmUp.addEventListener('submit', (e) => {
        console.log('something submitted');
        e.stopPropagation();
        e.preventDefault();
      })
    }
  }

  const inputMultiFunc = (idName, inputEle) => {
    if(inputEle) {
      inputEle.setAttribute('multiple', '');
    }
  }

  if(iFrame != null && iFrame.src.includes('FileUpload.aspx')) {
    formFunc(iFrame);

    const fUpLdr = 'fileUploader',
      hidPathInput = 'hidPath',
      fUploadBtn = 'btnUpload';

    let getFUpLdr = iFrame.contentWindow.document.getElementById(fUpLdr),
      hidPathInputEle = iFrame.contentWindow.document.getElementById(hidPathInput),
      getFUBtn = iFrame.contentWindow.document.getElementById(fUploadBtn);

    inputMultiFunc(fUpLdr, getFUpLdr);
    inputMultiFunc(hidPathInput, hidPathInputEle);

    if(getFUBtn) {
      console.log(getFUBtn);
      getFUBtn.removeAttribute('onclick');
      getFUBtn.setAttribute('type', 'button');
      console.log(getFUBtn);
      getFUBtn.addEventListener('click', (e) => {
        e.preventDefault();
        return uploadFile(getFUpLdr, hidPathInputEle, iFrame);
      })
    }
  }
})();

function uploadFile(fileUp, hiPath, theIframe) {
  theIframe.contentWindow.document.forms['frmUpload'].onsubmit = function(e) {
    e.preventDefault();
    return false;
  }

  if(fileUp && fileUp.value && fileUp?.value !== '') {
    if(fileUp.files.length > 1) {
      console.log('HERE!', fileUp.files.length);
      for(let x = 1; x < fileUp.files.length; x++) {
        hiPath.value += " C:\\fakepath\\" + fileUp.files[x].name;
      }
    } else {
      console.log('THERE!', fileUp.files)
      hiPath.value = fileUp.value;
    }
    theIframe.contentWindow.document.forms['frmUpload'].submit();
    return false;
  }
  return false;
}