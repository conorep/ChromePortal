/**
 * This function finds the login name/password forms and injects the username and password found in storage,
 * then clicks the login button.
 * @param logN username
 * @param logP password
 */
function doLogin(logN, logP) {
  const iframe = document.getElementById("dlgFrame");
  if(iframe != null){
    iframe.contentWindow.document.getElementById("loginCtl_UserName").value = logN;
    iframe.contentWindow.document.getElementById("loginCtl_Password").value = logP;
    iframe.contentWindow.document.getElementById("loginCtl_LoginButton").click();
  } else if(document.getElementById("loginCtl_UserName")) {
    document.getElementById("loginCtl_UserName").value = logN;
    document.getElementById("loginCtl_Password").value = logP;
    document.getElementById("loginCtl_LoginButton").click();
  }
}