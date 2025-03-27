document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            // Show the selected tab content
            document.getElementById(`${btn.dataset.tab}-tab`).classList.remove('hidden');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Redirect to main page on successful login
            window.location.href = '/';
            
        } catch (error) {
            loginError.textContent = error.message;
        }
    });
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Switch to login tab and show success message
            document.querySelector('[data-tab="login"]').click();
            loginError.textContent = 'Registration successful! Please login.';
            loginError.style.color = '#4CAF50';
            
        } catch (error) {
            registerError.textContent = error.message;
        }
    });
    
    // Check if user is already logged in
    const checkAuth = async () => {
        try {
            const response = await fetch('/api/check-auth');
            const data = await response.json();
            
            if (data.authenticated) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };
    
    checkAuth();

    // Add this after the existing event listeners in login.js
    const registerUsername = document.getElementById('register-username');
    const usernameMessage = document.createElement('div');
    usernameMessage.className = 'username-message';
    registerUsername.parentNode.appendChild(usernameMessage);

    // Add debounce function to prevent too many requests
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Check username availability with debounce
    registerUsername.addEventListener('input', debounce(async (e) => {
        const username = e.target.value.trim();
        usernameMessage.textContent = '';
        usernameMessage.className = 'username-message';
        
        if (username.length < 3) return;
        
        try {
            const response = await fetch(`/api/check-username/${username}`);
            const data = await response.json();
            
            usernameMessage.textContent = data.message;
            usernameMessage.className = `username-message ${data.available ? 'available' : 'taken'}`;
        } catch (error) {
            console.error('Username check failed:', error);
        }
    }, 500));
}); 