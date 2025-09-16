document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("domesticTransferForm");
  const confirmBtn = document.getElementById("confirmTransactionBtn");
  const messageBox = document.getElementById("messageBox"); // Add this div above form in HTML
  let formDataCache = null;

  // Step 1: Handle form submit → open password modal
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      formDataCache = {
        beneficiary_name: document.getElementById("beneficiaryName").value,
        beneficiary_account_number: document.getElementById("beneficiaryAccount").value,
        bank_name: document.getElementById("bankName").value,
        amount: parseFloat(document.getElementById("amount").value),
        description: document.getElementById("description").value,
        account_type: document.getElementById("accountType").value.toLowerCase()
      };

      const modal = new bootstrap.Modal(document.getElementById("confirmPasswordModal"));
      modal.show();
    });
  }

  // Step 2: Confirm button → send request
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async function () {
      const passwordInput = document.getElementById("transactionPassword");
      const password = passwordInput.value.trim();

      if (!password) {
        messageBox.innerHTML = `
          <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ⚠️ Please enter your password to confirm.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
        return;
      }

      const payload = { ...formDataCache, password };

      try {
        confirmBtn.disabled = true;
        const oldText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Processing...`;

        const response = await fetch("https://tdbank.pythonanywhere.com/user/domestic/transfer/", {
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
          document.getElementById("s_amount").innerText = `USD $${payload.amount}`;
          document.getElementById("s_beneficiaryName").innerText = payload.beneficiary_name;
          document.getElementById("s_beneficiaryAccount").innerText = payload.beneficiary_account_number;
          document.getElementById("s_bankName").innerText = payload.bank_name;
          document.getElementById("s_accountType").innerText = payload.account_type;
          document.getElementById("s_description").innerText = payload.description;

          // Show success modal
          new bootstrap.Modal(document.getElementById("successModal")).show();

          form.reset();
          passwordInput.value = "";
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
  }
});
