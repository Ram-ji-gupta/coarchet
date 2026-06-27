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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert('No product ID provided. Redirecting to products list.');
  window.location = 'products.html';
}

// LOAD PRODUCT
async function loadProduct() {
  try {
    await initSupabase();

    const { data: product, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!product) {
      alert('Product not found');
      window.location = 'products.html';
      return;
    }

    document.getElementById("name").value = product.name || '';
    document.getElementById("price").value = product.price || '';
    document.getElementById("stock").value = product.stock || 0;
    document.getElementById("description").value = product.description || '';

    const categorySelect = document.getElementById("category");
    if (categorySelect && product.category) {
      categorySelect.value = product.category;
    }

    // Show current image if exists
    const imagePreview = document.getElementById("imagePreview");
    if (imagePreview && product.image) {
      const imgSrc = product.image.startsWith('http') ? product.image : product.image;
      imagePreview.innerHTML = `<img src="${imgSrc}" alt="Current image" style="max-width:200px;margin-top:10px;">`;
    }
  } catch (error) {
    console.log(error);
  }
}

// UPDATE PRODUCT
async function updateProduct() {
  try {
    await initSupabase();

    const updates = {
      name: document.getElementById("name").value,
      price: Number(document.getElementById("price").value),
      category: document.getElementById("category").value,
      stock: Number(document.getElementById("stock").value),
      description: document.getElementById("description").value
    };

    // Handle image upload separately if needed
    const file = document.getElementById("imageFile").files[0];
    if (file) {
      // For now, store as data URL or skip image update
      // In production, you'd upload to Supabase storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        updates.image = e.target.result;
        await saveProduct(updates);
      };
      reader.readAsDataURL(file);
    } else {
      await saveProduct(updates);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to update product");
  }
}

async function saveProduct(updates) {
  const { error } = await supabaseClient
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.log(error);
    alert("Failed to update product");
    return;
  }

  alert("Product Updated Successfully");
  window.location = "products.html";
}

loadProduct();
