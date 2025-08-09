document.addEventListener('DOMContentLoaded', function() {
    // Get the form and all inputs
    const form = document.querySelector('.signup-form');
    const fullname = document.getElementById('fullname');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    // Password strength meter elements
    const passwordMeter = document.createElement('div');
    passwordMeter.className = 'password-strength-meter';
    passwordMeter.innerHTML = `
        <div class="strength-meter-fill" data-strength="0"></div>
        <div class="strength-meter-text">Password Strength: <span>Weak</span></div>
    `;
    password.parentNode.insertBefore(passwordMeter, password.nextSibling);
    
    // Error message element
    const errorBox = document.createElement('div');
    errorBox.className = 'error-message';
    form.insertBefore(errorBox, form.firstChild);
    
    // Validate full name
    function validateFullName() {
        const value = fullname.value.trim();
        if (!value) {
            showError(fullname, 'Full name is required');
            return false;
        }
        if (value.length < 3) {
            showError(fullname, 'Name must be at least 3 characters');
            return false;
        }
        clearError(fullname);
        return true;
    }
    
    // Validate username
    function validateUsername() {
        const value = username.value.trim();
        if (!value) {
            showError(username, 'Username is required');
            return false;
        }
        if (value.length < 4) {
            showError(username, 'Username must be at least 4 characters');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            showError(username, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        clearError(username);
        return true;
    }
    
    // Validate email
    function validateEmail() {
        const value = email.value.trim();
        if (!value) {
            showError(email, 'Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            showError(email, 'Please enter a valid email address');
            return false;
        }
        clearError(email);
        return true;
    }
    
    // Validate password and update strength meter
    function validatePassword() {
        const value = password.value;
        if (!value) {
            showError(password, 'Password is required');
            updatePasswordStrength(0);
            return false;
        }
        if (value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            updatePasswordStrength(1);
            return false;
        }
        
        // Calculate password strength (0-4)
        let strength = 0;
        if (value.length >= 8) strength += 1;
        if (/[A-Z]/.test(value)) strength += 1;
        if (/[0-9]/.test(value)) strength += 1;
        if (/[^A-Za-z0-9]/.test(value)) strength += 1;
        
        updatePasswordStrength(strength);
        
        if (strength < 3) {
            showError(password, 'Password should include uppercase, numbers, and symbols');
            return false;
        }
        
        clearError(password);
        return true;
    }
    
    // Update password strength meter
    function updatePasswordStrength(strength) {
        const meterFill = document.querySelector('.strength-meter-fill');
        const meterText = document.querySelector('.strength-meter-text span');
        
        meterFill.setAttribute('data-strength', strength);
        
        const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
        const strengthColors = ['#d33', '#f80', '#fc0', '#9c0', '#3a3'];
        
        meterText.textContent = strengthText;
        meterFill.style.backgroundColor = strengthColors[strength];
        meterFill.style.width = `${(strength / 4) * 100}%`;
    }
    
    // Show error for a specific field
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let error = formGroup.querySelector('.error-text');
        
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-text';
            formGroup.appendChild(error);
        }
        
        error.textContent = message;
        input.style.borderColor = '#d33';
    }
    
    // Clear error for a specific field
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-text');
        
        if (error) {
            error.remove();
        }
        
        input.style.borderColor = '#5a4a3a';
    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFullNameValid = validateFullName();
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        // If all valid, submit the form (in a real app, you'd send to server)
        if (isFullNameValid && isUsernameValid && isEmailValid && isPasswordValid) {
            errorBox.textContent = '';
            errorBox.style.display = 'none';
            
            // In a real application, you would submit the form here
            alert('Form is valid! Ready for submission to server.');
            // form.submit();
        } else {
            errorBox.textContent = 'Please fix the errors in the form';
            errorBox.style.display = 'block';
        }
    });
    
    // Real-time validation as user types
    fullname.addEventListener('input', validateFullName);
    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);
});