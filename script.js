// Shared JavaScript for College Canteen Website

// Cart Management
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.updateCartDisplay();
  }

  addItem(item) {
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.saveCart();
    this.updateCartDisplay();
    this.showNotification(`${item.name} added to cart!`);
  }

  removeItem(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateCartDisplay();
    }
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTax() {
    return this.getTotalPrice() * 0.05; // 5% tax
  }

  getGrandTotal() {
    return this.getTotalPrice() + this.getTax();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateCartDisplay() {
    // Update cart count in navbar
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = this.getTotalItems();
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
      element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Form Validation
class FormValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateRequired(value) {
    return value.trim().length > 0;
  }

  static validateMinLength(value, minLength) {
    return value.length >= minLength;
  }

  static showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('error');
  }

  static clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) {
      errorElement.remove();
    }

    input.classList.remove('error');
  }

  static clearAllErrors(form) {
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
  }
}

// Modal Management
class ModalManager {
  static show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  static hide(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }

  static hideAll() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
  }
}

// Utility Functions
function formatPrice(price) {
  return `₹${price.toFixed(2)}`;
}

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

function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart manager
  window.cartManager = new CartManager();

  // Initialize animations
  animateOnScroll();

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 10));
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });

  // Modal close handlers
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      ModalManager.hideAll();
    }
  });

  // ESC key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ModalManager.hideAll();
    }
  });
});

// Menu Items Data
const menuItems = [
  // Main Course
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Rich and creamy paneer curry with butter and spices",
    price: 80,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
    category: "Main Course"
  },
  {
    id: 2,
    name: "Veg Biryani",
    description: "Fragrant basmati rice with mixed vegetables and aromatic spices",
    price: 90,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
    category: "Main Course"
  },
  {
    id: 12,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken and spices",
    price: 120,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
    category: "Main Course"
  },
  {
    id: 13,
    name: "Dal Makhani",
    description: "Creamy black lentils cooked with butter and spices",
    price: 70,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
    category: "Main Course"
  },
  {
    id: 14,
    name: "Palak Paneer",
    description: "Spinach and paneer curry with Indian spices",
    price: 75,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
    category: "Main Course"
  },
  {
    id: 15,
    name: "Rajma Chawal",
    description: "Kidney beans curry served with steamed rice",
    price: 65,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80",
    category: "Main Course"
  },

  // South Indian
  {
    id: 3,
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato masala",
    price: 50,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
    category: "South Indian"
  },
  {
    id: 4,
    name: "Idli Sambar",
    description: "Soft steamed rice cakes served with lentil curry",
    price: 40,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
    category: "South Indian"
  },
  {
    id: 16,
    name: "Uttapam",
    description: "Thick rice pancake topped with vegetables and chutneys",
    price: 45,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
    category: "South Indian"
  },
  {
    id: 17,
    name: "Vada",
    description: "Crispy lentil fritters served with chutneys",
    price: 35,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80",
    category: "South Indian"
  },
  {
    id: 18,
    name: "Pongal",
    description: "Rice and lentil dish with ghee and pepper",
    price: 50,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
    category: "South Indian"
  },

  // Breakfast
  {
    id: 5,
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fluffy fried bread",
    price: 60,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
    category: "Breakfast"
  },
  {
    id: 19,
    name: "Aloo Paratha",
    description: "Stuffed potato flatbread with yogurt and pickle",
    price: 45,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80",
    category: "Breakfast"
  },
  {
    id: 20,
    name: "Poha",
    description: "Flattened rice with vegetables and peanuts",
    price: 30,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
    category: "Breakfast"
  },
  {
    id: 21,
    name: "Upma",
    description: "Semolina cooked with vegetables and spices",
    price: 35,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
    category: "Breakfast"
  },

  // Snacks
  {
    id: 6,
    name: "Pav Bhaji",
    description: "Spiced vegetable curry served with butter-toasted bread",
    price: 55,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80",
    category: "Snacks"
  },
  {
    id: 7,
    name: "Samosa",
    description: "Crispy fried pastry filled with spiced potatoes and peas",
    price: 20,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
    category: "Snacks"
  },
  {
    id: 8,
    name: "Vada Pav",
    description: "Spiced potato fritter in a bun with chutneys",
    price: 25,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80",
    category: "Snacks"
  },
  {
    id: 22,
    name: "Pakora",
    description: "Assorted vegetable fritters with chutney",
    price: 30,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
    category: "Snacks"
  },
  {
    id: 23,
    name: "Dhokla",
    description: "Steamed fermented rice and chickpea cake",
    price: 25,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80",
    category: "Snacks"
  },
  {
    id: 24,
    name: "Kachori",
    description: "Crispy pastry filled with spiced lentils",
    price: 35,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
    category: "Snacks"
  },

  // Beverages
  {
    id: 9,
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 15,
    image: "https://images.unsplash.com/photo-1597318181274-17e21b4c8b88?w=500&q=80",
    category: "Beverages"
  },
  {
    id: 10,
    name: "Cold Coffee",
    description: "Chilled coffee blended with milk and ice cream",
    price: 40,
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80",
    category: "Beverages"
  },
  {
    id: 25,
    name: "Lassi",
    description: "Traditional yogurt drink, sweet or salty",
    price: 25,
    image: "https://images.unsplash.com/photo-1585673062462-e37b18062c8d?w=500&q=80",
    category: "Beverages"
  },
  {
    id: 26,
    name: "Fresh Juice",
    description: "Seasonal fruit juice (Orange/Mango)",
    price: 35,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
    category: "Beverages"
  },
  {
    id: 27,
    name: "Green Tea",
    description: "Healthy antioxidant-rich green tea",
    price: 20,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80",
    category: "Beverages"
  },

  // Desserts
  {
    id: 11,
    name: "Gulab Jamun",
    description: "Soft milk balls soaked in rose-flavored sugar syrup",
    price: 30,
    image: "https://images.unsplash.com/photo-1585673062462-e37b18062c8d?w=500&q=80",
    category: "Desserts"
  },
  {
    id: 28,
    name: "Ras Malai",
    description: "Soft cheese dumplings in sweetened milk",
    price: 35,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
    category: "Desserts"
  },
  {
    id: 29,
    name: "Rasgulla",
    description: "Spongy cheese balls in sugar syrup",
    price: 25,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80",
    category: "Desserts"
  },
  {
    id: 30,
    name: "Ice Cream",
    description: "Vanilla/Chocolate ice cream scoop",
    price: 40,
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80",
    category: "Desserts"
  }
];

// Categories for filtering
const categories = ["All", "Main Course", "South Indian", "Breakfast", "Snacks", "Beverages", "Desserts"];
