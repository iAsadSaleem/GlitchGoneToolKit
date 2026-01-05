// // SIGNUP
// const signupForm = document.getElementById("signupForm");

// if (signupForm) {
//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password })
//     });

//     const data = await res.json();
//     alert(data.message);

//     if (res.ok) {
//       window.location.href = "/login.html";
//     }
//   });
// }

// // LOGIN
// const loginForm = document.getElementById("loginForm");

// if (loginForm) {
//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();
//     alert(data.message);
//   });
// }


// SIGNUP
document.addEventListener("DOMContentLoaded", () => {

  // ================= SIGNUP =================
  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "/login-signup.html";
      }
    });
  }

  // ================= LOGIN =================
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = "/index.html";
      }
    });
  }

  // ================= LOGOUT =================
  document.addEventListener("click", async (e) => {
    if (!e.target.closest("#logoutBtn")) return;

    e.preventDefault();

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.href = "/login-signup.html";
    }
  });

});
