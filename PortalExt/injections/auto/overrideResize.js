var resTimer;

function runResizer() {
  clearTimeout(resTimer);
  const isEditing = window.location.pathname.endsWith('editReturn.aspx');

  resTimer = setTimeout(() => {
    window.dispatchEvent(new Event('resize', { bubbles: true }));

    let calcDivs = document.querySelectorAll('div[id^="tabs-"]'),
      divSizeC = document.querySelector('#divSizeContent');

    if(calcDivs && calcDivs.length > 0 && calcDivs[0].style) {
      let currDivHeight;
      if(!isEditing) {
        currDivHeight = calcDivs[0].style.height;
        currDivHeight = currDivHeight.split('px')[0];
        currDivHeight = (Number(currDivHeight) - 65) + 'px';
      } else if(divSizeC) {
        let pgContent = document.querySelector('.pageContent');
        let overallCurrDivHeight = divSizeC.style.height;
        overallCurrDivHeight = overallCurrDivHeight.split('px')[0];
        overallCurrDivHeight = Number(overallCurrDivHeight);
        currDivHeight = (overallCurrDivHeight - 300) + 'px';
        pgContent.style.height = currDivHeight + 'px';
      }
      calcDivs.forEach((el) => el.style.height = currDivHeight);
    }

    if(divSizeC) {
      let currWidth = divSizeC.style.width;
      if(currWidth) {
        currWidth = currWidth.split('px')[0];
        currWidth = (Number(currWidth) + 25) + 'px';
        divSizeC.style.width = currWidth;
      }
    }
  }, 100);
}
window.onresize = (e) => {
  if(e.isTrusted) runResizer();
}

runResizer();
