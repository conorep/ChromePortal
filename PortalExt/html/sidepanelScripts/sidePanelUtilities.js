const alertDivID = 'alertDivPortal',
  cmmStateID = 'switchBoxCMM',
  op10Btn = 'op10Btn',
  sEnterBtn = 'searchEnterBtn',
  op10Text = 'op10Insert',
  searchText = 'searchEnter'
const flaggedBtnIDs = ['', 'check-circle-fill', op10Btn, sEnterBtn]

const triggerSuccessAlert = (alertDiv) => {
  let alertInstance = bootstrap.Alert.getOrCreateInstance(alertDiv);

  setTimeout(() => {
    alertInstance.close();
  }, 2000);
}

const insertTheAlert = (alertMsg) => {
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

const checkAlert = (msg) => {
  if(!document.getElementById(alertDivID)) {
    insertTheAlert(msg)
  }
}

const checkPageEditing = () => {
  const queryP = window.location.search;
  console.log(queryP);
  if(queryP?.split?.('=')?.[1] === 'true') {
    document.getElementById('certStuff').classList.toggle('slideIntoView');
  }
}

window.onload = () => {
  chrome.storage.local.get('cmmState').then((res) => {
    document.getElementById(cmmStateID).checked = res.cmmState;
  })
  checkPageEditing();
  const textCollapseArr = [document.getElementById(op10Text), document.getElementById(searchText)];
  textCollapseArr.forEach((tEle, i) => {
    tEle.addEventListener('show.bs.collapse', () => {
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
    chrome.runtime.sendMessage({ cmmState: e.target.checked }, () => {
      checkAlert('CMM text input function change successful!');
    })
    return;
  }

  let startWithRel = currBtn.startsWith('release');
  chrome.runtime.sendMessage({ message: 'tryInsert', btnID: currBtn }, (response) => {
    if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return true;
    }
    if(response.insert === 'good') {
      checkAlert(startWithRel ? 'Certs changed!' : 'Text insert successful!');
    }
  });
})