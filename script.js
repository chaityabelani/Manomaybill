// Sample menu items
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        price: 499,
        image: "https://placeholder.com/300x200"
    },
    {
        id: 2,
        name: "Paneer Tikka",
        price: 399,
        image: "https://placeholder.com/300x200"
    },
    {
        id: 3,
        name: "Biryani",
        price: 549,
        image: "https://placeholder.com/300x200"
    }
];

let cart = [];
let currentDiscount = 0; // Percentage discount
let nextItemId = 4; // Start after the existing items
let selectedImage = null;

// Display menu items
function displayMenu() {
    const menuContainer = document.querySelector('.menu-items');
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price.toFixed(2)}</p>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(itemElement);
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        cart.push(item);
        updateCart();
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const discountAmount = document.getElementById('discount-amount');
    const totalAmount = document.getElementById('total-amount');
    
    // Clear previous cart items
    cartItems.innerHTML = '';
    
    // If cart is empty, show a message
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        subtotalAmount.textContent = '0.00';
        discountAmount.textContent = '0.00';
        totalAmount.textContent = '0.00';
        return;
    }
    
    // Create table for cart items
    const table = document.createElement('table');
    table.className = 'cart-table';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    let subtotal = 0;
    
    // Add each cart item to the table
    cart.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td class="price-column">₹${item.price.toFixed(2)}</td>
            <td class="action-column">
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        subtotal += item.price;
    });
    
    table.appendChild(tbody);
    cartItems.appendChild(table);
    
    // Calculate discount and total
    const discount = (subtotal * currentDiscount) / 100;
    const total = subtotal - discount;

    subtotalAmount.textContent = subtotal.toFixed(2);
    discountAmount.textContent = discount.toFixed(2);
    totalAmount.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Apply discount
function applyDiscount(percentage) {
    currentDiscount = percentage;
    updateCart();
    
    // Update active state of discount buttons
    document.querySelectorAll('.discount-btn').forEach(btn => {
        if (parseInt(btn.dataset.discount) === percentage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Remove discount
function removeDiscount() {
    currentDiscount = 0;
    updateCart();
    
    // Remove active state from all discount buttons
    document.querySelectorAll('.discount-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Checkout function
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order!');
    cart = [];
    removeDiscount();
    updateCart();
});

// Initialize the website
window.onload = () => {
    displayMenu();
    
    // Add event listeners for discount buttons
    document.querySelectorAll('.discount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const discountValue = parseInt(btn.dataset.discount);
            applyDiscount(discountValue);
        });
    });
    
    // Add event listener for custom discount
    document.getElementById('apply-custom-discount').addEventListener('click', () => {
        const customDiscountInput = document.getElementById('custom-discount');
        const discountValue = parseInt(customDiscountInput.value);
        
        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
            alert('Please enter a valid discount percentage between 0 and 100');
            return;
        }
        
        applyDiscount(discountValue);
        customDiscountInput.value = '';
        
        // Remove active state from preset discount buttons
        document.querySelectorAll('.discount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    });
    
    // Add event listener for remove discount button
    document.getElementById('remove-discount').addEventListener('click', removeDiscount);

    // Add Menu Modal functionality
    const addMenuBtn = document.getElementById('add-menu-btn');
    const addMenuModal = document.getElementById('add-menu-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-add-menu');
    const addMenuForm = document.getElementById('add-menu-form');
    const menuImage = document.getElementById('menu-image');
    const imagePreview = document.getElementById('image-preview');

    // Open modal
    addMenuBtn.addEventListener('click', () => {
        addMenuModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        addMenuModal.style.display = 'none';
        resetForm();
    });

    cancelBtn.addEventListener('click', () => {
        addMenuModal.style.display = 'none';
        resetForm();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === addMenuModal) {
            addMenuModal.style.display = 'none';
            resetForm();
        }
    });

    // Handle image preview
    menuImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
                imagePreview.innerHTML = '';
                selectedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    addMenuForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = document.getElementById('menu-name').value;
        const price = parseFloat(document.getElementById('menu-price').value);
        
        if (!name || isNaN(price) || price <= 0) {
            alert('Please fill all fields correctly');
            return;
        }
        
        // Use default image if none selected
        const imageUrl = selectedImage || 'https://placeholder.com/300x200';
        
        // Add new menu item
        const newItem = {
            id: nextItemId++,
            name: name,
            price: price,
            image: imageUrl
        };
        
        menuItems.push(newItem);
        
        // Refresh menu display
        const menuContainer = document.querySelector('.menu-items');
        menuContainer.innerHTML = '';
        displayMenu();
        
        // Close modal and reset form
        addMenuModal.style.display = 'none';
        resetForm();
    });
};

// Reset the add menu form
function resetForm() {
    document.getElementById('add-menu-form').reset();
    document.getElementById('image-preview').style.backgroundImage = '';
    document.getElementById('image-preview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>Preview</p>
    `;
    selectedImage = null;
} 
