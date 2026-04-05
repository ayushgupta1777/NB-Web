/**
 * Contact Form Logic for Night Bus
 * Handles validation and EmailJS integration
 */

(function() {
    // --- CONFIGURATION ---
    // Replace these with your actual EmailJS credentials
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; 
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnIcon = document.getElementById('btn-icon');
    const formAlert = document.getElementById('form-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Reset States
        hideAlert();
        setLoading(true);

        // 2. Get Form Data
        const formData = {
            user_name: document.getElementById('user_name').value.trim(),
            user_email: document.getElementById('user_email').value.trim(),
            user_phone: document.getElementById('user_phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // 3. Validation
        const validationError = validateForm(formData);
        if (validationError) {
            showAlert(validationError, 'error');
            setLoading(false);
            return;
        }

        // 4. Send Email via EmailJS
        // Note: Make sure the template variables in EmailJS match these keys: 
        // user_name, user_email, user_phone, message
        
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
            .then(function() {
                showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                setLoading(false);
            }, function(error) {
                console.error('EmailJS Error:', error);
                showAlert('Failed to send message. Please try again later or email us directly.', 'error');
                setLoading(false);
            });
    });

    /**
     * Basic client-side validation
     */
    function validateForm(data) {
        if (!data.user_name || data.user_name.length < 2) {
            return "Please enter your full name.";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.user_email)) {
            return "Please enter a valid email address.";
        }

        // Validates 10-15 digits, optional leading +
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;
        if (!phoneRegex.test(data.user_phone)) {
            return "Please enter a valid phone number.";
        }

        if (!data.message || data.message.length < 10) {
            return "Message should be at least 10 characters long.";
        }

        return null;
    }

    /**
     * UI Helper: Set loading state
     */
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            btnSpinner.classList.remove('hidden');
            btnIcon.classList.add('hidden');
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            btnText.textContent = "Send Message";
            btnSpinner.classList.add('hidden');
            btnIcon.classList.remove('hidden');
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
    }

    /**
     * UI Helper: Show alert message
     */
    function showAlert(message, type) {
        formAlert.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20', 'bg-red-500/10', 'text-red-400', 'border-red-500/20');
        
        if (type === 'success') {
            formAlert.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border', 'border-emerald-500/20');
            alertIcon.className = 'ri-checkbox-circle-line text-lg';
        } else {
            formAlert.classList.add('bg-red-500/10', 'text-red-400', 'border', 'border-red-500/20');
            alertIcon.className = 'ri-error-warning-line text-lg';
        }
        
        alertMessage.textContent = message;
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * UI Helper: Hide alert message
     */
    function hideAlert() {
        formAlert.classList.add('hidden');
    }

})();
