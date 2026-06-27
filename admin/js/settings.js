var supabaseClient = null;

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

// LOAD SETTINGS
async function loadSettings() {
  try {
    await initSupabase();

    const { data, error } = await supabaseClient
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return;

    const storeNameEl = document.getElementById("storeName");
    const storePhoneEl = document.getElementById("storePhone");
    const storeEmailEl = document.getElementById("storeEmail");
    const storeAddressEl = document.getElementById("storeAddress");
    const adminUsernameEl = document.getElementById("adminUsername");

    if (storeNameEl) storeNameEl.value = data.store_name || "";
    if (storePhoneEl) storePhoneEl.value = data.phone || "";
    if (storeEmailEl) storeEmailEl.value = data.email || "";
    if (storeAddressEl) storeAddressEl.value = data.address || "";
    if (adminUsernameEl) adminUsernameEl.value = data.admin_username || "";
  } catch (error) {
    console.log(error);
  }
}

// SAVE STORE SETTINGS
async function saveStoreSettings() {
  try {
    await initSupabase();

    const settings = {
      store_name: document.getElementById("storeName")?.value || "",
      phone: document.getElementById("storePhone")?.value || "",
      email: document.getElementById("storeEmail")?.value || "",
      address: document.getElementById("storeAddress")?.value || "",
      admin_username: document.getElementById("adminUsername")?.value || ""
    };

    // Get existing settings
    const { data: existing } = await supabaseClient
      .from('settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let error;
    if (existing?.id) {
      // Update existing
      const result = await supabaseClient
        .from('settings')
        .update(settings)
        .eq('id', existing.id);
      error = result.error;
    } else {
      // Insert new
      const result = await supabaseClient
        .from('settings')
        .insert([settings]);
      error = result.error;
    }

    if (error) throw error;
    alert("Settings Updated Successfully");
  } catch (error) {
    console.log(error);
    alert("Failed to update settings");
  }
}

// SAVE ADMIN ACCOUNT
async function saveAdminSettings() {
  await saveStoreSettings();
}

// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
}

// LOAD DARK MODE
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

loadSettings();
