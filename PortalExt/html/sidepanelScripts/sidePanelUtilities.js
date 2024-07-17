const alertDivID = 'alertDivPortal';

document.addEventListener('click', (e) => {
  let currBtn = e.target.id;
  chrome.runtime.sendMessage({message: 'tryInsert', btnID: currBtn}, (response) => {
    if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return true;
    }
    console.log(response);
    if(response.insert === 'good') {
      const inMsg = 'Text insert successful!';
      if(!document.getElementById(alertDivID)) {
        insertTheAlert(inMsg)
      }
    }
  });
})

function insertTheAlert(alertMsg) {
  let createdEle = document.createElement('div');
  createdEle.classList.add('alert-floater');
  createdEle.innerHTML = `
<div class='alert alert-success d-flex align-items-center alert-dismissible fade show' role='alert' id='alertDivPortal'>
  <svg class='bi flex-shrink-0 me-2' width='24' height='24' role='img' aria-label='Success:'>
  <use xlink:href="#check-circle-fill"/></svg>
  <div id='alertMsgPortal'>${alertMsg}</div>
</div>
`;
  document.body.append(createdEle);

  let alertDivEle = document.getElementById(alertDivID);
  triggerSuccessAlert(alertDivEle);
}

function triggerSuccessAlert(alertDiv) {
  let alertInstance = bootstrap.Alert.getOrCreateInstance(alertDiv);

  setTimeout(() => {
    alertInstance.close();
  }, 2000);
}
