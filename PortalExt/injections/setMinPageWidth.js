/**
 * This content script sets a minimum size for certain elements to disallow layout disarray.
 */
if(window === window.top) {
  const minWidth950 = (element) => element.style.minWidth = '950px';
  const elementArr = ['body', '#appHeader'];
  elementArr.every((eleName) => {
    minWidth950(document.querySelector(eleName));
  })
}
