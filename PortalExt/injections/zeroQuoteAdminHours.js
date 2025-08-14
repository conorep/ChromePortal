/**
 * This content script finds the service quote 'Administrative Processing' time inputs and changes them to 0 hours.
 */
const zeroAdminTime = () => {
  const adminTimeNonWarranty = document.getElementById('txtAdminTimeNW');
  const adminTimeWarranty = document.getElementById('txtAdminTimeW');
  if(adminTimeNonWarranty)
    adminTimeNonWarranty.value = 0;
  if(adminTimeWarranty)
    adminTimeWarranty.value = 0;
}

window === window.top && window.location.pathname.endsWith('editReturn.aspx') && zeroAdminTime();
