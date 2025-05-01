function proceedToPayment() {
    const phone = document.getElementById('phone').value;
    const products = document.getElementById('products').value;

    if (!phone || !products) {
        alert('Please fill in all fields');
        return;
    }

    // Store phone in sessionStorage
    sessionStorage.setItem('user_phone', phone);
    sessionStorage.setItem('checkout_products', products);

    // Redirect to QR code page
    window.location.href = `qr.html?phone=${phone}`;
}

function updateSummary() {
    const deliveryType = document.getElementById('deliveryType').value;
    const summaryHTML = document.getElementById('summary-html').innerHTML;

    // Store delivery type for cart page
    sessionStorage.setItem('deliveryType', deliveryType);
    
    document.getElementById('summary-details').innerHTML = summaryHTML;
}
