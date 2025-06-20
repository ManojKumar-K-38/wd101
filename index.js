const signupForm = document.getElementById("signup-form");
const membersTableBody = document.querySelector("#members-table tbody");

function checkAgeRange(dobValue) {
  const dob = new Date(dobValue);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18 && age - 1 <= 55;
  }
  return age >= 18 && age <= 55;
}

function displayUsers() {
  const users = JSON.parse(localStorage.getItem("memberList") || "[]");
  membersTableBody.innerHTML = "";
  users.forEach(insertRow);
}

function insertRow(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${user.fullName}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <td>${user.dob}</td>
    <td>${user.agreed}</td>
  `;
  membersTableBody.appendChild(row);
}

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = document.getElementById("input-name").value.trim();
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const dob = document.getElementById("input-dob").value;
  const agreed = document.getElementById("input-terms").checked;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Enter a valid email address.");
    return;
  }

  if (!checkAgeRange(dob)) {
    alert("Age must be between 18 and 55.");
    return;
  }

  const user = { fullName, email, password, dob, agreed };
  const currentUsers = JSON.parse(localStorage.getItem("memberList") || "[]");
  currentUsers.push(user);
  localStorage.setItem("memberList", JSON.stringify(currentUsers));
  insertRow(user);
  signupForm.reset();
});

function getTodayDOBUsers() {
  const today = new Date().toISOString().split('T')[0];
  const users = JSON.parse(localStorage.getItem("memberList") || "[]");
  const matched = users.filter(u => u.dob === today);
  if (matched.length === 0) return "";
  return matched.map(u => u.fullName).join(", ");
}

window.getTodayDOBUsers = getTodayDOBUsers;
window.onload = displayUsers;

