var API = chrome || browser;

var enabled = true; //enable by default
var myButton = document.getElementById('toggle');

API.storage.local.get('enabled', data => {
    enabled = !!data.enabled;
    myButton.textContent = enabled ? 'Disable' : 'Enable';
});

myButton.onclick = () => {
    enabled = !enabled;
    myButton.textContent = enabled ? 'Disable' : 'Enable';
    API.storage.local.set({enabled:enabled});
};