// ==========================
// GLOBAL PRODUCTS ARRAY
// ==========================

let allProducts = [];
let supabaseClient = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { createClient } = window.supabase;
  supabaseClient = createClient(
    'https://owzsyodcmdwnfpoqkxyx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA'
  );
  return supabaseClient;
}

// ==========================
// IMAGE URL HELPER
// ==========================

function getImageUrl(image) {
  if (!image) return 'https://via.placeholder.com/150';
  if (image.startsWith('http')) return image;
  // For Supabase storage or placeholder
  return image;
}

// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts(products) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-item">
        <img src="${getImageUrl(product.image)}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price">₹${product.price}</div>
        <div class="category">${product.category || ''}</div>
        ${product.description ? `<div class="description">${product.description}</div>` : ''}
        <div class="stock">Stock : ${product.stock || 0}</div>
        <div class="product-buttons">
          <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
          <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts() {
  try {
    await initSupabase();

    const { data: products, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    allProducts = products || [];
    displayProducts(allProducts);
  } catch (error) {
    console.log(error);
  }
}

// ==========================
// SEARCH PRODUCTS
// ==========================

function searchProducts() {
  const input = document.getElementById("productSearch");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (!input) return;

  const keyword = input.value.toLowerCase();

  // show/hide clear button
  if (clearBtn) {
    clearBtn.style.display = keyword ? "inline-block" : "none";
  }

  if (!keyword) {
    return displayProducts(allProducts);
  }

  const filtered = allProducts.filter(product =>
    (product.name || "").toLowerCase().includes(keyword) ||
    (product.category || "").toLowerCase().includes(keyword)
  );

  displayProducts(filtered);
}

function clearSearch() {
  const input = document.getElementById("productSearch");
  if (input) {
    input.value = "";
  }
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) {
    clearBtn.style.display = "none";
  }
  displayProducts(allProducts);
}

// ==========================
// DELETE PRODUCT
// ==========================

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    await initSupabase();

    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    alert("Product deleted");
    loadProducts();
  } catch (error) {
    console.log(error);
    alert("Failed to delete product");
  }
}

// ==========================
// EDIT PRODUCT
// ==========================

function editProduct(id) {
  window.location = `edit-product.html?id=${id}`;
}

// ==========================
// SAVE PRODUCT (Add New)
// ==========================

async function saveProduct() {
  try {
    await initSupabase();

    const name = document.getElementById("name")?.value;
    const price = Number(document.getElementById("price")?.value);
    const category = document.getElementById("category")?.value;
    const stock = Number(document.getElementById("stock")?.value);
    const description = document.getElementById("description")?.value;

    if (!name || !price) {
      alert("Please fill in name and price");
      return;
    }

    // Handle image
    const file = document.getElementById("imageFile")?.files[0];
    let image = "";

    const insertProduct = async (imageUrl) => {
      const { error } = await supabaseClient
        .from('products')
        .insert([{
          name,
          price,
          category,
          stock,
          description,
          image: imageUrl
        }]);

      if (error) throw error;
      alert("Product Added Successfully");
      window.location = "products.html";
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await insertProduct(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      await insertProduct("");
    }
  } catch (error) {
    console.log(error);
    alert("Failed to add product");
  }
}

// ==========================
// INITIALIZE
// ==========================

loadProducts();
