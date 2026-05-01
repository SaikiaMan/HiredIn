// Landing page functionality

function stickyNav() {
  const topNav = document.querySelector('.top-nav'),
        topNavOffsetTop = topNav.offsetTop,
        topNavOffsetHeight = topNav.offsetHeight,
        offsetPoint = document.querySelector('.top-hero').offsetHeight;
  
  window.addEventListener('scroll', function () {
    let windowOffset = this.pageYOffset;
    
    if (windowOffset >= offsetPoint) {
      topNav.classList.add('sticky');
    } else {
      topNav.classList.remove('sticky');
    }
  });
}

function setCopyrightYear($selector) {
  var d = new Date();
  $selector.text(d.getFullYear());
}

// Smooth scrolling
$('.js-scroll').on('click', function(event) {
  event.preventDefault();
  var target = $(this).data('scrollTo');
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 400);
});

// Initialize
setCopyrightYear($('#copyright-year'));
stickyNav();

// ============================================
// NAVIGATION STATE MANAGEMENT
// ============================================

// Check login state on page load
function checkLoginState() {
  const userName = localStorage.getItem('userName');
  const authButtons = document.getElementById('authButtons');
  const signupButton = document.getElementById('signupButton');
  const profileButton = document.getElementById('profileButton');
  const logoutButton = document.getElementById('logoutButton');
  
  if (userName) {
    // User is logged in
    authButtons.style.display = 'none';
    signupButton.style.display = 'none';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';
  } else {
    // User is not logged in
    authButtons.style.display = 'inline-block';
    signupButton.style.display = 'inline-block';
    profileButton.style.display = 'none';
    logoutButton.style.display = 'none';
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkLoginState);

// Handle logout from landing page
document.getElementById('logoutLink').addEventListener('click', function(e) {
  e.preventDefault();
  
  // Clear localStorage
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  
  // Call backend logout endpoint
  fetch('http://localhost:5000/logout', {
    method: 'GET',
    credentials: 'include'
  }).then(() => {
    // Update navigation state
    checkLoginState();
    
    // Show success message
    const messageEl = document.getElementById('signinMessage') || document.getElementById('signupMessage');
    if (messageEl) {
      messageEl.classList.remove('error');
      messageEl.classList.add('success');
      messageEl.textContent = 'Logged out successfully!';
      messageEl.style.display = 'block';
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }).catch(error => console.error('Logout error:', error));
});

// ============================================
// AUTHENTICATION CODE
// ============================================

// Sign In Form Submission
document.getElementById('signin_form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('signin_username').value;
  const password = document.getElementById('signin_password').value;
  const messageEl = document.getElementById('signinMessage');
  
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const userData = await response.json();
      
      // Store user data in localStorage
      localStorage.setItem('userName', userData.fullname || userData.username);
      localStorage.setItem('userEmail', userData.email);
      
      messageEl.classList.add('success');
      messageEl.classList.remove('error');
      messageEl.textContent = 'Login successful! Redirecting...';
      messageEl.style.display = 'block';
      document.getElementById('signin_form').reset();
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1500);
    } else {
      const data = await response.json();
      messageEl.classList.add('error');
      messageEl.classList.remove('success');
      messageEl.textContent = data.error || 'Login failed. Check your credentials.';
      messageEl.style.display = 'block';
    }
  } catch (error) {
    messageEl.classList.add('error');
    messageEl.classList.remove('success');
    messageEl.textContent = 'Error: Unable to connect to server. Make sure backend is running on port 5000.';
    messageEl.style.display = 'block';
    console.error('Error:', error);
  }
});

// Sign Up Form Submission
document.getElementById('signup_form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullname = document.getElementById('fullname').value;
  const username = document.getElementById('signup_username').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;
  const messageEl = document.getElementById('signupMessage');
  
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ fullname, username, email, password })
    });
    
    if (response.ok || response.status === 201) {
      const userData = await response.json();
      
      // Store user data in localStorage
      localStorage.setItem('userName', userData.fullname || userData.username);
      localStorage.setItem('userEmail', userData.email);
      
      messageEl.classList.add('success');
      messageEl.classList.remove('error');
      messageEl.textContent = 'Signup successful! Logging you in...';
      messageEl.style.display = 'block';
      document.getElementById('signup_form').reset();
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1500);
    } else {
      const data = await response.json();
      messageEl.classList.add('error');
      messageEl.classList.remove('success');
      messageEl.textContent = data.error || 'Signup failed. Please try again.';
      messageEl.style.display = 'block';
    }
  } catch (error) {
    messageEl.classList.add('error');
    messageEl.classList.remove('success');
    messageEl.textContent = 'Error: Unable to connect to server. Make sure backend is running on port 5000.';
    messageEl.style.display = 'block';
    console.error('Error:', error);
  }
});
