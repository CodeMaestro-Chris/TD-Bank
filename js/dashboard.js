document.addEventListener("DOMContentLoaded", async () => {
  const balanceEl = document.getElementById("balance");
  const tableBody = document.querySelector(".table tbody");

  const recentTransfersContainer = document.querySelector(".card .text-end").previousElementSibling; // container for transfers

  try {
    const res = await fetch("http://127.0.0.1:8000/user/account/statement/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("authToken")}` // ✅ assuming token saved after login
      },
    });

    const result = await res.json();

   const nameSpan = document.getElementById("name1");
  
    // Get username from localStorage
    const username = localStorage.getItem("username") || "User";
    
    // Set the span text
    nameSpan.textContent = username;

    if (!res.ok) {
      throw new Error(result.detail || "Failed to fetch account statement");
    }

    // ✅ Update balance
    const accountBalance = result.data.account_balance;
    balanceEl.textContent = `$${accountBalance.toFixed(2)}`;

    // ✅ Populate transactions table
    tableBody.innerHTML = ""; 
    result.data.transactions.forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="text-${tx.type ? "success" : "danger"} fs-6">${tx.type || "N/A"}</span></td>
        <td class="text-success">USD $${tx.amount.toFixed(2)}</td>
        <td><i class="bi bi-person"></i> ${tx.beneficiary_name || "-"}</td>
        <td>${tx.description || "-"}</td>
        <td>${tx.date}</td>
        <td class="fw-bold text-${tx.status === "completed" ? "success" : "warning"}">${tx.status}</td>
      `;
      tableBody.appendChild(row);
    });

    // ✅ Populate recent transfers (limit 5)
    const recentTx = result.data.transactions.slice(0, 1);
    recentTransfersContainer.innerHTML = ""; // clear placeholder row
    if (recentTx.length === 0) {
      recentTransfersContainer.innerHTML = `
        <div class="row my-2 py-1">
          <div class="col text-muted">No recent transfers</div>
        </div>
      `;
    } else {
      recentTx.forEach(tx => {
        const row = document.createElement("div");
        row.classList.add("row", "my-2", "py-1");
        row.innerHTML = `
          <div class="col"><span class="text-primary fs-5">◉</span> ${tx.bank_name || "-"} / ${tx.beneficiary_account || "-"}</div>
          <div class="col text-success">USD $${tx.amount.toFixed(2)}</div>
          <div class="col fw-bold text-${tx.status === "completed" ? "success" : "warning"}">${tx.status}</div>
          <div class="col">${tx.date}</div>
        `;
        recentTransfersContainer.appendChild(row);
      });
    }

  } catch (err) {
    console.error(err);
    balanceEl.textContent = "$0.00";
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">❌ ${err.message}</td>
      </tr>
    `;
    recentTransfersContainer.innerHTML = `
      <div class="row my-2 py-1">
        <div class="col text-danger">❌ Failed to load recent transfers</div>
      </div>
    `;
  }
});
