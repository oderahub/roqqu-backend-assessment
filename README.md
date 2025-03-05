# Roqqu Backend Assessment

## Description

A user management system built with TypeScript, Node.js, TypeORM, and SQLite, featuring RESTful APIs for managing users, addresses, and posts with JWT authentication, rate limiting, and Swagger documentation.

## Setup Instructions

### Prerequisites

- **Node.js**: v14.x or later
- **npm**: v6.x or later
- **SQLite**: No separate installation required (handled by `sqlite3` package)

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd roqqu-backend-assessment
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   _Installs all required packages, including Express, TypeORM, SQLite3, JWT, rate limiting, and Swagger tools._

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:

   ```bash
   echo "PORT=3000\nNODE_ENV=development\nDATABASE_URL=./database.sqlite\nJWT_SECRET=your-secret-key" > .env
   ```

   _Replace `your-secret-key` with a secure key for JWT authentication._

4. **Build the Project**:

   ```bash
   npm run build
   ```

   _Compiles TypeScript files from `src/` to `dist/`._

5. **Run the Server**:
   ```bash
   npm start
   ```
   _Starts the server at http://localhost:3000_

### Additional Commands

- **Development Mode**:

  ```bash
  npm run dev
  ```

  _Uses nodemon for auto-restart on file changes_

- **Run Tests**:

  ```bash
  npm test
  ```

  _Executes API tests using Jest and Supertest_

- **Test Watch Mode**:

  ```bash
  npm run test:watch
  ```

- **Linting**:
  ```bash
  npm run lint
  npm run lint:fix
  ```

## API Endpoints

### Authentication

- **POST `/auth/login`**
  ```json
  {
    "email": "string"
  }
  ```
  _Returns a JWT token for authenticated requests_

### Users

- **GET `/users`** (Paginated)
  - Query Params: `pageNumber`, `pageSize`
- **GET `/users/count`**: Total number of users
- **GET `/users/:id`**: User details with address
- **POST `/users`**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string" (optional)
  }
  ```
- **PATCH `/users/:id`** (Authenticated):
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string" (optional)
  }
  ```
- **DELETE `/users/:id`** (Authenticated)

### Addresses

- **GET `/addresses/:userId`**
- **POST `/addresses`** (Authenticated):
  ```json
  {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
  }
  ```
- **PATCH `/addresses/:userId`** (Authenticated)
- **DELETE `/addresses/:userId`** (Authenticated)

### Posts

- **GET `/posts`** (By User ID)
- **GET `/posts/:id`**
- **POST `/posts`** (Authenticated):
  ```json
  {
    "title": "string",
    "body": "string"
  }
  ```
- **PATCH `/posts/:id`** (Authenticated)
- **DELETE `/posts/:id`** (Authenticated, Owner Only)

## Features

### Rate Limiting

- **Limit**: 100 requests per 15-minute window
- **Purpose**: Prevent abuse, ensure fair usage
- **Exceeded Limit Response**:
  ```json
  {
    "status": "error",
    "code": 429,
    "message": "Too many requests from this IP, please try again later."
  }
  ```

## Documentation

### Swagger UI

- **URL**: http://localhost:3000/api-docs
- **Authentication**:
  1. Use POST `/auth/login` to get a token
  2. Click "Authorize" and enter `Bearer <token>`

### Postman Documentation

- **URL**: [Link to be added after publishing]

## Deployment

- **Live API URL**: [Link to be added after deployment]
