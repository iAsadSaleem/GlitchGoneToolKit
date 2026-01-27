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
       Loader.show();
      signupBtn.disabled = true;
      try{

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
      

      const data = await res.json();
      alert(data.message);

       if (res.ok) {
            setTimeout(() => {
              window.location.href = "/login-signup.html";
            }, 500); // smooth transition
          } else {
            Loader.hide();
            signupBtn.disabled = false;
          }
      } catch (err) {
        alert("Something went wrong");
        Loader.hide();
        signupBtn.disabled = false;
      }
    });
  }

  // ================= LOGIN =================
//   const loginBtn = document.getElementById("loginBtn");
// if (loginBtn) {   // <-- check it exists
//   loginBtn.addEventListener("click", async () => {
//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;

//     Loader.show();
//     loginBtn.disabled = true;

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       });

//       if (res.ok) {
//         setTimeout(() => {
//           window.location.href = "/index.html";
//         }, 500);
//       } else {
//         Loader.hide();
//         loginBtn.disabled = false;
//       }
//     } catch (err) {
//       alert("Something went wrong");
//       Loader.hide();
//       loginBtn.disabled = false;
//     }
//   });
// }
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    // Reset errors
    emailError.innerText = "";
    passwordError.innerText = "";
    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Empty validation
    if (!email || !password) {
      if (!email) {
        emailError.innerText = "Please enter email";
        emailInput.classList.add("input-error");
      }
      if (!password) {
        passwordError.innerText = "Please enter password";
        passwordInput.classList.add("input-error");
      }
      return;
    }

    Loader.show();
    loginBtn.disabled = true;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        Loader.hide();
        loginBtn.disabled = false;

        if (data.field === "email") {
          emailError.innerText = data.message;
          emailInput.classList.add("input-error");
        }

        if (data.field === "password") {
          passwordError.innerText = data.message;
          passwordInput.classList.add("input-error");
        }

        if (data.field === "both") {
          emailError.innerText = data.message;
          passwordError.innerText = data.message;
          emailInput.classList.add("input-error");
          passwordInput.classList.add("input-error");
        }
        return;
      }

      window.location.href = "/index.html";

    } catch (err) {
      Loader.hide();
      loginBtn.disabled = false;
      alert("Something went wrong");
    }
  });
}
  // ================= LOGOUT =================
 // ================= LOGOUT =================
document.addEventListener("click", async (e) => {
  const logoutBtn = e.target.closest("#logoutBtn");
  if (!logoutBtn) return; // exit if no logout button clicked

  e.preventDefault();
  
  // Show loader instead of alert
  Loader.show();

  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    // Wait a short moment for smooth UX
    setTimeout(() => {
      if (res.ok) {
        // Redirect to login page after logout
        window.location.href = "/login-signup.html";
      } else {
        // Hide loader if something goes wrong
        Loader.hide();
      }
    }, 500);

  } catch (err) {
    // Hide loader if error occurs
    Loader.hide();
    console.error("Logout failed", err);
  }
});
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/getprofile", {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) return;

    const data = await res.json();
    const userName = data.user.name;

    // Delay to ensure navbar is loaded
    setTimeout(() => {
      const navbarNameEl = document.querySelector(".navbar-profile-name");
      if (navbarNameEl) navbarNameEl.textContent = userName;

      const profileNameEl = document.querySelector(".profile-name h5");
      if (profileNameEl) profileNameEl.textContent = userName;
    }, 100); // 100ms delay

  } catch (err) {
    console.error("Failed to load profile", err);
  }
});

