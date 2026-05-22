/**
 * This content script looks for the 'search' button and adds ALT+S key combo to click it.
 */
document.addEventListener('DOMContentLoaded', () => {
	const searchButton = document.querySelector('#menuSearch');
	if(searchButton) {
		Object.assign(searchButton, {
			accessKey: 's',
			title: 'In Chrome, ALT+S will click this button.'
		})
	}
});
