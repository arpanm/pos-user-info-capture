let map;
let marker;
let selectedLat;
let selectedLng;

// Initialize the map when the page loads
window.onload = function() {
    // Initialize map with default coordinates
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = today;

    // Add event listeners
    document.getElementById('deliveryType').addEventListener('change', updateTotal);
    document.getElementById('deliveryDate').addEventListener('change', updateSummary);
    document.getElementById('timeSlot').addEventListener('change', updateSummary);

    // Set minimum date for installation
    document.getElementById('installationDate').min = today;

    // Add event listeners
    document.getElementById('installationType').addEventListener('change', handleInstallationChange);
    document.getElementById('installationDate').addEventListener('change', updateSummary);
    document.getElementById('installationTimeSlot').addEventListener('change', updateSummary);
}

function handleInstallationChange() {
    const installationType = document.getElementById('installationType').value;
    const installationSchedule = document.getElementById('installation-schedule');
    
    if (installationType === 'paid') {
        installationSchedule.style.display = 'block';
    } else {
        installationSchedule.style.display = 'none';
    }
    updateTotal();
}

function updateTotal() {
    const deliveryType = document.getElementById('deliveryType').value;
    const installationType = document.getElementById('installationType').value;
    let deliveryAmount = 0;
    let installationAmount = 0;

    // Add delivery charges
    if (deliveryType === 'express') {
        deliveryAmount = 20;
    }

    // Add installation charges
    if (installationType === 'paid') {
        installationAmount = 50;
    }

    const totalAmount = deliveryAmount + installationAmount;

    // Update all amount displays
    document.getElementById('delivery-amount').textContent = deliveryAmount;
    document.getElementById('installation-amount').textContent = installationAmount;
    document.getElementById('total-amount').textContent = totalAmount;
    
    updateSummary();
}

function updateSummary() {
    const address = document.getElementById('address-display').textContent;
    const coordinates = document.getElementById('coordinates-display').textContent;
    const deliveryType = document.getElementById('deliveryType').value;
    const date = document.getElementById('deliveryDate').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const installationType = document.getElementById('installationType').value;
    const installationDate = document.getElementById('installationDate').value;
    const installationTimeSlot = document.getElementById('installationTimeSlot').value;
    const totalAmount = document.getElementById('total-amount').textContent;
    const deliveryAmount = document.getElementById('delivery-amount').textContent;
    const installationAmount = document.getElementById('installation-amount').textContent;

    let summaryHTML = `
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Coordinates:</strong> ${coordinates}</p>
        <p><strong>Delivery Type:</strong> ${deliveryType.charAt(0).toUpperCase() + deliveryType.slice(1)}</p>
        <p><strong>Delivery Date:</strong> ${date || 'Not selected'}</p>
        <p><strong>Delivery Time Slot:</strong> ${timeSlot || 'Not selected'}</p>
        <p><strong>Installation Type:</strong> ${installationType.charAt(0).toUpperCase() + installationType.slice(1)}</p>`;

    if (installationType === 'paid') {
        summaryHTML += `
        <p><strong>Installation Date:</strong> ${installationDate || 'Not selected'}</p>
        <p><strong>Installation Time Slot:</strong> ${installationTimeSlot || 'Not selected'}</p>`;
    }

    document.getElementById('summary-details').innerHTML = summaryHTML;
}

function confirmBooking() {
    const address = document.getElementById('address-display').textContent;
    const date = document.getElementById('deliveryDate').value;
    const timeSlot = document.getElementById('timeSlot').value;

    if (address === 'None' || !date || !timeSlot) {
        alert('Please select address, date, and time slot before confirming');
        return;
    }

    // Here you would typically send the booking data to a server
    const bookingData = {
        address: address,
        coordinates: {
            lat: selectedLat,
            lng: selectedLng
        },
        deliveryType: document.getElementById('deliveryType').value,
        deliveryDate: date,
        deliveryTimeSlot: timeSlot,
        installationType: document.getElementById('installationType').value,
        installationDate: document.getElementById('installationType').value === 'paid' ? document.getElementById('installationDate').value : null,
        installationTimeSlot: document.getElementById('installationType').value === 'paid' ? document.getElementById('installationTimeSlot').value : null,
        deliveryAmount: document.getElementById('delivery-amount').textContent,
        installationAmount: document.getElementById('installation-amount').textContent,
        totalAmount: document.getElementById('total-amount').textContent
    };

    console.log('Booking confirmed:', bookingData);
    
    const newAddressForm = document.getElementById('new-address-form');
    if (newAddressForm.style.display !== 'none') {
        const label = document.getElementById('address-label').value;
        if (label) {
            // Create new address card
            const addressCard = document.createElement('div');
            addressCard.className = 'address-card';
            addressCard.setAttribute('data-lat', selectedLat);
            addressCard.setAttribute('data-lng', selectedLng);
            addressCard.innerHTML = `
                <h4>${label}</h4>
                <p>${document.getElementById('address-display').textContent}</p>
            `;
            addressCard.onclick = function() { selectSavedAddress(this); };
            
            // Add to address list
            document.getElementById('address-list').appendChild(addressCard);
            
            // Hide new address form
            newAddressForm.style.display = 'none';
        }
    }
    // Store the selected data
    const userData = {
        name: sessionStorage.getItem('user_name'),
        email: sessionStorage.getItem('user_email'),
        phone: sessionStorage.getItem('user_phone'),
        address: address,
        deliveryDate: date,
        deliveryTimeSlot: timeSlot,
        deliveryType: document.getElementById('deliveryType').value,
        installationType: document.getElementById('installationType').value,
        installationDate: document.getElementById('installationType').value === 'paid' ? document.getElementById('installationDate').value : null,
        installationTimeSlot: document.getElementById('installationType').value === 'paid' ? document.getElementById('installationTimeSlot').value : null,
        deliveryCharge: document.getElementById('delivery-amount').textContent,
        installationCharge: document.getElementById('installation-amount').textContent,
        totalCharge: document.getElementById('total-amount').textContent
    };
    sessionStorage.setItem('user_data', JSON.stringify(userData));

    // Redirect to cart page
    window.location.href = 'cart.html';
}

function selectSavedAddress(element) {
    // Get coordinates from data attributes
    selectedLat = element.getAttribute('data-lat');
    selectedLng = element.getAttribute('data-lng');
    
    // Update map marker
    if (marker) {
        marker.remove();
    }
    
    // Create new marker and center map
    marker = L.marker([selectedLat, selectedLng]).addTo(map);
    map.setView([selectedLat, selectedLng], 15);
    
    // Update display
    document.getElementById('address-display').textContent = element.querySelector('p').textContent;
    document.getElementById('coordinates-display').textContent = `${selectedLat}, ${selectedLng}`;
    
    // Remove selected class from all cards and add to clicked one
    document.querySelectorAll('.address-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    // Update summary
    updateSummary();
}

function showNewAddressForm() {
    const form = document.getElementById('new-address-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}