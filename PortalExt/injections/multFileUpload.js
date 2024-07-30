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
      console.log('GETFORMUP', getFrmUp);
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

    const fUpLdr = 'fileUploader';
    const getFUpLdr = iFrame.contentWindow.document.getElementById(fUpLdr);
    const hidPathInput = 'hidPath';
    const hidPathInputEle = iFrame.contentWindow.document.getElementById(hidPathInput);
    inputMultiFunc(fUpLdr, getFUpLdr);
    inputMultiFunc(hidPathInput, hidPathInputEle);

    const fUploadBtn = 'btnUpload';
    const getFUBtn = iFrame.contentWindow.document.getElementById(fUploadBtn);
    if(getFUBtn) {
      console.log(getFUBtn);
      getFUBtn.removeAttribute('onclick');
      getFUBtn.addEventListener('click', (e) => {
        e.preventDefault();
        formFunc(iFrame);


        if(hidPathInputEle && getFUpLdr.value !== '') {
          console.log(hidPathInputEle, getFUpLdr.value);
          e.preventDefault();
          hidPathInputEle.value = getFUpLdr.value;
          for(let y = 0; y < getFUpLdr.files.length; y++) {
            console.log(getFUpLdr.files[y]);
            if(y === 0) {
              continue;
            }
            let nextInput = document.createElement('input');
            nextInput.setAttribute('hidden', 'hidden');
            nextInput.id = 'hidPath' + y;
            nextInput.setAttribute('name', 'hidPath');
            nextInput.setAttribute('value', "C:\\fakepath\\" + getFUpLdr.files[y].name);
            iFrame.contentWindow.document.getElementById('frmUpload').append(nextInput);
          }

          iFrame.contentWindow.document.forms['frmUpload'].submit();
        }
        return false;
      })
    }
  }
})();