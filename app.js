const TILL_NUMBER = "4136540";
let balance = 1240;

const account = JSON.parse(localStorage.getItem("semalinkAccount")) || null;
let currentAccount = account;

const screens = {
  auth: document.getElementById("authScreen"),
  activation: document.getElementById("activationScreen"),
  dashboard: document.getElementById("dashboardScreen")
};

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const statusBadge = document.getElementById("statusBadge");
const authMessage = document.getElementById("authMessage");

function saveAccount() {
  localStorage.setItem("semalinkAccount", JSON.stringify(currentAccount));
}

function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
}

function updateHeader() {
  if (!currentAccount) {
    pageTitle.textContent = "Kenyan Earner Portal";
    pageSubtitle.textContent = "Create an account or login to continue";
    statusBadge.textContent = "Not logged in";
    return;
  }

  pageTitle.textContent = `Welcome, ${currentAccount.name}`;
  statusBadge.textContent = currentAccount.activated ? "Activated" : "Activation Required";
  pageSubtitle.textContent = currentAccount.activated
    ? "Full dashboard access unlocked"
    : `Pay KES 300 through Till Number ${TILL_NUMBER}`;
}

function routeUser() {
  updateHeader();

  if (!currentAccount) {
    showScreen("auth");
  } else if (!currentAccount.activated) {
    showScreen("activation");
    document.getElementById("mpesaPhone").value = currentAccount.phone;
  } else {
    showScreen("dashboard");
    document.getElementById("withdrawPhone").value = currentAccount.phone;
  }
}

document.getElementById("showRegister").addEventListener("click", () => {
  document.getElementById("showRegister").classList.add("active");
  document.getElementById("showLogin").classList.remove("active");

  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");

  authMessage.textContent = "";
});

document.getElementById("showLogin").addEventListener("click", () => {
  document.getElementById("showLogin").classList.add("active");
  document.getElementById("showRegister").classList.remove("active");

  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");

  authMessage.textContent = "";
});

document.getElementById("registerForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const county = document.getElementById("regCounty").value;
  const password = document.getElementById("regPassword").value;

  if (!name || !phone || !password) {
    authMessage.textContent = "Please fill in all required fields.";
    return;
  }

  currentAccount = {
    name,
    phone,
    county,
    password,
    activated: false
  };

  saveAccount();
  routeUser();
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!currentAccount) {
    authMessage.textContent = "No account found. Please create an account first.";
    return;
  }

  if (phone !== currentAccount.phone || password !== currentAccount.password) {
    authMessage.textContent = "Wrong phone number or password.";
    return;
  }

  routeUser();
});

document.getElementById("activateBtn").addEventListener("click", () => {
  const phone = document.getElementById("mpesaPhone").value.trim();
  const code = document.getElementById("mpesaCode").value.trim();

  if (!phone || !code) {
    alert("Enter your M-Pesa phone number and confirmation code.");
    return;
  }

  currentAccount.activated = true;
  saveAccount();

  alert(`Activation confirmed. Till Number ${TILL_NUMBER}, Amount KES 300.`);
  routeUser();
});

document.querySelectorAll(".menu-btn[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".dash-view").forEach(view => view.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.view).classList.add("active");
  });
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();

  if (!text) return;

  const bubble = document.createElement("div");
  bubble.className = "bubble me";
  bubble.textContent = text;

  document.getElementById("messages").appendChild(bubble);
  input.value = "";
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
  const phone = document.getElementById("withdrawPhone").value.trim();
  const amount = Number(document.getElementById("withdrawAmount").value);
  const message = document.getElementById("withdrawMessage");

  if (!phone || !amount) {
    message.textContent = "Enter your M-Pesa number and withdrawal amount.";
    return;
  }

  if (amount < 100) {
    message.textContent = "Minimum withdrawal is KES 100.";
    return;
  }

  if (amount > balance) {
    message.textContent = "You cannot withdraw more than your available balance.";
    return;
  }

  balance -= amount;

  document.getElementById("balanceText").textContent = `KES ${balance.toLocaleString()}`;
  message.style.color = "#127348";
  message.textContent = `Withdrawal request of KES ${amount.toLocaleString()} sent to ${phone}.`;
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  showScreen("auth");
  pageTitle.textContent = "Kenyan Earner Portal";
  pageSubtitle.textContent = "Create an account or login to continue";
  statusBadge.textContent = "Logged out";
});

routeUser();
