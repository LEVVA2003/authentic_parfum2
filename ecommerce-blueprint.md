# Full-Stack Ecommerce Blueprint for M&M PARFUM

## 1. Project goal

Transform the current static perfume storefront into a real ecommerce platform while preserving the existing visual design and HTML/CSS structure.

The project will evolve from static HTML pages into a full-stack system with:
- a Node.js + Express backend
- a PostgreSQL database
- user authentication
- cart persistence
- order management
- an admin dashboard

---

## 2. Recommended folder structure

```text
my-website/
├── index.html
├── catalogue.html
├── produit1.html
├── produit2.html
├── ...
├── contact.html
├── recherche.html
├── pr1.html
├── pr2.html
├── ...
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── CartItem.js
│   │   │   ├── Order.js
│   │   │   └── OrderItem.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── validation.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── uploads/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── admin/
│   ├── index.html
│   ├── products.html
│   ├── orders.html
│   └── users.html
├── docs/
│   └── ecommerce-blueprint.md
└── README.md
```

### Notes on structure
- Keep the current root HTML files for now as the public-facing storefront pages.
- Introduce a dedicated backend folder for API logic.
- Use a separate admin folder for the management interface.
- Store database scripts in the database folder.

---

## 3. Backend architecture using Node.js + Express

### Core stack
- Runtime: Node.js
- Framework: Express
- Database client: pg
- Authentication: JWT + bcrypt
- File uploads: multer
- Environment config: dotenv
- Validation: Joi or express-validator

### Backend responsibilities
The backend will handle:
- product listing and detail retrieval
- category browsing
- user registration and login
- cart operations
- order creation and tracking
- admin management of products and orders

### Suggested application layout
- app.js: configure Express, middleware, routes, and error handling
- server.js: start the server and connect to PostgreSQL
- controllers: receive HTTP requests and call services
- services: contain business logic
- models: define data access patterns
- routes: define API endpoints
- middleware: auth, admin access, error handling

### Security considerations
- Store secrets in environment variables
- Hash passwords before saving
- Use HTTP-only cookies or secure bearer tokens for auth
- Protect admin routes with role-based middleware
- Validate inputs on every request

---

## 4. PostgreSQL database schema

### 4.1 Users
```text
users
- id (UUID or serial primary key)
- full_name
- email (unique)
- password_hash
- phone
- role (customer/admin)
- is_active
- created_at
- updated_at
```

### 4.2 Categories
```text
categories
- id (serial primary key)
- name
- slug (unique)
- description
- parent_id (nullable)
- is_active
- created_at
```

### 4.3 Products
```text
products
- id (serial primary key)
- category_id (foreign key)
- name
- slug (unique)
- description
- short_description
- price
- compare_price
- stock_quantity
- sku
- is_featured
- is_active
- image_url
- created_at
- updated_at
```

### 4.4 Product images
```text
product_images
- id (serial primary key)
- product_id (foreign key)
- image_url
- alt_text
- sort_order
- created_at
```

### 4.5 Addresses
```text
addresses
- id (serial primary key)
- user_id (foreign key)
- full_name
- phone
- address_line1
- address_line2
- city
- postal_code
- country
- is_default
- created_at
```

### 4.6 Cart items
```text
cart_items
- id (serial primary key)
- user_id (nullable foreign key)
- session_id (nullable)
- product_id (foreign key)
- quantity
- created_at
- updated_at
```

### 4.7 Orders
```text
orders
- id (serial primary key)
- user_id (foreign key)
- order_number (unique)
- status
- payment_status
- subtotal
- shipping_fee
- total
- currency
- shipping_address_json
- billing_address_json
- notes
- created_at
- updated_at
```

### 4.8 Order items
```text
order_items
- id (serial primary key)
- order_id (foreign key)
- product_id (foreign key)
- product_name
- quantity
- unit_price
- total_price
- created_at
```

### 4.9 Optional future tables
- reviews
- coupons
- payments
- refunds

### Recommended indexes
- products.slug
- products.category_id
- orders.user_id
- cart_items.user_id
- cart_items.session_id
- orders.status

---

## 5. API routes list

### Public routes
- GET /api/health
- GET /api/products
- GET /api/products/:id
- GET /api/categories
- GET /api/products/featured
- GET /api/products/search?q=

### Authentication routes
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Cart routes
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:id
- DELETE /api/cart/items/:id
- DELETE /api/cart

### Order routes
- POST /api/orders/checkout
- GET /api/orders
- GET /api/orders/:id

### Admin routes
- GET /api/admin/dashboard/stats
- GET /api/admin/products
- POST /api/admin/products
- PUT /api/admin/products/:id
- DELETE /api/admin/products/:id
- GET /api/admin/orders
- PATCH /api/admin/orders/:id/status
- GET /api/admin/users

### File upload routes
- POST /api/admin/products/upload-image

---

## 6. Admin dashboard structure

The admin dashboard should be a separate area with a simple and clean interface that matches the existing store style.

### Main sections
1. Dashboard overview
   - total sales
   - total orders
   - active users
   - out-of-stock products

2. Products management
   - list all products
   - add new product
   - edit product details
   - update stock and price
   - upload product images
   - mark product as featured or inactive

3. Orders management
   - list orders
   - filter by status
   - update status: pending, paid, shipped, delivered, cancelled
   - view customer details and order items

4. Users management
   - view users
   - change role
   - deactivate accounts

5. Settings
   - store settings
   - shipping rules
   - payment configuration

### Suggested admin pages
- /admin/index.html -> dashboard home
- /admin/products.html -> product CRUD page
- /admin/orders.html -> order management page
- /admin/users.html -> user management page

### Admin access model
- Only users with role = admin can access this area
- Admin routes must be protected by middleware

---

## 7. Migration plan from static pages to database-driven products

### Phase 1: Foundation
- Create the backend folder structure
- Set up Express application and environment configuration
- Create PostgreSQL database and schema
- Create seed data for a few perfumes

### Phase 2: Product catalog migration
- Replace hardcoded product cards with dynamic product data from the API
- Keep the current HTML layout and styling intact
- Create a shared product card template in JavaScript

### Phase 3: Product detail pages
- Convert individual product pages from static HTML into dynamic detail views
- Use product IDs or slugs from the database
- Keep the page design visually similar to the current product pages

### Phase 4: Cart system
- Connect the current cart sidebar or cart UI to the backend cart API
- Persist cart items for logged-in users
- Support quantity updates and removal

### Phase 5: Authentication
- Add register/login pages
- Connect them to the backend auth API
- Store user sessions securely

### Phase 6: Checkout and orders
- Add checkout flow with address selection
- Create order records in the database
- Display order history to users

### Phase 7: Admin dashboard
- Build the admin pages
- Add product CRUD and order management
- Protect the admin area with role-based access

### Phase 8: Production readiness
- Add image upload handling
- Add payment integration
- Add product search and filters
- Add error logging and monitoring

---

## 8. Recommended rollout strategy

To reduce risk, the migration should happen in this order:
1. backend + database
2. product listing from database
3. product detail pages from database
4. cart + auth
5. checkout + orders
6. admin dashboard

This lets you keep the current storefront live while gradually replacing static content with dynamic data.

---

## 9. Suggested first milestone

The first milestone should be:
- backend up and running
- PostgreSQL connected
- one product table populated
- catalog page reading products from the database

That milestone is enough to prove the architecture before adding more complex features like checkout and admin tools.
