CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS soaps (
    soap_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    soap_name TEXT UNIQUE NOT NULL,  
    soap_description TEXT NOT NULL,
    soap_price NUMERIC(10, 2) NOT NULL, 
    image_path TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages_status (
    status_id SERIAL PRIMARY KEY,
    status TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    status_id INTEGER NOT NULL,
    FOREIGN KEY (status_id) REFERENCES messages_status (status_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,  
    total_price DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    soap_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (soap_id) REFERENCES soaps (soap_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    soap_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT NOT NULL,
    FOREIGN KEY (soap_id) REFERENCES soaps (soap_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS ticket_status (
    status_id SERIAL PRIMARY KEY,
    status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id SERIAL PRIMARY KEY,
    status_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES ticket_status (status_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS ticket_replies (
    reply_id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


-- Insert initial categories
INSERT INTO category (category_id, category_name) VALUES
    (1, 'Body'),
    (2, 'Face'),
    (3, 'Massage Therapy')
ON CONFLICT (category_id) DO NOTHING;
;
-- Insert initial soaps
INSERT INTO soaps (soap_name, soap_description, soap_price, image_path, category_id) VALUES
    ('Lavender Bliss', 'A soothing lavender-scented soap for relaxation.', 5.99, '/images/lavender.jpg', 1),
    ('Honey Oatmeal', 'Gentle exfoliating soap with honey and oatmeal.', 6.49, '/images/honey-oatmeal.jpg', 1),
    ('Charcoal Detox', 'Activated charcoal soap to cleanse and purify skin.', 7.99, '/images/charcoal-detox.jpg', 2),
    ('Tea Tree Fresh', 'Tea tree oil-infused soap for acne-prone skin.', 6.99, '/images/tea-tree.jpg', 2),
    ('Coconut Paradise', 'Moisturizing coconut soap for smooth skin.', 5.49, '/images/coco.jpg', 1),
    ('Rose Petal Glow', 'Luxurious rose-scented soap for a radiant complexion.', 8.99, '/images/rose-petal.jpg', 2),
    ('Eucalyptus Mint', 'A refreshing soap infused with eucalyptus and mint. Designed with a unique shape to gently massage the skin while cleansing.', 7.49, '/images/eucalyptus.jpg', 3),
    ('Vanilla Shea', 'Creamy vanilla shea butter soap for deep hydration.', 6.79, '/images/vanilla.jpg', 1),
    ('Citrus Zest', 'Invigorating citrus-scented soap for an energy boost.', 5.99, '/images/citrus.jpg', 1),
    ('Chamomile Comfort', 'Calming chamomile soap for sensitive skin.', 6.59, '/images/chamomile.jpg', 2),
    ('Muscle Relief Bar', 'A firm, invigorating soap with a shape inspired by massagers, featuring raised peaks that help stimulate circulation and soothe sore muscles.', 8.29, '/images/massage.jpg', 3),
    ('Deep Tissue Therapy', 'Designed for ultimate relaxation, this soap has molded ridges that work like a mini-massager, easing tension while cleansing the skin.', 8.99, '/images/deeptissue.jpg', 3)
ON CONFLICT (soap_name) DO NOTHING;

INSERT INTO roles (role_id, role_name) VALUES
    (1, 'user'),
    (2, 'customer'),
    (3, 'admin')
ON CONFLICT (role_id) DO NOTHING;

INSERT INTO messages_status (status_id, status) VALUES
    (1, 'unread'),
    (2, 'completed')
ON CONFLICT (status_id) DO NOTHING;

INSERT INTO ticket_status (status_id, status) VALUES
    (1, 'open'),
    (2, 'closed')
ON CONFLICT (status_id) DO NOTHING;
