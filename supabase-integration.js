// Supabase Integration for College Canteen Website

// Supabase Configuration
const SUPABASE_URL = 'https://yjkwvlnhjszmzhythgcc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqa3d2bG5oanN6bXpoeXRoZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDkxNzUsImV4cCI6MjA3NzkyNTE3NX0.E0hFScQCB629zSLHVxquYVM4J8DjsuMZTZ5yUQSJWiA';

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let menuItems = [];

// Authentication Management
class AuthManager {
  constructor() {
    this.checkAuthState();
  }

  async checkAuthState() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    currentUser = user;
    this.updateUI();
  }

  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabaseClient
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName
          });

        if (profileError) console.error('Profile creation error:', profileError);
      }

      return { success: true, message: 'Account created successfully! Please check your email to verify your account.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      currentUser = data.user;
      this.updateUI();
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;

      currentUser = null;
      this.updateUI();
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  updateUI() {
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const userName = document.querySelector('.user-name');

    if (currentUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      if (userName) {
        userName.textContent = currentUser.user_metadata?.full_name || currentUser.email;
        userName.style.display = 'block';
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userName) userName.style.display = 'none';
    }
  }
}

// Menu Management
class MenuManager {
  async loadMenuItems() {
    try {
      const { data, error } = await supabaseClient
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      menuItems = data || [];
      return menuItems;
    } catch (error) {
      console.error('Error loading menu items:', error);
      // Fallback to local data if database fails
      return this.getFallbackMenuItems();
    }
  }

  getFallbackMenuItems() {
    return [
      {
        id: 1,
        name: "Paneer Butter Masala",
        description: "Rich and creamy paneer curry with butter and spices",
        price: 80,
        image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
        category: "Main Course"
      },
      {
        id: 2,
        name: "Veg Biryani",
        description: "Fragrant basmati rice with mixed vegetables and aromatic spices",
        price: 90,
        image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
        category: "Main Course"
      },
      {
        id: 3,
        name: "Masala Dosa",
        description: "Crispy dosa filled with spiced potato masala",
        price: 50,
        image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
        category: "South Indian"
      },
      {
        id: 4,
        name: "Idli Sambar",
        description: "Soft steamed rice cakes served with lentil curry",
        price: 40,
        image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
        category: "South Indian"
      },
      {
        id: 5,
        name: "Chole Bhature",
        description: "Spicy chickpea curry with fluffy fried bread",
        price: 60,
        image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
        category: "Breakfast"
      },
      {
        id: 6,
        name: "Pav Bhaji",
        description: "Spiced vegetable curry served with butter-toasted bread",
        price: 55,
        image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80",
        category: "Snacks"
      },
      {
        id: 7,
        name: "Samosa",
        description: "Crispy fried pastry filled with spiced potatoes and peas",
        price: 20,
        image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
        category: "Snacks"
      },
      {
        id: 8,
        name: "Vada Pav",
        description: "Spiced potato fritter in a bun with chutneys",
        price: 25,
        image_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80",
        category: "Snacks"
      },
      {
        id: 9,
        name: "Masala Chai",
        description: "Traditional Indian spiced tea with milk",
        price: 15,
        image_url: "https://images.unsplash.com/photo-1597318181274-17e21b4c8b88?w=500&q=80",
        category: "Beverages"
      },
      {
        id: 10,
        name: "Cold Coffee",
        description: "Chilled coffee blended with milk and ice cream",
        price: 40,
        image_url: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80",
        category: "Beverages"
      },
      {
        id: 11,
        name: "Gulab Jamun",
        description: "Soft milk balls soaked in rose-flavored sugar syrup",
        price: 30,
        image_url: "https://images.unsplash.com/photo-1585673062462-e37b18062c8d?w=500&q=80",
        category: "Desserts"
      }
    ];
  }
}

// Order Management
class OrderManager {
  async createOrder(paymentMethod, customerDetails = {}) {
    try {
      const cartManager = window.cartManager;
      if (!cartManager || cartManager.cart.length === 0) {
        throw new Error('Cart is empty');
      }

      // Generate order number
      const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

      // Create order data
      const orderData = {
        order_number: orderNumber,
        total_amount: cartManager.getTotalPrice(),
        tax_amount: cartManager.getTax(),
        payment_method: paymentMethod,
        payment_status: 'completed',
        status: 'confirmed',
        customer_name: customerDetails.name || (currentUser?.user_metadata?.full_name),
        customer_email: customerDetails.email || currentUser?.email,
        customer_phone: customerDetails.phone
      };

      if (currentUser) {
        orderData.user_id = currentUser.id;
      }

      // Create order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartManager.cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      cartManager.clearCart();

      return { success: true, orderNumber, orderId: order.id };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: error.message };
    }
  }

  async getOrderDetails(orderId) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  }
}

// Enhanced Cart Manager with Supabase integration
class CartManager {
  constructor() {
    this.cart = [];
    this.loadCart();
    this.updateCartDisplay();
  }

  async loadCart() {
    if (currentUser) {
      // Load from database for logged-in users
      try {
        const { data, error } = await supabaseClient
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              menu_items (*)
            )
          `)
          .eq('user_id', currentUser.id)
          .eq('status', 'pending')
          .single();

        if (data && !error) {
          this.cart = data.order_items.map(item => ({
            id: item.menu_item_id,
            name: item.menu_items.name,
            price: item.unit_price,
            quantity: item.quantity,
            image: item.menu_items.image_url,
            description: item.menu_items.description
          }));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      // Load from localStorage for guest users
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    this.updateCartDisplay();
  }

  async saveCart() {
    if (currentUser) {
      // Save to database for logged-in users
      try {
        // First, check if there's an existing pending order
        let { data: existingOrder, error: orderError } = await supabaseClient
          .from('orders')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('status', 'pending')
          .single();

        if (orderError && orderError.code !== 'PGRST116') {
          console.error('Error checking existing order:', orderError);
          return;
        }

        if (!existingOrder) {
          // Create new order
          const { data: newOrder, error: createError } = await supabaseClient
            .from('orders')
            .insert({
              user_id: currentUser.id,
              customer_name: currentUser.user_metadata?.full_name,
              customer_email: currentUser.email,
              status: 'pending'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating order:', createError);
            return;
          }
          existingOrder = newOrder;
        }

        // Delete existing order items
        await supabaseClient
          .from('order_items')
          .delete()
          .eq('order_id', existingOrder.id);

        // Insert new order items
        if (this.cart.length > 0) {
          const orderItems = this.cart.map(item => ({
            order_id: existingOrder.id,
            menu_item_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          }));

          const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('Error saving order items:', itemsError);
          }
        }
      } catch (error) {
        console.error('Error saving cart to database:', error);
      }
    } else {
      // Save to localStorage for guest users
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
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

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize managers
  window.authManager = new AuthManager();
  window.menuManager = new MenuManager();
  window.orderManager = new OrderManager();

  // Load menu items
  menuItems = await window.menuManager.loadMenuItems();

  // Initialize cart manager
  window.cartManager = new CartManager();
});

// Export for use in other files
window.AuthManager = AuthManager;
window.MenuManager = MenuManager;
window.OrderManager = OrderManager;
window.CartManager = CartManager;
