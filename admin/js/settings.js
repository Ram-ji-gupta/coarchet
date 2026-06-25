// LOAD SETTINGS

async function loadSettings(){

try{

const token = localStorage.getItem("adminToken");
const response = await fetch(
  "http://localhost:5000/api/settings",
  { headers: { "Authorization": `Bearer ${token}` } }
);

const data = await response.json();


document.getElementById(
"storeName"
).value =
data.store_name || "";

document.getElementById(
"storePhone"
).value =
data.phone || "";

document.getElementById(
"storeEmail"
).value =
data.email || "";

document.getElementById(
"storeAddress"
).value =
data.address || "";

document.getElementById(
"adminUsername"
).value =
data.admin_username || "";

document.getElementById(
"adminPassword"
).value =
data.admin_password || "";

}
catch(error){

console.log(error);

}

}



// SAVE STORE SETTINGS

async function saveStoreSettings(){

const settings = {

store_name:
document.getElementById(
"storeName"
).value,

phone:
document.getElementById(
"storePhone"
).value,

email:
document.getElementById(
"storeEmail"
).value,

address:
document.getElementById(
"storeAddress"
).value,

admin_username:
document.getElementById(
"adminUsername"
).value,

admin_password:
document.getElementById(
"adminPassword"
).value

};


const token = localStorage.getItem("adminToken");
await fetch(
  "http://localhost:5000/api/settings",
  {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  }
);

alert(
"Settings Updated Successfully"
);

}



// SAVE ADMIN ACCOUNT

async function saveAdminSettings(){

saveStoreSettings();

}



// DARK MODE

function toggleDarkMode(){

document.body.classList.toggle(
"dark-mode"
);


if(

document.body.classList.contains(
"dark-mode"
)

){

localStorage.setItem(
"darkMode",
"true"
);

}
else{

localStorage.setItem(
"darkMode",
"false"
);

}

}



// LOAD DARK MODE
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}
loadSettings();