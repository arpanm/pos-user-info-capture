window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    
    // Check if user exists (mock function - replace with actual API call)
    checkUserExists(phone).then(exists => {
        if (exists) {
            // Add dummy data for existing users
            sessionStorage.setItem('user_name', 'John Doe');
            sessionStorage.setItem('user_email', 'johndoe@example.com');
            sessionStorage.setItem('user_phone', phone);
            // Redirect to delivery page for existing users
            window.location.href = 'userinput.html';
        } else {
            // Redirect to registration for new users
            window.location.href = `register.html?phone=${phone}`;
        }
    });
}

function checkUserExists(phone) {
    // Mock API call - replace with actual implementation
    return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
            // For demo, consider numbers starting with '9' as existing users
            resolve(phone.startsWith('9'));
        }, 1000);
    });
}