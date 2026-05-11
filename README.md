# Online Food Ordering Prototype

This project is a hiring-task prototype for Electro Pi.

## Tech Stack
- Backend: Django + Django REST Framework + SQLite
- Frontend: React (Vite) + Tailwind CSS
- Auth: JWT (SimpleJWT)
- Language support: English and Arabic (RTL toggle in UI)

## Implemented Features
- Complete menu API and UI cards (images, EN/AR names, price, description)
- User registration/login
- Add to cart, update quantity, remove items
- Checkout with payment option:
  - `online`
  - `cod` (Cash on Delivery)
- Order status tracking for users
- Admin dashboard:
  - Revenue and order metrics
  - List all orders
  - Update order status
  - Create products
- Django admin panel for product/order management

## Run Backend
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

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Important API Routes
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/menu/items/`
- `GET/POST /api/orders/cart/`
- `POST /api/orders/checkout/`
- `GET /api/orders/my-orders/`
- `GET /api/orders/admin/dashboard/` (admin only)

## Notes
- Admin routes require `is_staff = true`.
- Language toggle button switches EN/AR and updates page direction.
