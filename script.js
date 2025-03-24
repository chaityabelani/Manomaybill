// Sample menu items
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        price: 12.99,
        image: "https://placeholder.com/300x200"
    },
    {
        id: 2,
        name: "Paneer Tikka",
        price: 10.99,
        image: "https://placeholder.com/300x200"
    },
    {
        id: 3,
        name: "Biryani",
        price: 14.99,
        image: "https://placeholder.com/300x200"
    }
];

let cart = [];

// Display menu items
function displayMenu() {
    const menuContainer = document.querySelector('.menu-items');
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
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
    const totalAmount = document.getElementById('total-amount');
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromCart(${index})">Remove</button></p>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });

    totalAmount.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout function
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order!');
    cart = [];
    updateCart();
});

// Initialize the website
window.onload = () => {
    displayMenu();
}; 
