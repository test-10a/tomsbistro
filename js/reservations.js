// Simple reservation form handler
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Handle form submission
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', handleReservationSubmit);
        
        // Add real-time logging for all form inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Use 'input' event for text fields and textarea, 'change' for select and date
            const eventType = input.tagName === 'SELECT' || input.type === 'date' ? 'change' : 'input';
            input.addEventListener(eventType, debounce(logFormData, 500));
        });
    }
});

async function handleReservationSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const reservation = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        notes: formData.get('notes')
    };
    
    // Log to console (local logging)
    console.log('New Reservation Submitted:', reservation);
    console.log('Name:', reservation.name);
    console.log('Phone:', reservation.phone);
    console.log('Email:', reservation.email);
    console.log('Date:', reservation.date);
    console.log('Time:', reservation.time);
    console.log('Number of Guests:', reservation.guests);
    console.log('Special Notes:', reservation.notes || 'None');
    
    // Send to Vercel serverless function
    try {
        console.log('Sending reservation data to Vercel...');
        
        const response = await fetch('/api/reservations/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('Vercel response:', result);
            console.log('✅ Reservation successfully logged to Vercel!');
        } else {
            console.error('❌ Vercel logging failed:', result);
        }
        
    } catch (error) {
        console.error('❌ Error sending to Vercel:', error);
        // Continue with local flow even if Vercel fails
    }
    
    // Show success message
    showSuccessMessage(reservation);
    
    // Reset form
    event.target.reset();
    
    // Set minimum date again after reset
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

function showSuccessMessage(reservation) {
    const messageDiv = document.getElementById('successMessage');
    if (!messageDiv) return;
    
    const date = new Date(reservation.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    messageDiv.innerHTML = `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 1rem; border-radius: 5px; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 0.5rem;">Reservation Confirmed!</h3>
            <p>Thank you, ${reservation.name}. Your reservation for ${reservation.guests} guests on ${formattedDate} at ${reservation.time} has been confirmed.</p>
            <p style="margin-bottom: 0;">We'll send a confirmation email to ${reservation.email}.</p>
        </div>
    `;
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to log form data in real-time as user types
function logFormData() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    // Collect current form data
    const formData = new FormData(form);
    const currentData = {
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        date: formData.get('date') || '',
        time: formData.get('time') || '',
        guests: formData.get('guests') || '',
        notes: formData.get('notes') || ''
    };
    
    // Log to console with timestamp
    console.log('📝 Form Data Update:', new Date().toLocaleTimeString());
    console.log('Current form values:', currentData);
    
    // Log individual fields that have values
    Object.entries(currentData).forEach(([field, value]) => {
        if (value) {
            console.log(`  ${field}: ${value}`);
        }
    });
    
    // Send to server for real-time logging
    try {
        fetch('/api/reservations/log-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...currentData,
                timestamp: new Date().toISOString(),
                eventType: 'form_progress'
            })
        });
    } catch (error) {
        console.error('Error logging form progress:', error);
    }
}