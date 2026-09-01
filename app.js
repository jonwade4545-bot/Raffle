
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ldvnshfoqjdwglbhvyxe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_v6B6zl8DJsl4SHmtkCOHQw_Raql4sTT";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const views = {
  home: document.getElementById("homeView"),
  create: document.getElementById("createView"),
  auth: document.getElementById("authView"),
};

const authButton = document.getElementById("authButton");
const grid = document.getElementById("promotionsGrid");
const emptyState = document.getElementById("emptyState");
const authMessage = document.getElementById("authMessage");
const createMessage = document.getElementById("createMessage");

let authMode = "login";
let currentUser = null;

function showView(name) {
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function refreshSession() {
  const { data } = await supabase.auth.getUser();
  currentUser = data?.user ?? null;
  authButton.textContent = currentUser ? "Log out" : "Log in";
}

function formatMoney(cents) {
  const n = Number(cents || 0) / 100;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

async function loadPromotions() {
  grid.innerHTML = "<div class='muted'>Loading…</div>";
  emptyState.classList.add("hidden");

  const { data, error } = await supabase
    .from("promotions")
    .select("id,title,subtitle,image_url,item_value_cents,max_participants,status,created_at")
    .in("status", ["published", "active"])
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    grid.innerHTML = `<div class="message">Could not load promotions: ${escapeHtml(error.message)}</div>`;
    return;
  }

  grid.innerHTML = "";
  if (!data?.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  for (const p of data) {
    const card = document.createElement("article");
    card.className = "promo-card";
    const image = p.image_url
      ? `<img class="promo-image" src="${escapeAttr(p.image_url)}" alt="">`
      : `<div class="promo-image"></div>`;
    card.innerHTML = `
      ${image}
      <div class="promo-body">
        <div class="promo-title">${escapeHtml(p.title || "Untitled")}</div>
        <div class="promo-sub">${escapeHtml(p.subtitle || "")}</div>
        <div class="promo-meta">
          <span>${formatMoney(p.item_value_cents)} value</span>
          <span>Up to ${p.max_participants || 100} entries</span>
        </div>
      </div>`;
    grid.appendChild(card);
  }
}

function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
function escapeAttr(value="") { return escapeHtml(value); }

document.querySelectorAll("[data-home]").forEach(b => b.addEventListener("click", () => showView("home")));
document.getElementById("refreshButton").addEventListener("click", loadPromotions);

document.getElementById("heroCreateButton").addEventListener("click", async () => {
  await refreshSession();
  showView(currentUser ? "create" : "auth");
});

document.getElementById("navCreate").addEventListener("click", async () => {
  await refreshSession();
  showView(currentUser ? "create" : "auth");
});

document.getElementById("navAccount").addEventListener("click", async () => {
  await refreshSession();
  if (currentUser) {
    alert(`Signed in as ${currentUser.email}`);
  } else {
    showView("auth");
  }
});

authButton.addEventListener("click", async () => {
  await refreshSession();
  if (currentUser) {
    await supabase.auth.signOut();
    await refreshSession();
    showView("home");
  } else {
    showView("auth");
  }
});

document.getElementById("toggleAuth").addEventListener("click", () => {
  authMode = authMode === "login" ? "signup" : "login";
  document.getElementById("authTitle").textContent = authMode === "login" ? "Log in" : "Create account";
  document.getElementById("authSubmit").textContent = authMode === "login" ? "Log in" : "Sign up";
  document.getElementById("toggleAuth").textContent =
    authMode === "login" ? "Need an account? Sign up" : "Already have an account? Log in";
  authMessage.textContent = "";
});

document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "Working…";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const result = authMode === "login"
    ? await supabase.auth.signInWithPassword({ email, password })
    : await supabase.auth.signUp({ email, password });

  if (result.error) {
    authMessage.textContent = result.error.message;
    return;
  }

  if (authMode === "signup" && !result.data.session) {
    authMessage.textContent = "Account created. Check your email to confirm it, then log in.";
    return;
  }

  await refreshSession();
  authMessage.textContent = "Success.";
  showView("home");
});

document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  createMessage.textContent = "Saving…";
  await refreshSession();

  if (!currentUser) {
    createMessage.textContent = "Please log in first.";
    showView("auth");
    return;
  }

  const dollars = Number(document.getElementById("itemValue").value);
  const payload = {
    host_id: currentUser.id,
    title: document.getElementById("title").value.trim(),
    subtitle: document.getElementById("subtitle").value.trim() || null,
    description: document.getElementById("description").value.trim() || null,
    item_value_cents: Math.round(dollars * 100),
    image_url: document.getElementById("imageUrl").value.trim() || null,
    max_participants: 100,
    status: "draft",
    no_purchase_necessary: true
  };

  const { error } = await supabase.from("promotions").insert(payload);

  if (error) {
    createMessage.textContent = error.message;
    return;
  }

  createMessage.textContent = "Draft saved.";
  e.target.reset();
});

supabase.auth.onAuthStateChange(async () => {
  await refreshSession();
});

await refreshSession();
await loadPromotions();
