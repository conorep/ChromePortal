/**
 * This content script finds the service quote 'Administrative Processing' time inputs and changes them to 0 hours.
 */
function zeroAdminTime() {
  const adminTimeNonWarranty = document.getElementById('txtAdminTimeNW'),
    adminTimeWarranty = document.getElementById('txtAdminTimeW');

  if(!adminTimeNonWarranty || !adminTimeWarranty) return;

  const changeEvent = new Event('change', { bubbles: true });
  const changeValue = (el) => {
    el.value = '0.00';
    el.dispatchEvent(changeEvent);
  }

  changeValue(adminTimeNonWarranty);
  changeValue(adminTimeWarranty);
}

window === window.top && window.location.pathname.endsWith('editReturn.aspx') && zeroAdminTime();
