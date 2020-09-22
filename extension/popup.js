var enabled = true; //enable by default
var myButton = document.getElementById('toggle');

browser.storage.local.get('enabled', data => {
    enabled = !!data.enabled;
    myButton.textContent = enabled ? 'Disable' : 'Enable';
});

myButton.onclick = () => {
    enabled = !enabled;
    myButton.textContent = enabled ? 'Disable' : 'Enable';
    browser.storage.local.set({enabled:enabled});
};