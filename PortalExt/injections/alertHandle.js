window.originalAlert = window.alert;
window.alert = function() {
  let alertArray = [
    'Warning!  If you change any of the following info', 'To complete the', 'To generate the',
    'Maintenance without proper doc', 'Are you sure a CMM has been'
  ];

  let foundAlert = false;
  alertArray.every((alertText) => {
    if(arguments[0].startsWith(alertText)) {
      console.log('skip this alert!', arguments);
      foundAlert = true;
      return false;
    }
    return true;
  })
  if(!foundAlert) return window.originalAlert(arguments[0]);
}
window.originalConfirm = window.confirm;
window.confirm = function() {
  console.log(arguments)
  let foundConf = false;
  const confirmArr = ['There is no pre-defined', 'Has the product modification resulted'];
  confirmArr.every((conf) => {
    if(arguments[0].startsWith(conf)) {
      console.log('skip this confirmation!', arguments);
      foundConf = true;
      return false;
    }
  });

  if(!foundConf) return window.originalConfirm(arguments[0]);
}
