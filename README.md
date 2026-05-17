# Ecommerce Microservice Project

This project demonstrates a full-stack ecommerce microservice architecture with:

## Backend

- NestJS
- Prisma
- PostgreSQL
- RabbitMQ (Direct + Fanout exchange)
- Redis
- Docker

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query
- SSR / CSR

---

# Project Structure

```text
root/
│
├── backend/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   └── ecommerce/         # API Gateway
│
├── frontend/
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Backend Services

- `user-service` (`http://localhost:3001`)
- `product-service` (`http://localhost:3002`)
- `order-service` (`http://localhost:3003`)
- `ecommerce gateway` (`http://localhost:3000`)

---

# Infrastructure

- PostgreSQL: `localhost:5432`
- RabbitMQ AMQP: `localhost:5672`
- RabbitMQ UI: `http://localhost:15672`
- Redis: `localhost:6379`

RabbitMQ Login:

```text
username: guest
password: guest
```

---

# RabbitMQ Concept in this project

## Direct Exchange

- Exchange: `ecommerce.direct`
- Routing key: `order.created`

Used for:

- Product stock reduction

## Fanout Exchange

- Exchange: `ecommerce.fanout`

Used for:

- Broadcasting order events to all services

---

# Backend Setup

## 1. Start infrastructure

```bash
docker compose up -d
```

---

## 2. Install dependencies

### User Service

```bash
cd backend/user-service
npm install
```

### Product Service

```bash
cd ../product-service
npm install
```

### Order Service

```bash
cd ../order-service
npm install
```

### API Gateway

```bash
cd ../ecommerce
npm install
```

---

## 3. Run Prisma generate + migration

### User Service

```bash
cd backend/user-service
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
```

### Product Service

```bash
cd ../product-service
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
```

### Order Service

```bash
cd ../order-service
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
```

---

## 4. Start backend services in separate terminals

### User Service

```bash
cd backend/user-service && npm run start:dev
```

### Product Service

```bash
cd backend/product-service && npm run start:dev
```

### Order Service

```bash
cd backend/order-service && npm run start:dev
```

### API Gateway

```bash
cd backend/ecommerce && npm run start:dev
```

---

# Frontend Setup

## 1. Go to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MEDIA_URL=http://localhost:3002
```

## 4. Start frontend

```bash
npm run dev
```

If port `3000` is already used:

```bash
npm run dev -- -p 3001
```

---

# Product Image Upload

## Backend APIs

| Method | Route                  |
| ------ | ---------------------- |
| POST   | `/products/with-image` |
| PATCH  | `/products/:id/image`  |

Images are stored in:

```text
backend/product-service/uploads/products/
```

Served from:

```text
http://localhost:3002/uploads/products/{filename}
```

---

# Authentication

Currently:

- No JWT authentication
- Uses localStorage + user-service

Flow:

- Register → `POST /users`
- Login → `GET /users`

---

# Features

## Backend Features

- Microservice architecture
- RabbitMQ messaging
- Prisma ORM
- Redis caching
- API Gateway

## Frontend Features

- SSR + CSR
- Product listing
- Product details
- Cart system
- Checkout flow
- Product image upload
- Responsive UI

---

# Sample Flow

1. Register user
2. Login
3. Browse products
4. Open product details
5. Add to cart
6. Proceed to checkout
7. Place order
8. View orders

---

# Postman Test Flow

1. Create a user (`POST /users`)
2. Create a product (`POST /products`)
3. Create an order (`POST /orders`)
4. Check product stock again (`GET /products`)
5. Observe RabbitMQ direct/fanout behavior in logs

---
