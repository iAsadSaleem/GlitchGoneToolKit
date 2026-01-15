document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/getprofile", {
      method: "GET",
      credentials: "include" // IMPORTANT for session
    });

    if (!res.ok) return;

    const data = await res.json();

    // Update navbar
    const nameEl = document.querySelector(".navbar-profile-name");
    if (nameEl) {
      nameEl.textContent = data.user.name;
    }

  } catch (err) {
    console.error("Failed to load profile", err);
  }
});
