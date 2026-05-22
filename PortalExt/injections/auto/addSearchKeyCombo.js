/**
 * This content script looks for the 'search' button and adds ALT+S key combo to click it.
 */
document.addEventListener('DOMContentLoaded', () => {
	const searchButton = document.querySelector('#menuSearch');
	if(searchButton) {
		searchButton.setAttribute('accesskey', 's');
	}
});
