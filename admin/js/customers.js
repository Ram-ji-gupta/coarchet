async function loadCustomers(){

try{
const token = localStorage.getItem("adminToken");
const response =
await fetch(
"http://localhost:5000/api/customers",
{
  headers: token ? { Authorization: `Bearer ${token}` } : undefined
}
);

const customers =
await response.json();

const container =
document.getElementById(
"customerList"
);

if(!container) return;

container.innerHTML = "";

customers.forEach(customer=>{

container.innerHTML += `

<div class="customer-card">

<h3>
${customer.name}
</h3>

<p>
📞 ${customer.phone}
</p>

<p>
📍 ${customer.address}
</p>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadCustomers();