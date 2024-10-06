# Authentication App

This project is a full-stack authentication application built with React (frontend) and NestJS (backend). It demonstrates user registration, login, and protected routes.

## Project Structure

The project is divided into two main parts:

- `frontend/`: React application
- `backend/`: NestJS application

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd easygenerator-auth
   ```

2. Install frontend dependencies:

   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

## Configuration

1. Backend configuration:

   - Create a `.env` file in the `backend/` directory
   - Add the following environment variables:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```

2. Frontend configuration:
   - Create a `.env` file in the `frontend/` directory
   - Add the following environment variable:
     ```
     REACT_APP_API_BASE_URL=http://localhost:3000
     ```

## Running the Application

1. Start the backend server:

   ```
   cd backend
   npm run start:dev
   ```

   The backend will run on `http://localhost:3000`

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3001`

## Features

- User registration
- User login
- Protected routes
- JWT authentication
- Logout functionality

## API Documentation

The backend API is documented using Swagger. Once the backend is running, you can access the Swagger UI at:
` http://localhost:3000/api
`

## Testing

To run the tests for the backend:
` cd backend
    npm run test
`

To run the tests for the frontend:
` cd frontend
    npm test
`

## Built With

- Frontend:

  - React
  - React Router
  - Axios
  - Tailwind CSS

- Backend:
  - NestJS
  - MongoDB with Mongoose
  - Passport.js
  - JWT
