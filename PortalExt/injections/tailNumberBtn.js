/**
 * This script looks at the 'tail number' span and, if there's a value, turns the span into a button that opens
 *  a Google search with the tail number.
 */
if(window === window.top) {
  const tailTag = 'ctl00_ctl00_cphSite_cphReturn_lblACSerial';
  const gSearch = 'https://www.google.com/search?q=';

  const setStyles = (btnElement) => {
    const btnStyles = {
      width: '100%',
      border: '2px #85afbb solid',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      backgroundColor: 'lightblue',
      height: '30px'
    }
    Object.assign(btnElement.style, btnStyles);

    btnElement.onmouseover = () => {
      const hoverStyles = {
        backgroundColor: '#c7d6db',
        border: '2px #398ca7 solid',
        textDecoration: 'underline'
      }
      Object.assign(btnElement.style, hoverStyles);
    }
    btnElement.onmouseleave = function() {
      setStyles(btnElement);
    }
  }

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
