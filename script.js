// Initialize data from local storage or use defaults
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [
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

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentDiscount = parseInt(localStorage.getItem('currentDiscount')) || 0;
let nextItemId = parseInt(localStorage.getItem('nextItemId')) || 4;
let selectedImage = null;

// Function to save data to local storage
function saveToLocalStorage() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('currentDiscount', currentDiscount);
    localStorage.setItem('nextItemId', nextItemId);
}

// Display menu items
function displayMenu() {
    const menuContainer = document.querySelector('.menu-items');
    menuContainer.innerHTML = ''; // Clear existing items
    
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <div class="menu-item-actions">
                <button class="edit-item-btn" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-item-btn" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
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
        saveToLocalStorage();
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
    saveToLocalStorage();
}

// Apply discount
function applyDiscount(percentage) {
    currentDiscount = percentage;
    updateCart();
    saveToLocalStorage();
    
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
    saveToLocalStorage();
    
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
    saveToLocalStorage();
});

// Clear cart function
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        saveToLocalStorage();
    }
}

// Initialize the website
window.onload = () => {
    displayMenu();
    updateCart();
    
    // Set active discount button if there's a saved discount
    if (currentDiscount > 0) {
        document.querySelectorAll('.discount-btn').forEach(btn => {
            if (parseInt(btn.dataset.discount) === currentDiscount) {
                btn.classList.add('active');
            }
        });
    }
    
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
        
        // Check if we're editing or adding
        const editItemId = addMenuForm.dataset.editItemId;
        
        if (editItemId) {
            // Update existing item
            const itemIndex = menuItems.findIndex(item => item.id === parseInt(editItemId));
            if (itemIndex !== -1) {
                menuItems[itemIndex].name = name;
                menuItems[itemIndex].price = price;
                menuItems[itemIndex].image = imageUrl;
            }
            // Clear the edit item ID
            delete addMenuForm.dataset.editItemId;
        } else {
            // Add new menu item
            const newItem = {
                id: nextItemId++,
                name: name,
                price: price,
                image: imageUrl
            };
            menuItems.push(newItem);
        }
        
        // Save changes to local storage
        saveToLocalStorage();
        
        // Refresh menu display
        displayMenu();
        
        // Close modal and reset form
        document.getElementById('add-menu-modal').style.display = 'none';
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
    
    // Reset form title and button
    const modalTitle = document.querySelector('.modal-content h2');
    const submitBtn = document.querySelector('.submit-btn');
    
    modalTitle.textContent = 'Add New Menu Item';
    submitBtn.textContent = 'Add Item';
    
    // Clear any stored edit item ID
    const addMenuForm = document.getElementById('add-menu-form');
    delete addMenuForm.dataset.editItemId;
}

// Edit menu item
function editMenuItem(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Populate the edit form
    document.getElementById('menu-name').value = item.name;
    document.getElementById('menu-price').value = item.price;
    
    // Show image preview if available
    const imagePreview = document.getElementById('image-preview');
    if (item.image && item.image !== 'https://placeholder.com/300x200') {
        imagePreview.style.backgroundImage = `url(${item.image})`;
        imagePreview.innerHTML = '';
        selectedImage = item.image;
    }
    
    // Change form submission to update instead of add
    const addMenuForm = document.getElementById('add-menu-form');
    const modalTitle = document.querySelector('.modal-content h2');
    const submitBtn = document.querySelector('.submit-btn');
    
    modalTitle.textContent = 'Edit Menu Item';
    submitBtn.textContent = 'Update Item';
    
    // Store the item ID being edited
    addMenuForm.dataset.editItemId = itemId;
    
    // Show the modal
    document.getElementById('add-menu-modal').style.display = 'block';
}

// Delete menu item
function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        const index = menuItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            menuItems.splice(index, 1);
            displayMenu();
            saveToLocalStorage();
        }
    }
} 
