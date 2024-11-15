/**
 * This script looks at the 'tail number' span and, if there's a value, turns the span into a button that opens
 *  a Google search with the tail number.
 */
if(window === window.top) {
  const tailTag = 'ctl00_ctl00_cphSite_cphReturn_lblACSerial';
  const gSearch = 'https://www.google.com/search?q=';
  let tailEle = document.getElementById(tailTag);
  if(tailEle && tailEle.innerText !== '') {
    const tailText = tailEle.innerText;
    let tagBtn = document.createElement('button');
    tagBtn.id = tailTag;
    tagBtn.innerText = tailText
    setStyles(tagBtn)
    tagBtn.onclick = () => {
      window.open(gSearch+tailText, '_blank');
    }
    tailEle.replaceWith(tagBtn);
  }
}

function setStyles(btnElement) {
  btnElement.style.width = '100%';
  btnElement.style.border = '2px #85afbb solid';
  btnElement.style.borderRadius = '5px';
  btnElement.style.cursor = 'pointer';
  btnElement.style.fontWeight = 'bold';
  btnElement.style.backgroundColor = 'lightblue';
  btnElement.style.height = '30px';

  btnElement.onmouseover = function() {
    this.style.backgroundColor = '#c7d6db';
    this.style.border = '2px #398ca7 solid';
    this.style.textDecoration = 'underline';
  }
  btnElement.onmouseleave = function() {
    setStyles(btnElement);
  }
}