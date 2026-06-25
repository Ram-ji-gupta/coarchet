// LOGIN PROTECTION

if (
  window.location.pathname.includes("/admin") &&
  !window.location.pathname.includes("login")
) {
  let token = localStorage.getItem("adminToken");
  if(!token){
    window.location = "login.html";
  }
}

// LOGIN

async function login(){

const user =
document.getElementById(
"username"
)?.value;

const pass =
document.getElementById(
"password"
)?.value;


try{

const response = await fetch(
"http://localhost:5000/api/admin/login",
{
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: user, password: pass })
}
);

if(!response.ok){
  throw new Error("Login failed");
}

const data = await response.json();
localStorage.setItem("adminToken", data.token);
localStorage.setItem("adminLogged","true");
window.location = "dashboard.html";
}
catch(error){

console.log(error);

alert(
"Cannot connect to server"
);

}

}



// LOGOUT

function logout(){
  localStorage.removeItem("adminLogged");
  localStorage.removeItem("adminToken");
  window.location = "login.html";
}
