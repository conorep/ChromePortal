/**
 * This content script fixes the layout of the info-containing divs in the 'Info' tab of portal.
 */
(() => {
  const infoTab = 'tabs-info';
  const removedStyles = ['width', 'height'];
  const removeStyleProp = (child) => {
    removedStyles.forEach((aStyle) => {
      child.style.removeProperty(aStyle);
    })
    if(child.nodeName === 'FIELDSET') {
      child.style.setProperty('margin-top', '10px');
    }
  }

  const infoVar = document.getElementById(infoTab);
  if(infoVar && window === window.top) {
    [...infoVar.children].forEach((childDiv, i) => {
      if(i < 4) {
        removeStyleProp(childDiv);
      }
    })
    const bottomBar = document.getElementsByClassName('bottomBar')[1];
    [...bottomBar.children].forEach((childAnchor) => {
      childAnchor.style.setProperty('width', 'auto');
    })
  }
})();