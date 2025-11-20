/**
 * This content script fixes the layout of the info-containing divs in the 'Info' tab of portal.
 */
(() => {
  const infoTab = 'tabs-info',
    removedStyles = ['width', 'height', 'margin-bottom'],
    newClass = ['certInfo', 'aircraftInfo', 'partDetails', 'returnInfo'],
    dynamicMargins = [1, 2, 3, 3, 1]; // 1 is left margin, 2 is right, 3 is both

  const isEditing = window.location.pathname.endsWith('editReturn.aspx'),
    infoVar = document.getElementById(infoTab);

  const removeStyleProp = (child) => {
    removedStyles.forEach((aStyle) => child.style.removeProperty(aStyle))
  }

  const addOrRemoveClass = (element, cName) => {
    if(isEditing)
      element.classList.add(cName);
    else
      element.classList.remove(cName);
  }

  const setMargins = (element, indexLoc) => {
    if(indexLoc > 4) return;

    let marginNum = isEditing ? '0' : '15px',
      indexCode = dynamicMargins[indexLoc];

    if(indexCode === 1 || 3)
      element.style.marginLeft = marginNum;

    if(indexCode === 2 || 3)
      element.style.marginRight = marginNum;
  }

  if(infoVar && window === window.top) {
    addOrRemoveClass(infoVar, 'infoGrid');

    [...infoVar.children].forEach((childDiv, i) => {
      if(i < 4) {
        addOrRemoveClass(childDiv, newClass[i]);
        removeStyleProp(childDiv);
      }
      setMargins(childDiv, i);
    })

    const bottomBar = document.getElementsByClassName('bottomBar')[1];
    if(bottomBar) {
      [...bottomBar.children].forEach((childAnchor) => {
        childAnchor.style.setProperty('width', 'auto');
      })
    }
  }
})();
