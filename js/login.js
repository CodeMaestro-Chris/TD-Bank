document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const messageBox = document.getElementById("messageBox");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.getElementById("usernameOrEmail").value.trim();
    const password = document.getElementById("password").value.trim();

    // Disable button + show spinner
    loginBtn.disabled = true;
    loginBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Logging in...
    `;

    // Hide old messages
    messageBox.innerHTML = "";

    try {
      const response = await fetch("http://127.0.0.1:8000/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_email: usernameOrEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("username", data.data.username);

        // Success alert
        messageBox.innerHTML = `
          <div class="alert alert-success" role="alert">
            ✅ Login successful! Redirecting...
          </div>
        `;

        setTimeout(() => {
          window.location.href = "./user-dashboard.html";
        }, 1500);
      } else {
        // Error alert
        messageBox.innerHTML = `
          <div class="alert alert-danger" role="alert">
            ❌ ${data.message || "Login failed"}
          </div>
        `;
      }
    } catch (error) {
      console.error("Error:", error);
      messageBox.innerHTML = `
        <div class="alert alert-warning" role="alert">
          ⚠️ Something went wrong. Please try again later.
        </div>
      `;
    } finally {
      // Restore button
      loginBtn.disabled = false;
      loginBtn.textContent = "Log in";
    }
  });
});
