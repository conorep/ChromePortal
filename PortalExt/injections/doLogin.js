/**
 * This function finds the login name/password forms and injects the username and password found in storage,
 * then clicks the login button.
 * @param logN username
 * @param logP password
 */
function doLogin(logN, logP) {
  let iframe = document.getElementById('dlgFrame'),
    loginDoc = document;

  function insertAndSubmitLogInfo() {
    loginDoc.getElementById('loginCtl_UserName').value = logN;
    loginDoc.getElementById('loginCtl_Password').value = logP;
    loginDoc.getElementById('loginCtl_LoginButton').click();
  }

  if(iframe) {
    loginDoc = iframe.contentDocument;
    iframe = loginDoc.getElementById('dlgFrame');

    if(iframe)
      loginDoc = iframe.contentDocument;
  }
  insertAndSubmitLogInfo();
}
