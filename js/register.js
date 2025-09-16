document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createAccountForm");
  const btn = form.querySelector("button[type='submit']");
  const messageBox = document.getElementById("messageBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      first_name: document.getElementById("first_name").value,
      middle_name: document.getElementById("middle_name").value,
      last_name: document.getElementById("last_name").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      occupation: document.getElementById("occupation").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      dob: document.getElementById("dob").value,
      marital_status: document.getElementById("marital_status").value,
      gender: document.getElementById("gender").value,
      address: document.getElementById("address").value,
      account_type: document.getElementById("account_type").value,
      account_currency: document.getElementById("account_currency").value,
      captcha: document.getElementById("captchaInput").value,
    };

    try {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Creating...`;
      messageBox.innerHTML = "";

      const res = await fetch("https://tdbank.pythonanywhere.com/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || "Failed to create account");
      }

      // ✅ Bootstrap success alert
      messageBox.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          🎉 Account created successfully! Redirecting to login...
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;

      form.reset();

      // ⏳ Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);

    } catch (err) {
      // ❌ Bootstrap error alert
      messageBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ❌ ${err.message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = "Create Account";
    }
  });
});
