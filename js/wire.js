document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("wireTransferForm");
  const confirmBtn = document.getElementById("confirmTransactionBtn");
  const messageBox = document.createElement("div");
  form.prepend(messageBox);
  let formDataCache = null;

  // Step 1: Handle form submit → open password modal
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Cache form data (ignore main password for now)
    formDataCache = {
      beneficiary_name: document.getElementById("beneficiaryName").value.trim(),
      routing_number: document.getElementById("routingNumber").value.trim(),
      iban: document.getElementById("beneficiaryAccount").value.trim(),
      bank_name: document.getElementById("bankName").value.trim(),
      swift_code: document.getElementById("swiftCode").value.trim(),
      country: document.getElementById("country").value,
      amount: parseFloat(document.getElementById("amount").value),
      account_type: document.getElementById("accountType").value,
      description: document.getElementById("description").value.trim()
    };

    // Validate required fields
    if (!formDataCache.beneficiary_name || !formDataCache.iban || !formDataCache.amount || !formDataCache.account_type || !formDataCache.routing_number || !formDataCache.swift_code || !formDataCache.country) {
      messageBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ❌ Please fill in all required fields.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      return;
    }

    // Show password confirmation modal
    new bootstrap.Modal(document.getElementById("confirmPasswordModal")).show();
  });

  // Step 2: Confirm password → send request
  confirmBtn.addEventListener("click", async function () {
    const passwordInput = document.getElementById("transactionPassword").value.trim();

    if (!passwordInput) {
      messageBox.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          ⚠️ Please enter your password to confirm.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
      return;
    }

    const payload = { ...formDataCache, password: passwordInput };

    try {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Processing...`;

      const response = await fetch("http://127.0.0.1:8000/user/wire/transfer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("authToken")
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Close password modal
        bootstrap.Modal.getInstance(document.getElementById("confirmPasswordModal")).hide();

        // Populate success modal
        document.getElementById("s_amount").textContent = `USD $${payload.amount.toFixed(2)}`;
        document.getElementById("s_beneficiaryName").textContent = payload.beneficiary_name;
        document.getElementById("s_beneficiaryAccount").textContent = payload.iban;
        document.getElementById("s_bankName").textContent = payload.bank_name || "N/A";
        document.getElementById("s_accountType").textContent = payload.account_type;
        document.getElementById("s_description").textContent = payload.description || "N/A";

        new bootstrap.Modal(document.getElementById("successModal")).show();

        form.reset();
        document.getElementById("transactionPassword").value = "";
      } else {
        messageBox.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ❌ Transfer failed: ${data.message || "Unknown error"}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
      }
    } catch (error) {
      messageBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ⚠️ Network error, please try again.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = "Confirm";
    }
  });
});
