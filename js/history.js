document.addEventListener("DOMContentLoaded", async () => {
  const table = document.getElementById("transactionTable");

  try {
    const res = await fetch("http://127.0.0.1:8000/user/account/statement/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("authToken")}` // ✅ assumes login token saved
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.detail || "Failed to fetch transactions");
    }

    // ✅ Build table rows
    let rows = "";
    result.data.transactions.forEach(tx => {
      rows += `
        <tr>
          <td><span class="badge bg-dark">#TDB-${String(tx.id).padStart(4, "0")}-ID</span></td>
          <td class="text-success">USD $${tx.amount.toFixed(2)}</td>
          <td>${tx.beneficiary_name || "-"}</td>
          <td>${tx.beneficiary_account || tx.iban || "-"}</td>
          <td>${tx.type || "N/A"}</td>
          <td>${tx.description || "-"}</td>
          <td>${tx.bank_name || "-"}</td>
          <td>${tx.date}</td>
          <td class="fw-bold text-${tx.status === "completed" ? "success" : "warning"}">${tx.status}</td>
        </tr>
      `;
    });

    // ✅ Append rows inside table
    table.innerHTML += `<tbody>${rows}</tbody>`;

  } catch (err) {
    console.error(err);
    table.innerHTML += `
      <tbody>
        <tr>
          <td colspan="9" class="text-center text-danger">❌ ${err.message}</td>
        </tr>
      </tbody>
    `;
  }
});
