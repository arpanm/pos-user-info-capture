let map;
let marker;
let selectedLat;
let selectedLng;

window.onload = function() {
    // Initialize map with default coordinates
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get phone from session storage if available
    const phone = sessionStorage.getItem('user_phone');
    if (phone) {
        document.getElementById('phone').value = phone;
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            selectedLat = position.coords.latitude;
            selectedLng = position.coords.longitude;
            
            if (marker) {
                marker.remove();
            }
            
            marker = L.marker([selectedLat, selectedLng]).addTo(map);
            map.setView([selectedLat, selectedLng], 15);
            
            // Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLat}&lon=${selectedLng}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('address-display').textContent = data.display_name;
                    document.getElementById('coordinates-display').textContent = `${selectedLat}, ${selectedLng}`;
                });
        });
    }
}

function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address-display').textContent;
    const coordinates = document.getElementById('coordinates-display').textContent;
    const addressLabel = document.getElementById('address-label').value;

    if (!name || !email || address === 'None' || !addressLabel) {
        alert('Please fill in all fields and select an address');
        return;
    }

    // Store user data in session storage
    const userData = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        coordinates: coordinates,
        addressLabel: addressLabel,
        lat: selectedLat,
        lng: selectedLng
    };
    
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    sessionStorage.setItem('user_registered', 'true');
    
    // Redirect to userinput page
    window.location.href = 'userinput.html';
}