    
    <script>
        const form = document.getElementById('registration-form');
        const tableBody = document.querySelector('#user-entries tbody');

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        function setDateConstraints() {
            const today = new Date();
            const dobInput = document.getElementById('dob');
            
            const maxDate = new Date();
            maxDate.setFullYear(today.getFullYear() - 18);
            
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 55);
            
            const maxDob = maxDate.toISOString().split('T')[0];
            const minDob = minDate.toISOString().split('T')[0];
            
            dobInput.setAttribute('min', minDob);
            dobInput.setAttribute('max', maxDob);
        }

        function calculateAge(birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age;
        }

        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }

        function showError(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        function getUserEntries() {
            try {
                return JSON.parse(localStorage.getItem('user-entries') || '[]');
            } catch (e) {
                console.error('Error parsing localStorage data:', e);
                return [];
            }
        }

        function saveUserEntries(entries) {
            try {
                localStorage.setItem('user-entries', JSON.stringify(entries));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                alert('Error saving data. Please try again.');
            }
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function displayEntries() {
            const entries = getUserEntries();
            tableBody.innerHTML = '';
            
            if (entries.length === 0) {
                const row = document.createElement('tr');
                row.className = 'no-entries';
                row.innerHTML = '<td colspan="5">No entries yet</td>';
                tableBody.appendChild(row);
                return;
            }
            
            entries.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(entry.name)}</td>
                    <td>${escapeHtml(entry.email)}</td>
                    <td>${escapeHtml(entry.password)}</td>
                    <td>${escapeHtml(entry.dob)}</td>
                    <td>${entry.accepted ? 'Yes' : 'No'}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        function validateForm(formData) {
            let isValid = true;
            clearErrors();

            if (!formData.name || !formData.name.trim()) {
                showError('name', 'Name is required');
                isValid = false;
            }

            if (!formData.email || !formData.email.trim()) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(formData.email.trim())) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (!formData.password || !formData.password.trim()) {
                showError('password', 'Password is required');
                isValid = false;
            }

            if (!formData.dob) {
                showError('dob', 'Date of birth is required');
                isValid = false;
            } else {
                const age = calculateAge(formData.dob);
                if (age < 18) {
                    showError('dob', 'You must be at least 18 years old');
                    isValid = false;
                } else if (age > 55) {
                    showError('dob', 'You must be 55 years old or younger');
                    isValid = false;
                }
            }

            if (!formData.accepted) {
                showError('terms', 'You must accept the terms and conditions');
                isValid = false;
            }

            return isValid;
        }

        function showSuccessMessage() {
            const existingSuccess = document.querySelector('.alert-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }

            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
            successAlert.innerHTML = `
                Registration successful! Entry added to the table below.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            form.parentNode.insertBefore(successAlert, form.nextSibling);
            
            setTimeout(() => {
                if (successAlert.parentNode) {
                    successAlert.remove();
                }
            }, 5000);
        }

        function init() {
            setDateConstraints();
            displayEntries();
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                dob: document.getElementById('dob').value,
                accepted: document.getElementById('acceptTerms').checked
            };

            if (validateForm(formData)) {
                const entries = getUserEntries();
                entries.push(formData);
                saveUserEntries(entries);
                
                displayEntries();
                
                form.reset();
                clearErrors();
                showSuccessMessage();
            }
        });

        document.addEventListener('DOMContentLoaded', init);

        window.addEventListener('load', displayEntries);
