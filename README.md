# Stage 2026 Application

Application web de segmentation et de visualisation de données développée dans le cadre de mon stage 2026.


## Backend

### Requirements
- PHP 8.2+
- Composer
- SQLite (default) or another database supported by Laravel

### Setup
1. `cd backend`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan db:seed`
7. `php artisan serve --host=127.0.0.1 --port=8000`

### API
The backend exposes these main routes:
- `POST /api/login`
- `POST /api/logout`
- `GET /api/produits`
- `GET /api/commandes`
- `GET /api/fournisseurs`
- `GET /api/categories`

### Seeded credentials
- email: `admin@example.com`
- password: `password`

## Frontend

### Requirements
- Node.js 18+
- npm

### Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

The frontend proxy is configured for `/api` to `http://127.0.0.1:8000`.
