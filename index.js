const form = document.getElementById("registrationForm");
      const tableBody = document.querySelector("#entriesTable tbody");

      const dobInput = document.getElementById("dob");
      const today = new Date();
      const yyyy = today.getFullYear();

      const minDate = new Date(yyyy - 55, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];
      const maxDate = new Date(yyyy - 18, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];
      dobInput.setAttribute("min", minDate);
      dobInput.setAttribute("max", maxDate);

      function getEntries() {
        const entries = localStorage.getItem("userEntries");
        return entries ? JSON.parse(entries) : [];
      }

      function showEntries() {
        const entries = getEntries();
        tableBody.innerHTML = "";
        entries.forEach((entry) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.password}</td>
          <td>${entry.dob}</td>
          <td>${entry.accepted ? "Yes" : "No"}</td>
        `;
          tableBody.appendChild(row);
        });
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const dob = document.getElementById("dob").value;
        const accepted = document.getElementById("accept").checked;

        if (!name || !email || !password || !dob || !accepted) {
          alert("Please fill in all required fields and accept the terms.");
          return;
        }

        const newEntry = { name, email, password, dob, accepted };
        const entries = getEntries();
        entries.push(newEntry);
        localStorage.setItem("userEntries", JSON.stringify(entries));
        showEntries();
        form.reset();
      });

      showEntries();
