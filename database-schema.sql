-- College Canteen Database Schema for Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    payment_method TEXT CHECK (payment_method IN ('card', 'upi', 'wallet', 'cod')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);

-- Insert sample menu data
INSERT INTO menu_items (name, description, price, category, image_url, is_available) VALUES
-- Breakfast Items
('Masala Dosa', 'Crispy dosa filled with potato masala', 45.00, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true),
('Idli Sambar', 'Steamed rice cakes with sambar and chutney', 30.00, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true),
('Poha', 'Flattened rice with vegetables and spices', 25.00, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true),
('Upma', 'Semolina cooked with vegetables', 28.00, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', true),

-- Main Course
('Chicken Biryani', 'Aromatic basmati rice with tender chicken', 120.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400', true),
('Paneer Butter Masala', 'Creamy tomato curry with paneer cubes', 95.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400', true),
('Dal Tadka', 'Yellow lentils tempered with spices', 60.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400', true),
('Chole Bhature', 'Spicy chickpea curry with fried bread', 70.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400', true),
('Rajma Chawal', 'Kidney beans curry with rice', 65.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400', true),

-- Snacks
('Samosa', 'Crispy pastry filled with spiced potatoes', 15.00, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true),
('Pakora', 'Assorted vegetable fritters', 20.00, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true),
('Bhelpuri', 'Puffed rice with vegetables and tangy sauce', 35.00, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true),
('Vada Pav', 'Spicy potato fritter in bread', 25.00, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true),

-- Beverages
('Tea', 'Hot Indian tea', 10.00, 'Beverages', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', true),
('Coffee', 'Fresh brewed coffee', 15.00, 'Beverages', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', true),
('Lassi', 'Sweet yogurt drink', 25.00, 'Beverages', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', true),
('Juice', 'Fresh fruit juice (seasonal)', 30.00, 'Beverages', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', true),

-- Desserts
('Ras Malai', 'Soft cheese dumplings in sweetened milk', 40.00, 'Desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', true),
('Gulab Jamun', 'Sweet milk dumplings in rose syrup', 35.00, 'Desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', true),
('Ice Cream', 'Vanilla ice cream scoop', 20.00, 'Desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', true);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Everyone can read menu items
CREATE POLICY "Everyone can view menu items" ON menu_items
    FOR SELECT USING (true);

-- Only admins can modify menu items
CREATE POLICY "Admins can manage menu items" ON menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own orders (limited)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Users can create order items
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    -- Generate a unique order number: ORD + timestamp + random digits
    order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total(order_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(total_price), 0) INTO total
    FROM order_items
    WHERE order_id = order_uuid;

    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Create function to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the order total
    UPDATE orders
    SET total_amount = calculate_order_total(NEW.order_id),
        tax_amount = calculate_order_total(NEW.order_id) * 0.05,
        updated_at = NOW()
    WHERE id = NEW.order_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update order totals
CREATE TRIGGER update_order_total_on_item_change
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();
