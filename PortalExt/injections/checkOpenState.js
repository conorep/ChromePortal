(() => {
  if(window !== window.top) return;

  const isOpen = window.outerWidth - window.innerWidth > 50;
  chrome.runtime.sendMessage({ panelIsOpen: isOpen });
})();
