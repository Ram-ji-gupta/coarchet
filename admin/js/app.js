loadProducts();
loadOrders();
loadCustomers();
async function dashboard(){

try{

const response =
await fetch(
"http://localhost:5000/api/products"
);

const products =
await response.json();

document.getElementById(
"totalProducts"
).innerHTML =
products.length;

}

catch(error){

console.log(error);

}

}

dashboard();