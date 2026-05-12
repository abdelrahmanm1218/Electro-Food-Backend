# Online Food Ordering Prototype

This project is a hiring-task prototype for Electro Pi.
It provides a Django + DRF backend with a React/Tailwind frontend for ordering food, cart management, checkout, and admin order tracking.

## Tech Stack
- Backend: Django + Django REST Framework + SQLite
- Frontend: React (Vite) + Tailwind CSS
- Auth: JWT (SimpleJWT)
- Language support: English and Arabic (RTL toggle in UI)

## Features
- Menu browsing with product images, English/Arabic names, price, and description
- User registration, login, and profile retrieval
- Add to cart, update quantity, and remove cart items
- Checkout with `online` or `cod` payment methods
- Order history and detail views for users
- Admin dashboard with revenue metrics and order management
- Django admin panel for product and order management

## Backend Setup
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata menu_items
python manage.py createsuperuser
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## API Overview
Base URL: `http://127.0.0.1:8000/api`

### Authentication
#### Register
- `POST /api/auth/register/`
- Request body: `{ "username": "user", "email": "user@example.com", "password": "secret" }`
- Response: `{ "id": 1, "username": "user", "email": "user@example.com", "is_staff": false }`

#### Login
- `POST /api/auth/login/`
- Request body: `{ "username": "user", "password": "secret" }`
- Response: `{ "access": "<jwt>", "refresh": "<jwt>" }`

#### Refresh access token
- `POST /api/auth/refresh/`
- Request body: `{ "refresh": "<refresh_token>" }`
- Response: `{ "access": "<new_jwt>" }`

#### Get current user
- `GET /api/auth/me/`
- Headers: `Authorization: Bearer <access_token>`
- Response: `{ "id": 1, "username": "user", "email": "user@example.com", "is_staff": false }`

### Menu
#### List menu items
- `GET /api/menu/items/`
- Response: list of menu items with fields such as `id`, `name_en`, `name_ar`, `description_en`, `description_ar`, `price`, `image_url`, and `is_available`

#### Retrieve menu item
- `GET /api/menu/items/{id}/`
- Response: menu item detail object

### Cart
Requires authenticated user.

#### Get cart items
- `GET /api/orders/cart/`
- Response: list of cart entries with `id`, `menu_item`, `quantity`, and `menu_item_detail`

#### Add to cart
- `POST /api/orders/cart/`
- Request body: `{ "menu_item": 1, "quantity": 2 }`
- Response: created cart item

#### Update / delete cart item
- `PATCH /api/orders/cart/{id}/` or `DELETE /api/orders/cart/{id}/`
- Response: updated cart item or `204 No Content` for delete

### Orders
Requires authenticated user.

#### Checkout
- `POST /api/orders/checkout/`
- Request body:
  ```json
  {
    "payment_method": "online",
    "governorate": "Cairo",
    "city": "Nasr City",
    "street": "123 Food St"
  }
  ```
- `payment_method` values: `online`, `cod`
- Response: created order object with items and total price

#### User order list
- `GET /api/orders/my-orders/`
- Response: list of orders for the authenticated user

#### Order detail
- `GET /api/orders/my-orders/{id}/`
- Response: order details with `items`, `status`, `payment_method`, `total_price`, `governorate`, `city`, `street`, and user email

### Admin routes
Requires `is_staff = true`.

#### List all orders
- `GET /api/orders/admin/orders/`
- Optional filter: `?order_date=YYYY-MM-DD`
- Response: all orders with order details

#### Get order detail
- `GET /api/orders/admin/orders/{id}/`

#### Update order status
- `PATCH /api/orders/admin/orders/{id}/status/`
- Request body: `{ "status": "confirmed" }`
- Valid status values: `pending`, `confirmed`, `preparing`, `on_the_way`, `delivered`

#### Admin dashboard metrics
- `GET /api/orders/admin/dashboard/`
- Response includes `total_orders`, `revenue`, and `status_breakdown`

## Notes
- Admin-only routes require the authenticated user to have `is_staff = true`.
- The frontend toggles between English and Arabic, updating directionality for RTL support.
- `MenuItem` objects include availability via `is_available`; only available items can be added to cart.
- The Django admin panel is available at `/admin/` for managing products, orders, and users.
