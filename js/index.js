var devReady = false
function onLoad() { document.addEventListener("deviceready", onDeviceReady, false); }
function onDeviceReady() { devReady = true;  document.addEventListener("backbutton", exitTheApp, false); }
function exitTheApp(){ navigator.app.exitApp(); }