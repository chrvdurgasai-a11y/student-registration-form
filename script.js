document.addEventListener('DOMContentLoaded', () => {
  // Select DOM Elements
  const form = document.getElementById('registrationForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const courseInput = document.getElementById('course');
  const submitBtn = document.getElementById('submitBtn');
  
  // Success Overlay Elements
  const successOverlay = document.getElementById('successOverlay');
  const displayFullName = document.getElementById('displayFullName');
  const displayEmail = document.getElementById('displayEmail');
  const displayPhone = document.getElementById('displayPhone');
  const displayCourse = document.getElementById('displayCourse');
  const resetBtn = document.getElementById('resetBtn');

  // Regex Patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Match standard 10 digit numbers, ignoring common delimiters like spaces, dashes, or parentheses
  const phoneStripRegex = /[^\d]/g;
  const phoneValidRegex = /^\d{10}$/;

  // Validation state trackers
  const validationStatus = {
    fullName: false,
    email: false,
    phone: false,
    course: false
  };

  /**
   * Set valid state styling
   */
  function setValid(inputElement) {
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
  }

  /**
   * Set invalid state styling
   */
  function setInvalid(inputElement) {
    inputElement.classList.remove('is-valid');
    inputElement.classList.add('is-invalid');
  }

  /**
   * Reset validation states
   */
  function resetValidationState(inputElement) {
    inputElement.classList.remove('is-valid');
    inputElement.classList.remove('is-invalid');
  }

  /**
   * Full Name Validation
   */
  function validateFullName() {
    const value = fullNameInput.value.trim();
    if (value.length >= 3) {
      setValid(fullNameInput);
      validationStatus.fullName = true;
      return true;
    } else {
      setInvalid(fullNameInput);
      validationStatus.fullName = false;
      return false;
    }
  }

  /**
   * Email Validation
   */
  function validateEmail() {
    const value = emailInput.value.trim();
    if (emailRegex.test(value)) {
      setValid(emailInput);
      validationStatus.email = true;
      return true;
    } else {
      setInvalid(emailInput);
      validationStatus.email = false;
      return false;
    }
  }

  /**
   * Phone Number Validation
   * Sanitizes spaces, dashes, and parens to see if remaining digits form a 10-digit number.
   */
  function validatePhone() {
    const rawValue = phoneInput.value.trim();
    const cleanValue = rawValue.replace(phoneStripRegex, '');
    
    if (phoneValidRegex.test(cleanValue)) {
      setValid(phoneInput);
      validationStatus.phone = true;
      return true;
    } else {
      setInvalid(phoneInput);
      validationStatus.phone = false;
      return false;
    }
  }

  /**
   * Course Validation
   */
  function validateCourse() {
    const value = courseInput.value;
    if (value && value !== "") {
      setValid(courseInput);
      validationStatus.course = true;
      return true;
    } else {
      setInvalid(courseInput);
      validationStatus.course = false;
      return false;
    }
  }

  // Real-time Event Listeners for Validation on Inputs
  fullNameInput.addEventListener('input', () => {
    // If the input was already marked invalid or has met length requirement, live-validate
    if (fullNameInput.classList.contains('is-invalid') || fullNameInput.value.trim().length >= 3) {
      validateFullName();
    }
  });
  fullNameInput.addEventListener('blur', validateFullName);

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid') || emailRegex.test(emailInput.value.trim())) {
      validateEmail();
    }
  });
  emailInput.addEventListener('blur', validateEmail);

  phoneInput.addEventListener('input', () => {
    const cleanValue = phoneInput.value.replace(phoneStripRegex, '');
    if (phoneInput.classList.contains('is-invalid') || cleanValue.length === 10) {
      validatePhone();
    }
  });
  phoneInput.addEventListener('blur', validatePhone);

  courseInput.addEventListener('change', validateCourse);
  courseInput.addEventListener('blur', validateCourse);

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger validation for all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isCourseValid = validateCourse();

    const isFormValid = isFullNameValid && isEmailValid && isPhoneValid && isCourseValid;

    if (isFormValid) {
      // Premium feature: Show loading state inside button before displaying success overlay
      submitBtn.disabled = true;
      const originalBtnContent = submitBtn.innerHTML;
      
      // Inline SVGs for elegant loading spinner
      submitBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 50 50" style="animation: rotate 1s linear infinite; margin-right: 8px;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0" stroke-linecap="round" style="stroke: var(--text-inverse);"></circle>
        </svg>
        <span>Registering...</span>
      `;

      // Custom rotating style injected dynamically if not already in stylesheet
      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.innerHTML = `
          @keyframes rotate { 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
      }

      // Simulate API registration delay
      setTimeout(() => {
        // Populating final displays
        displayFullName.textContent = fullNameInput.value.trim();
        displayEmail.textContent = emailInput.value.trim();
        
        // Show structured formatted phone number (e.g. (123) 456-7890)
        const cleanPhone = phoneInput.value.replace(phoneStripRegex, '');
        const formattedPhone = `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}`;
        displayPhone.textContent = formattedPhone;
        
        displayCourse.textContent = courseInput.value;

        // Slide/fade in the success state overlay card
        successOverlay.classList.add('show');
        
        // Re-enable button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }, 1000);
    } else {
      // Find the first invalid element and focus it for accessibility and UX
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // Reset Form and return from Success State
  resetBtn.addEventListener('click', () => {
    // Hide overlay
    successOverlay.classList.remove('show');
    
    // Reset inputs
    form.reset();

    // Reset styles
    resetValidationState(fullNameInput);
    resetValidationState(emailInput);
    resetValidationState(phoneInput);
    resetValidationState(courseInput);
  });
});
