window.onload = function() {
    const phone = sessionStorage.getItem('user_phone');
    const products = sessionStorage.getItem('checkout_products');
    
    // Generate unique payment ID
    const paymentId = Date.now().toString();
    
    // Create payment verification URL
    const verificationUrl = `verify.html?pid=${paymentId}&phone=${phone}`;
    
    // Generate QR code
    new QRCode(document.getElementById("qrcode"), verificationUrl);
    
    // Set payment link href
    document.getElementById('paymentLink').href = verificationUrl;
}

function skipPayment() {
    const phone = sessionStorage.getItem('user_phone');
    const today = new Date().toISOString().split('T')[0];
    const userData = {
        name: "Test User",
        email: "user@email.com",
        phone: sessionStorage.getItem('user_phone'),
        address: "123 Test St, Test, 1234567",
        deliveryDate: today,
        deliveryTimeSlot: "morning",
        deliveryType: "standard",
        installationType: "none",
        installationDate: null,
        installationTimeSlot: null,
        deliveryCharge: 0,
        installationCharge: 0,
        totalCharge: 100
    };
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    window.location.href = `cart.html?phone=${phone}&skip=true`;
}