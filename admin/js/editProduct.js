const params =
new URLSearchParams(
window.location.search
);

const id =
params.get("id");

if (!id) {
  alert('No product ID provided. Redirecting to products list.');
  window.location = 'products.html';
}


// LOAD PRODUCT

async function loadProduct(){

try{

const token = localStorage.getItem('adminToken');
  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

const product =
await response.json();

document.getElementById(
"name"
).value =
product.name;

document.getElementById(
"price"
).value =
product.price;

const categorySelect = document.getElementById("category");
if (categorySelect) {
  categorySelect.value = product.category;
}

document.getElementById(
"stock"
).value =
product.stock;

document.getElementById(
"description"
).value =
product.description;

}

catch(error){

console.log(error);

}

}


// UPDATE PRODUCT

async function updateProduct(){

try{

const formData =
new FormData();

formData.append(
"name",
document.getElementById("name").value
);

formData.append(
"price",
document.getElementById("price").value
);

formData.append(
"category",
document.getElementById("category").value
);

formData.append(
"stock",
document.getElementById("stock").value
);

formData.append(
"description",
document.getElementById("description").value
);

const file =
document.getElementById(
"imageFile"
).files[0];

if(file){

formData.append(
"image",
file
);

}

const token = localStorage.getItem('adminToken');
await fetch(

`http://localhost:5000/api/products/${id}`,

{

method: "PUT",
body: formData,
headers: token ? { Authorization: `Bearer ${token}` } : undefined,

}

);

alert(
"Product Updated Successfully"
);

window.location =
"products.html";

}

catch(error){

console.log(error);

}

}


loadProduct();