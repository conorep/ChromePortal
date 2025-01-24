if(window === window.top) {
  window.originalAlert = window.alert;
  window.alert = function() {
    let alertArray = ['Warning!  If you change any of the following info', 'To complete the', 'To generate the'];

    let foundAlert = false;
    alertArray.every((alertText) => {
      if(arguments[0].startsWith(alertText)) {
        console.log('skip this alert!', arguments);
        foundAlert = true;
        return false;
      }
      return true;
    })
    if(!foundAlert) {
      return window.originalAlert(arguments[0]);
    }
  }
  window.originalConfirm = window.confirm;
  window.confirm = function() {
    console.log(arguments)
    if(arguments[0].startsWith('Has the product modification resulted in a change')) {
      console.log('skip this confirmation!', arguments);
      return false;
    }
    return window.originalConfirm(arguments[0]);
  }
}
