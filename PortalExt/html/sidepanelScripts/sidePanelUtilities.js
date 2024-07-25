const alertDivID = 'alertDivPortal',
  cmmStateID = 'switchBoxCMM',
  op10Btn = 'op10Btn',
  sEnterBtn = 'searchEnterBtn',
  op10Text = 'op10Insert',
  searchText = 'searchEnter'
const flaggedBtnIDs = ['', 'check-circle-fill', op10Btn, sEnterBtn]

window.onload = () => {
  chrome.storage.local.get('cmmState').then((res) => {
    document.getElementById(cmmStateID).checked = res.cmmState;
  })

  const textCollapseArr = [document.getElementById(op10Text), document.getElementById(searchText)];
  textCollapseArr.forEach((tEle, i) => {
    tEle.addEventListener('show.bs.collapse', (e) => {
      let indexLoc = i === 1 ? 0 : 1;
      if(textCollapseArr[indexLoc].className.includes('show')) {
        let collapseEle = bootstrap.Collapse.getOrCreateInstance(textCollapseArr[indexLoc]);
        collapseEle.hide();
      }
    })
    tEle.addEventListener('shown.bs.collapse', () => {
      tEle.scrollIntoView();
    })
  })
}

document.addEventListener('click', (e) => {
  let currBtn = e.target.id;
  if(!currBtn || currBtn === '' || flaggedBtnIDs.includes(currBtn)) {
    return;
  }

  if(currBtn === cmmStateID) {
    chrome.storage.local.set({ cmmState: e.target.checked });
    chrome.runtime.sendMessage({ cmmState: e.target.checked }, (response) => {
      const inMsg = 'CMM text input function change successful!';
      if(!document.getElementById(alertDivID)) {
        insertTheAlert(inMsg)
      }
    })
    return;
  }

  chrome.runtime.sendMessage({ message: 'tryInsert', btnID: currBtn }, (response) => {
    if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return true;
    }
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
