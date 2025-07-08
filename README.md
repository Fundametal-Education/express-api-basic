Express Todo API
A simple REST API built with TypeScript, Express, and PostgreSQL that provides user authentication and todo management functionality.

Features
User registration and authentication
JWT-based authorization
Complete CRUD operations for todos
PostgreSQL database with proper relations
Docker compose setup for easy deployment
TypeScript for type safety
API Endpoints
Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user info (requires auth)
Todos
GET /api/todos - Get all todos for authenticated user
POST /api/todos - Create a new todo
GET /api/todos/:id - Get specific todo
PUT /api/todos/:id - Update todo
DELETE /api/todos/:id - Delete todo
Health Check
GET /health - API health status
Setup
Prerequisites
Node.js 18+
Docker and Docker Compose
PostgreSQL (if running locally)
Local Development
Clone the repository
Install dependencies:
bash
npm install
Set up environment variables:
bash
cp .env.example .env
Edit .env with your configuration.
Start PostgreSQL (using Docker):
bash
docker run --name postgres-todo -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todoapp -p 5432:5432 -d postgres:15-alpine
Run database migrations:
bash
npm run migrate
Start the development server:
bash
npm run dev
The API will be available at http://localhost:3000

Docker Compose
For a complete setup with PostgreSQL:

bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
After starting with Docker Compose, run the migration:

bash
docker-compose exec app npm run migrate
Usage Examples
Register a new user
bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
Login
bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
Get current user (with token)
bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/auth/me
Create a todo
bash
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'
Get all todos
bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/todos
Update a todo
bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
Delete a todo
bash
curl -X DELETE http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
Environment Variables
NODE_ENV - Environment (development/production)
PORT - Server port (default: 3000)
DB_HOST - Database host
DB_PORT - Database port
DB_NAME - Database name
DB_USER - Database user
DB_PASSWORD - Database password
JWT_SECRET - Secret key for JWT tokens
Database Schema
Users Table
id - Primary key
email - Unique email address
password - Hashed password
name - User's full name
created_at - Timestamp
Todos Table
id - Primary key
title - Todo title
description - Optional description
completed - Boolean completion status
user_id - Foreign key to users table
created_at - Timestamp
updated_at - Timestamp
Scripts
npm run dev - Start development server with hot reload
npm run build - Build TypeScript to JavaScript
npm start - Start production server
npm run migrate - Run database migrations
Security Notes
Change the JWT_SECRET in production
Use environment variables for sensitive configuration
Passwords are hashed using bcrypt
JWT tokens expire after 7 days
All todo operations are scoped to the authenticated user
License
MIT

