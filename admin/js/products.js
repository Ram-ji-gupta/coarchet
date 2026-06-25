// ==========================
// GLOBAL PRODUCTS ARRAY
// ==========================

let allProducts = [];


// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(products){

const container =
document.getElementById(
"productList"
);

if(!container) return;

container.innerHTML = "";

products.forEach(product=>{

container.innerHTML += `

<div class="product-item">

<img
src="http://localhost:5000/uploads/${product.image}">

<h3>
${product.name}
</h3>

<div class="price">
₹${product.price}
</div>

<div class="category">
${product.category}
</div>

${product.description ? `<div class="description">${product.description}</div>` : ''}

<div class="stock">
Stock : ${product.stock}
</div>

<div class="product-buttons">

<button
class="edit-btn"
onclick="editProduct(${product.id})">

Edit

</button>

<button
class="delete-btn"
onclick="deleteProduct(${product.id})">

Delete

</button>

</div>

</div>

`;

});

}


// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts(){

try{

const response =
await fetch(
"http://localhost:5000/api/products"
);

allProducts =
await response.json();

displayProducts(
allProducts
);

}

catch(error){

console.log(error);

}

}


// ==========================
// SEARCH PRODUCTS
// ==========================

function searchProducts(){

const input =
document.getElementById(
"productSearch"
);

const clearBtn = document.getElementById("clearSearchBtn");

if(!input) return;

const keyword =
input.value.toLowerCase();

// show/hide clear button
if(clearBtn){
clearBtn.style.display = keyword ? "inline-block" : "none";
}

if(!keyword){
// Empty search => show all
return displayProducts(allProducts);
}

const filtered =
allProducts.filter(product=>

(product.name || "").toLowerCase().includes(keyword)

||

(product.category || "").toLowerCase().includes(keyword)

);

displayProducts(
filtered
);

}

function clearSearch(){
const input = document.getElementById("productSearch");
if(input){
input.value = "";
}
const clearBtn = document.getElementById("clearSearchBtn");
if(clearBtn){
clearBtn.style.display = "none";
}
displayProducts(allProducts);
}


// ==========================
// SAVE PRODUCT
// ==========================

async function saveProduct(){

try{

const file =
document.getElementById(
"imageFile"
).files[0];

const formData =
new FormData();

formData.append(
"name",
document.getElementById(
"name"
).value
);

formData.append(
"price",
document.getElementById(
"price"
).value
);

formData.append(
"category",
document.getElementById(
"category"
).value
);

formData.append(
"stock",
document.getElementById(
"stock"
).value
);

formData.append(
"description",
document.getElementById(
"description"
).value
);

if(file){

formData.append(
"image",
file
);

}

const token = localStorage.getItem("adminToken");

const response = await fetch(
  "http://localhost:5000/api/products",
  {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }
);

const data = await response.json();

console.log(data);

alert(
"Product Added Successfully"
);

window.location =
"products.html";

}

catch(error){

console.log(error);

alert(
"Failed to add product"
);

}

}


// ==========================
// DELETE PRODUCT
// ==========================

async function deleteProduct(id){

if(

!confirm(
"Delete this product?"
)

){

return;

}

try{
const token = localStorage.getItem("adminToken");

const response =
await fetch(

`http://localhost:5000/api/products/${id}`,

{

method:"DELETE",
headers: token ? { Authorization: `Bearer ${token}` } : undefined,

}

);

const data =
await response.json();

console.log(data);

loadProducts();

}

catch(error){

console.log(error);

}

}


// ==========================
// EDIT PRODUCT
// ==========================

function editProduct(id){
    window.location = `edit-product?id=${id}`;
}


// ==========================
// INITIALIZE
// ==========================

loadProducts();