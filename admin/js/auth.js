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

// LOGIN PROTECTION
if (
  window.location.pathname.includes("/admin") &&
  !window.location.pathname.includes("login")
) {
  const isLoggedIn = localStorage.getItem("adminLogged");
  if (!isLoggedIn) {
    window.location = "login.html";
  }
}

// LOGIN
async function login() {
  const user = document.getElementById("username")?.value;
  const pass = document.getElementById("password")?.value;

  if (!user || !pass) {
    alert("Please enter username and password");
    return;
  }

  try {
    await initSupabase();

    const { data, error } = await supabaseClient
      .from('settings')
      .select('admin_username, admin_password')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      alert("System not configured. Please setup admin credentials.");
      return;
    }

    if (user === data.admin_username && pass === data.admin_password) {
      localStorage.setItem("adminLogged", "true");
      window.location = "dashboard.html";
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    console.log(error);
    alert("Cannot connect to server");
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("adminLogged");
  localStorage.removeItem("adminToken");
  window.location = "login.html";
}
