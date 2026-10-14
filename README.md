# Shopwise

Shopwise is a small demonstration e-commerce application. It lets users browse a product catalog, filter products, and build a shopping cart without authentication or payment processing.

The project is designed as a simple local MVP that can later be extended with a database, users, and orders.

## Features

- browse the product catalog;
- search products by name;
- filter products by category;
- add products to the cart;
- increase and decrease quantities;
- remove products or clear the cart;
- calculate the cart total;
- persist the cart in the browser's `localStorage`;
- validate the cart through the backend;
- show a fallback catalog when the backend is unavailable.

## Architecture

```text
Browser
  │
  ├── React frontend :3000
  │     ├── product catalog
  │     ├── filters and search
  │     └── local shopping cart
  │
  └── Node.js backend :4000
        ├── GET  /api/health
        ├── GET  /api/products
        └── POST /api/cart/quote
```

The catalog is currently stored in backend memory. The cart is stored in the browser, so it is not shared across devices and is lost when the browser's `localStorage` is cleared.

## Technology stack

- React 18;
- Create React App;
- Node.js 20 or later;
- native HTTP REST API with no runtime backend dependencies;
- Bootstrap and custom CSS;
- Docker and Docker Compose;
- Cypress for end-to-end tests.

## Requirements

- Node.js 20+;
- npm 9+;
- Docker Desktop, optional for containerized development.

## Local development

Run the frontend and backend in two separate terminals.

### Backend

```bash
cd backend
npm start
```

The backend runs at `http://localhost:4000`.

### Frontend

From the project root:

```bash
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

The frontend uses `http://localhost:4000` as the default API URL. To change it:

```powershell
$env:REACT_APP_API_URL="http://localhost:5000"
npm start
```

## Docker Compose

From the project root:

```bash
docker compose up --build
```

Available services:

- frontend: `http://localhost:3000`;
- backend: `http://localhost:4000`;
- health check: `http://localhost:4000/api/health`.

Stop the containers with:

```bash
docker compose down
```

## API

### Health check

```http
GET /api/health
```

Response:

```json
{ "status": "ok" }
```

### List products

```http
GET /api/products
```

The response contains products with an ID, name, category, price, unit, and emoji.

### Quote a cart

```http
POST /api/cart/quote
Content-Type: application/json
```

Example request body:

```json
{
  "items": [
    { "productId": "coffee", "quantity": 2 },
    { "productId": "pasta", "quantity": 1 }
  ]
}
```

The backend validates product IDs and quantities, then returns normalized line items and the total.

## Project structure

```text
shop/
├── backend/
│   ├── server.js          # HTTP API and in-memory catalog
│   ├── package.json       # backend scripts
│   └── Dockerfile
├── public/                # public frontend assets
├── src/
│   ├── App.js             # catalog and cart interface
│   ├── App.css            # responsive layout and styling
│   ├── api.js             # backend HTTP client
│   └── index.js           # React bootstrap
├── cypress/               # end-to-end tests
├── Dockerfile             # Nginx frontend image
├── docker-compose.yml     # frontend and backend startup
└── package.json
```

## Tests and production build

Run the React tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

Open the Cypress test runner:

```bash
npx cypress open
```

## Current limitations

- no authentication;
- no database;
- no users, orders, or payment processing;
- the catalog can only be changed in the backend source code;
- the cart is local to one browser;
- no real stock availability checks.

## Future improvements

1. add PostgreSQL and Prisma;
2. move products into an administrable database;
3. add authentication and cross-device cart synchronization;
4. introduce checkout and order management;
5. add automated API and cart tests;
6. migrate the frontend to Vite and TypeScript.


