    const form = document.getElementById('registration-form');
    const tableBody = document.querySelector('#user-entries tbody');

    const today = new Date();
    const yyyy = today.getFullYear();
    const maxDob = new Date(yyyy - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const minDob = new Date(yyyy - 55, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    document.getElementById('dob').setAttribute('min', minDob);
    document.getElementById('dob').setAttribute('max', maxDob);

    function getUserEntries() {
      return JSON.parse(localStorage.getItem('user-entries') || '[]');
    }

    function displayEntries() {
      const entries = getUserEntries();
      tableBody.innerHTML = '';
      entries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.password}</td>
          <td>${entry.dob}</td>
          <td>${entry.accepted ? 'Yes' : 'No'}</td>
        `;
        tableBody.appendChild(row);
      });
    }

    displayEntries();

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const dob = document.getElementById('dob').value;
      const accepted = document.getElementById('acceptTerms').checked;

      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      if (age < 18 || age > 55) {
        alert('Age must be between 18 and 55.');
        return;
      }

      const entry = { name, email, password, dob, accepted };
      const entries = getUserEntries();
      entries.push(entry);
      localStorage.setItem('user-entries', JSON.stringify(entries));
      displayEntries();
      form.reset();
    });
