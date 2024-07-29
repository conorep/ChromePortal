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
  }

  let infoVar = document.getElementById(infoTab);
  if(infoVar && window === window.top) {
    const infoChildren = [...infoVar.children];
    infoChildren.forEach((childDiv, i) => {
      if(i < 4) {
        removeStyleProp(childDiv);
      }
    })
  }
})();