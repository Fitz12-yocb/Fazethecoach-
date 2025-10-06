// Tutorial Data
const tutorials = [
    {
        id: 1,
        title: "Yoga for Beginners",
        category: "yoga",
        description: "Learn the fundamentals of yoga with this comprehensive beginner's guide.",
        price: 29.99,
        rating: 4.8,
        image: "images/yoga-beginner.jpg"
    },
    {
        id: 2,
        title: "Strength Training Fundamentals",
        category: "strength",
        description: "Build muscle and strength with proper form and technique.",
        price: 39.99,
        rating: 4.9,
        image: "images/strength-training.jpg"
    },
    {
        id: 3,
        title: "HIIT Cardio Workouts",
        category: "cardio",
        description: "High-intensity interval training for maximum fat burning.",
        price: 34.99,
        rating: 4.7,
        image: "images/hiit-cardio.jpg"
    },
    {
        id: 4,
        title: "Nutrition for Muscle Gain",
        category: "nutrition",
        description: "Learn how to fuel your body for optimal muscle growth.",
        price: 24.99,
        rating: 4.6,
        image: "images/nutrition-muscle.jpg"
    },
    {
        id: 5,
        title: "Advanced Yoga Poses",
        category: "yoga",
        description: "Take your practice to the next level with advanced asanas.",
        price: 44.99,
        rating: 4.9,
        image: "images/advanced-yoga.jpg"
    },
    {
        id: 6,
        title: "Powerlifting Program",
        category: "strength",
        description: "A complete program to increase your squat, bench, and deadlift.",
        price: 49.99,
        rating: 5.0,
        image: "images/powerlifting.jpg"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const tutorialsContainer = document.getElementById('tutorials-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const loginBtn = document.querySelector('.btn-login');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.querySelector('.close-login');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const exploreTutorialsBtn = document.getElementById('explore-tutorials');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayTutorials(tutorials);
    updateCartCount();
    
    // Filter tutorials
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tutorials
            if (filter === 'all') {
                displayTutorials(tutorials);
            } else {
                const filteredTutorials = tutorials.filter(tutorial => tutorial.category === filter);
                displayTutorials(filteredTutorials);
            }
        });
    });
    
    // Cart functionality
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', proceedToCheckout);
    
    // Login functionality
    loginBtn.addEventListener('click', openLogin);
    closeLogin.addEventListener('click', closeLoginModal);
    
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Explore tutorials button
    exploreTutorialsBtn.addEventListener('click', function() {
        document.querySelector('#tutorials').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
});

// Display tutorials
function displayTutorials(tutorialsArray) {
    tutorialsContainer.innerHTML = '';
    
    tutorialsArray.forEach(tutorial => {
        const tutorialCard = document.createElement('div');
        tutorialCard.className = 'tutorial-card';
        tutorialCard.innerHTML = `
            <div class="tutorial-image">
                <img src="${tutorial.image}" alt="${tutorial.title}">
            </div>
            <div class="tutorial-content">
                <span class="tutorial-category">${tutorial.category}</span>
                <h3>${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description}</p>
                <div class="tutorial-meta">
                    <div class="tutorial-price">$${tutorial.price.toFixed(2)}</div>
                    <div class="tutorial-rating">⭐ ${tutorial.rating}</div>
                </div>
                <button class="add-to-cart" data-id="${tutorial.id}">Add to Cart</button>
            </div>
        `;
        
        tutorialsContainer.appendChild(tutorialCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const tutorialId = parseInt(this.getAttribute('data-id'));
            addToCart(tutorialId);
        });
    });
}

// Cart functions
function addToCart(tutorialId) {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    
    if (tutorial) {
        const existingItem = cart.find(item => item.id === tutorialId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...tutorial,
                quantity: 1
            });
        }
        
        updateCartCount();
        saveCartToStorage();
        
        // Show confirmation
        showNotification(`${tutorial.title} added to cart!`);
    }
}

function removeFromCart(tutorialId) {
    cart = cart.filter(item => item.id !== tutorialId);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

function openCart() {
    updateCartDisplay();
    cartModal.style.display = 'flex';
}

function closeCartModal() {
    cartModal.style.display = 'none';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    alert('Proceeding to checkout! This would redirect to a payment processor in a real application.');
    closeCartModal();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Login functions
function openLogin() {
    loginModal.style.display = 'flex';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

// Mobile menu function
function toggleMobileMenu() {
    nav.classList.toggle('active');
    
    // Transform hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (nav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: var(--shadow);
        z-index: 1200;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
