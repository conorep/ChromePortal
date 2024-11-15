/**
 * Make the "Operation" modal's resizing fit the changes to the textarea element in the modal.
 */
if(window === window.top) {
  const INIT_WIDTH = 750;
  let dlgFrame = document.getElementById('dlgFrame');

  if(dlgFrame) {
    dlgFrame.style.height = '100%';
    dlgFrame.userSelect = 'none';

    let frameDoc = dlgFrame.contentWindow.document,
      frameBody = frameDoc.getElementsByTagName('BODY')?.[0],
      frameTextArea = frameDoc.getElementById('txtNotes1');

    if(frameTextArea) {
      let dialogDiv = document.getElementById('divDialog');

      let moveListener = () => {
        dialogDiv.style.height = frameBody.offsetHeight + 40 + 'px';
        let textWidth = INIT_WIDTH > frameTextArea.offsetWidth ? INIT_WIDTH : frameTextArea.offsetWidth;
        dialogDiv.style.width = textWidth + 20 + 'px';
      }

      frameTextArea.addEventListener('mousedown', () => {
        frameDoc.addEventListener('mousemove', moveListener)
        frameDoc.addEventListener('mouseup', moveListener)
      })
    }
  }
}
