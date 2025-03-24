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
    
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.name} - ₹${item.price.toFixed(2)}
            <button onclick="removeFromCart(${index})">Remove</button></p>
        `;
        cartItems.appendChild(itemElement);
        subtotal += item.price;
    });

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
}; 
