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
  const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {   // <-- check it exists
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    Loader.show();
    loginBtn.disabled = true;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 500);
      } else {
        Loader.hide();
        loginBtn.disabled = false;
      }
    } catch (err) {
      alert("Something went wrong");
      Loader.hide();
      loginBtn.disabled = false;
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
