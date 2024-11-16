/**
 * This content script looks for the 'Search' modal in Portal and fixes the infuriating 'Enter' action.
 *  It normally closes the modal without searching - now 'Enter' triggers the search form.
 *
 * This script also inserts an alert/confirmation handler to make Portal a bit less annoying.
 */
function interceptAnnoyingBlockers() {
  let s = document.createElement('script');
  s.id = 'handleAlerts';
  s.src = chrome.runtime.getURL('./injections/alertHandle.js');
  s.onload = function() { this.remove(); };
  (document.head || document.documentElement).appendChild(s);
}

(() => {
  interceptAnnoyingBlockers();

  let searchIsOpen = false;
  let searchModal = document.getElementById('divSearch');

  const muteObserverCB = (mList) => {
    for(let mute of mList) {
      let attChange = mute.oldValue;
      if(searchIsOpen && attChange.includes('display: none')) {
        searchIsOpen = false;
        document.removeEventListener('keydown', watchForSearchEnter)
      } else if(!searchIsOpen && !attChange.includes('display: none')) {
        searchIsOpen = true;
        document.addEventListener('keydown', watchForSearchEnter)
      }
    }
  }

  if(searchModal) {
    let muteObserver = new MutationObserver(muteObserverCB);
    if(window === window.top) {
      muteObserver.observe(searchModal, { attributeOldValue: true, attributeFilter: ['style'] });
    }
  }

  const watchForSearchEnter = (e) => {
    if(e?.key === 'Enter') {
      e.preventDefault();

      let btnSearch = document.getElementById('ctl00_ctl00_cphDlgs_cphReturnDlgs_btnSearch');
      if(btnSearch) {
        btnSearch.click();
      }
    }
  }
})();


