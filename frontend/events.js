// Events Page Functionality

// Global variables
let allEvents = [];
let currentEventId = null;
const API_BASE = 'http://localhost:5000';

// Check login state on page load
function checkLoginState() {
  const userName = localStorage.getItem('userName');
  const authButtons = document.getElementById('authButtons');
  const signupButton = document.getElementById('signupButton');
  const profileButton = document.getElementById('profileButton');
  const logoutButton = document.getElementById('logoutButton');
  
  if (userName) {
    authButtons.style.display = 'none';
    signupButton.style.display = 'none';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';
  } else {
    authButtons.style.display = 'inline-block';
    signupButton.style.display = 'inline-block';
    profileButton.style.display = 'none';
    logoutButton.style.display = 'none';
  }
}

// Set copyright year
function setCopyrightYear() {
  const year = new Date().getFullYear();
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = year;
  }
}

// Fetch all events from backend
async function fetchEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    
    allEvents = await response.json();
    displayEvents(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    displayEmptyState('Unable to load events. Please try again later.');
  }
}

// Display events in grid
function displayEvents(events) {
  const grid = document.getElementById('eventsGrid');
  
  if (events.length === 0) {
    displayEmptyState('No events found matching your filters.');
    return;
  }
  
  grid.innerHTML = events.map(event => `
    <div class="event-card" onclick="openEventDetail('${event._id}')">
      <img src="${event.image}" alt="${event.name}" class="event-card-image" onerror="this.src='https://via.placeholder.com/300x200?text=Event'">
      <div class="event-card-content">
        <span class="event-card-category">${event.category}</span>
        <h5 class="event-card-title">${event.name}</h5>
        <div class="event-card-meta">
          <span>
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
          </span>
          <span>
            <i class="fas fa-calendar"></i>
            ${formatDate(event.date)}
          </span>
          <span>
            <i class="fas fa-users"></i>
            ${event.volunteersApplied}/${event.volunteersRequired} Volunteers
          </span>
        </div>
        <div class="event-card-footer">
          <span class="event-card-pay">$${event.payRate}/hr</span>
          <button class="event-card-btn" onclick="openEventDetail('${event._id}'); return false;">View</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Display empty state
function displayEmptyState(message) {
  const grid = document.getElementById('eventsGrid');
  grid.innerHTML = `
    <div style="grid-column: 1 / -1;" class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>No Events</h3>
      <p>${message}</p>
    </div>
  `;
}

// Format date
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time
function formatTime(dateString) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('en-US', options);
}

// Open event detail modal
function openEventDetail(eventId) {
  const event = allEvents.find(e => e._id === eventId);
  if (!event) return;
  
  currentEventId = eventId;
  
  document.getElementById('eventTitle').textContent = event.name;
  document.getElementById('eventImage').src = event.image;
  document.getElementById('eventImage').onerror = function() {
    this.src = 'https://via.placeholder.com/300x200?text=Event';
  };
  document.getElementById('eventLocation').textContent = event.location;
  document.getElementById('eventDate').textContent = `${formatDate(event.date)} at ${formatTime(event.date)}`;
  document.getElementById('eventPayRate').textContent = event.payRate;
  document.getElementById('eventVolunteersNeeded').textContent = event.volunteersRequired;
  document.getElementById('eventVolunteersApplied').textContent = event.volunteersApplied;
  document.getElementById('eventDescription').textContent = event.description;
  
  // Update apply button state
  const applyBtn = document.getElementById('applyBtn');
  if (event.volunteersApplied >= event.volunteersRequired) {
    applyBtn.disabled = true;
    applyBtn.textContent = 'Event Full';
  } else {
    applyBtn.disabled = false;
    applyBtn.textContent = 'Apply to Volunteer';
  }
  
  $('#eventDetailModal').modal('show');
}

// Apply to volunteer
document.addEventListener('DOMContentLoaded', function() {
  const applyBtn = document.getElementById('applyBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', async function() {
      const userName = localStorage.getItem('userName');
      
      if (!userName) {
        alert('Please sign in to apply for events');
        window.location.href = 'index.html';
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/events/${currentEventId}/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          alert('Successfully applied! Good luck!');
          
          // Refresh events to show updated volunteer count
          await fetchEvents();
          
          // Close modal
          $('#eventDetailModal').modal('hide');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error || 'Could not apply'}`);
        }
      } catch (error) {
        console.error('Error applying to event:', error);
        alert('Unable to apply. Please try again.');
      }
    });
  }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterEvents);
  }
  
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterEvents);
  }
  
  const dateFilter = document.getElementById('dateFilter');
  if (dateFilter) {
    dateFilter.addEventListener('change', filterEvents);
  }
});

// Filter events
function filterEvents() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const date = document.getElementById('dateFilter').value;
  
  let filtered = allEvents;
  
  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(event => 
      event.name.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  if (category) {
    filtered = filtered.filter(event => event.category === category);
  }
  
  // Filter by date
  if (date) {
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === date;
    });
  }
  
  displayEvents(filtered);
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      fetch(`${API_BASE}/logout`, {
        method: 'GET',
        credentials: 'include'
      }).then(() => {
        checkLoginState();
        alert('Logged out successfully!');
        window.location.href = 'index.html';
      }).catch(error => console.error('Logout error:', error));
    });
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  checkLoginState();
  setCopyrightYear();
  fetchEvents();
  
  // Setup back button to go to home
  document.querySelectorAll('a[href="index.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      // Allow normal navigation
    });
  });
});
