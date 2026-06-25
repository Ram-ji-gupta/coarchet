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

<div class="customer-card" data-id="${customer.id}">

<h3>
${customer.name}
</h3>

<p class="phone">
📞 ${customer.phone}
</p>

<p class="email">
✉️ ${customer.email || ''}
</p>

<p class="address">
📍 ${customer.address}
</p>

<div style="display:flex;gap:8px;margin-top:12px;">
  <button class="action-globe globe-edit" title="Edit" data-action="edit">🌐</button>
  <button class="action-globe globe-delete" title="Delete" data-action="delete">🗑️</button>
</div>

</div>

`;

});

}

catch(error){

console.log(error);

}

}

loadCustomers();

// Event delegation for edit/delete
document.getElementById('customerList').addEventListener('click', async (e)=>{
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const card = btn.closest('.customer-card');
  const id = card && card.getAttribute('data-id');
  if(!id) return;

  if(btn.dataset.action === 'delete'){
    if(!confirm('Delete this customer?')) return;
    try{
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if(!res.ok) throw new Error(await res.text());
      card.remove();
      alert('Customer deleted');
    }catch(err){ console.error(err); alert('Delete failed'); }
  }

  if(btn.dataset.action === 'edit'){
    // populate modal
    const name = card.querySelector('h3').innerText.trim();
    const phone = (card.querySelector('.phone') && card.querySelector('.phone').innerText.replace('📞','').trim()) || '';
    const email = (card.querySelector('.email') && card.querySelector('.email').innerText.replace('✉️','').trim()) || '';
    const address = (card.querySelector('.address') && card.querySelector('.address').innerText.replace('📍','').trim()) || '';
    document.getElementById('editName').value = name;
    document.getElementById('editPhone').value = phone;
    document.getElementById('editEmail').value = email;
    document.getElementById('editAddress').value = address;
    document.getElementById('editModal').style.display = 'flex';

    const save = document.getElementById('saveEditBtn');
    const cancel = document.getElementById('cancelEditBtn');

    const onSave = async ()=>{
      try{
        const token = localStorage.getItem('adminToken');
        const payload = {
          name: document.getElementById('editName').value,
          phone: document.getElementById('editPhone').value,
          email: document.getElementById('editEmail').value,
          address: document.getElementById('editAddress').value
        };
        const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
          method: 'PUT',
          headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
          body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error(await res.text());
        // update UI
        card.querySelector('h3').innerText = payload.name;
        if(card.querySelector('.phone')) card.querySelector('.phone').innerText = '📞 ' + (payload.phone || '');
        if(card.querySelector('.email')) card.querySelector('.email').innerText = '✉️ ' + (payload.email || '');
        if(card.querySelector('.address')) card.querySelector('.address').innerText = '📍 ' + (payload.address || '');
        document.getElementById('editModal').style.display = 'none';
        save.removeEventListener('click', onSave);
        cancel.removeEventListener('click', onCancel);
        alert('Customer updated');
      }catch(err){ console.error(err); alert('Update failed'); }
    };

    const onCancel = ()=>{
      document.getElementById('editModal').style.display = 'none';
      save.removeEventListener('click', onSave);
      cancel.removeEventListener('click', onCancel);
    };

    save.addEventListener('click', onSave);
    cancel.addEventListener('click', onCancel);
  }

});