window.originalAlert = window.alert;
window.alert = function() {
  if(arguments[0].startsWith('Warning!  If you change any of the following info')) {
    console.log('skip this alert!', arguments);
    return true;
  }
  return window.originalAlert(arguments[0]);
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