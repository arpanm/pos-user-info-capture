window.onload = function() {
    // Load user data and address from session storage
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const products = sessionStorage.getItem('checkout_products')?.split('\n') || [];

    displayCustomerInfo(userData);
    displayAddressInfo(userData);
    displayProducts(products);
    calculateCharges(products, userData.deliveryType, userData.deliveryCharge);
}

function displayCustomerInfo(userData) {
    const customerInfo = document.getElementById('customer-info');
    customerInfo.innerHTML = `
        <p><strong>Name:</strong> ${userData.name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${userData.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${userData.email || 'N/A'}</p>
    `;
}

function displayAddressInfo(userData) {
    const addressInfo = document.getElementById('address-info');
    let html = `
        <p><strong>Delivery Address:</strong> ${userData.address || 'No address selected'}</p>
        <p><strong>Delivery Date:</strong> ${userData.deliveryDate || 'Not selected'}</p>
        <p><strong>Delivery Time Slot:</strong> ${userData.deliveryTimeSlot || 'Not selected'}</p>`;
    
    if (userData.installationType === 'paid') {
        html += `
        <p><strong>Installation Date:</strong> ${userData.installationDate || 'Not selected'}</p>
        <p><strong>Installation Time Slot:</strong> ${userData.installationTimeSlot || 'Not selected'}</p>`;
    }
    
    addressInfo.innerHTML = html;
}

function calculateCharges(products, deliveryType, deliveryCharge) {
    // Calculate product total (INR 100 each for demo)
    const productTotal = products.filter(id => id.trim()).length * 100;
    
    // Parse delivery charge from userData
    const deliveryFee = parseFloat(deliveryCharge) || 0;

    // Add installation charge if installation type is paid
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const installationFee = userData.installationType === 'paid' ? 50 : 0;

    const total = productTotal + deliveryFee + installationFee;

    // Update display
    document.getElementById('products-total').textContent = `INR ${productTotal.toFixed(2)}`;
    document.getElementById('delivery-charge').textContent = `INR ${deliveryFee.toFixed(2)}`;
    document.getElementById('installation-charge').textContent = `INR ${installationFee.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `INR ${total.toFixed(2)}`;
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (products.length === 0) {
        container.innerHTML = '<p>No products in cart</p>';
        return;
    }

    const productsList = products
        .filter(id => id.trim())
        .map(id => `
            <div class="product-item">
                <span>Product ID: ${id}</span>
                <span>INR 100.00</span>
            </div>
        `)
        .join('');

    container.innerHTML = productsList;
}

function proceedToPayment() {
    window.location.href = 'index.html';
}