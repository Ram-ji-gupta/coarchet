async function loadGlobalSettings(){

try{

const settingsUrl = window.WC && typeof window.WC.api === "function"
  ? window.WC.api("/api/settings")
  : "/api/settings";

const response =
await fetch(
settingsUrl
);

const settings =
await response.json();

const title =
document.getElementById(
"storeTitle"
);

if(title){

title.innerHTML =
"🧶 " +
settings.store_name;

}

}
catch(error){

console.log(error);

}

}

loadGlobalSettings();
