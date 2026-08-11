# Store Rating Application

A full-stack web application that allows users to rate registered stores. The application implements a single authentication system with role-based access control for **System Administrators, Store Owners, and Normal Users**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [Database Setup](#database-setup)
- [Creating the First Admin](#creating-the-first-admin)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Role-Based Functionality](#role-based-functionality)
- [Filtering and Searching](#filtering-and-searching)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Assignment Submission](#assignment-submission)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

---

# Project Overview

The Store Rating Application provides a centralized platform where authenticated users can view stores and submit ratings from **1 to 5 stars**.

The application uses a single login system. After authentication, users are granted access to functionality according to their assigned role.

### Main capabilities

- User authentication using JWT
- Role-based authorization
- Admin dashboard
- Store management
- User management
- Store owner dashboard
- Store ratings
- Average store ratings
- Rating distribution
- Server-side filtering
- User and store search
- Form validation
- API error handling
- MySQL database persistence

---

# Features

## Authentication

- User signup
- User login
- JWT-based authentication
- Protected routes
- Role-based authorization
- Password hashing using bcrypt

## System Administrator

Administrators can:

- View dashboard statistics
- View total users
- View total stores
- View total ratings
- Create users
- Create administrators
- Create store owners
- Create stores
- Assign stores to store owners
- View users
- Filter users by role
- Search/filter users by name, email, and address
- View individual user details
- View store information and average ratings

## Normal User

Normal users can:

- Log in
- View registered stores
- Search/filter stores
- View store ratings
- Submit ratings from 1 to 5
- Update their rating for a store

## Store Owner

Store owners can:

- Log in
- View their assigned store
- View their store's average rating
- View total ratings
- View rating distribution
- View users who rated their store
- Search/filter rating information

---

# User Roles

The application supports three roles:

| Role          | Description                                 |
| ------------- | ------------------------------------------- |
| `ADMIN`       | System administrator with management access |
| `STORE_OWNER` | User responsible for a registered store     |
| `NORMAL_USER` | User who can rate stores                    |

---

# Technology Stack

## Frontend

- React
- Vite
- Material UI (MUI)
- Redux Toolkit
- RTK Query
- React Router
- Axios
- JavaScript

## Backend

- Node.js
- Express.js
- Sequelize ORM
- JWT
- bcrypt
- JavaScript / ES Modules

## Database

- MySQL

---

# Project Structure

The project is divided into separate frontend and backend applications.

```text
StoreRatingApplication/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

# Prerequisites

Make sure the following software is installed:

- Node.js 18+ recommended
- npm
- MySQL 8+
- Git

Check the installed versions:

```bash
node --version
npm --version
mysql --version
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/snehagupta53361/store_rating_app.git
```

Navigate into the project:

```bash
cd store_rating_app
```

---

# Backend Installation

Navigate to the backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env (Backend)
PORT=
NODE_ENV=
FRONTEND_URL=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_CONNECTION_LIMIT=
JWT_SECRET=
JWT_EXPIRES_IN
```

# Frontend Installation

Open another terminal and navigate to the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file if required by the project:

```env
REACT_API_URL=http://localhost:5000/api
```

---

# Database Setup

Make sure MySQL is running.

Create the database:

```sql
CREATE DATABASE store_rating;
```

The application uses Sequelize to communicate with MySQL.

Configure the database credentials in the backend `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating
DB_USER=root
DB_PASSWORD=your_mysql_password
```

The application will establish the database connection when the backend starts.

---

# Creating the First Admin

The application provides a seed script for creating the initial system administrator.

From the `server` directory, run:

```bash
npm run seed:admin
```

The seed command creates the first administrator account required to access the admin dashboard.

> Configure the administrator credentials according to the seed implementation before running the command.

---

# Running the Application

## Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will start on the configured port, for example:

```text
http://localhost:3000
```

---

## Start the Frontend

From the `client` directory:

```bash
npm run start
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Available Scripts

## Backend

Typical backend scripts:

```bash
npm run dev
```

Starts the backend using the development configuration.

```bash
npm start
```

Starts the backend in production mode, if configured.

```bash
npm run seed:admin
```

Creates the initial administrator account.

## Frontend

```bash
npm run dev
```

Starts the react development server.

```bash
npm run start
```

Creates the production frontend build.

```bash
npm run build
```

Previews the production build locally.

---

# Authentication

The application uses **JWT-based authentication**.

After successful login, the backend generates an authentication token.

Protected API requests require the token to be sent with the request:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend authentication middleware verifies the token and attaches the authenticated user's information to the request.

Role-based middleware then controls access to protected resources.

---

# Role-Based Functionality

The application uses role-based authorization.

Example:

```text
ADMIN
   │
   ├── User Management
   ├── Store Management
   ├── Dashboard
   └── Platform Statistics

STORE_OWNER
   │
   ├── Store Dashboard
   ├── Rating Statistics
   └── Users Who Rated Store

NORMAL_USER
   │
   ├── Browse Stores
   ├── View Ratings
   └── Submit / Update Ratings
```

Users cannot access functionality that is not permitted for their assigned role.

---

# Filtering and Searching

User and store listing APIs support server-side filtering.

For example, users can be filtered using query parameters:

```http
GET /api/users?name=john
```

```http
GET /api/users?email=gmail.com
```

```http
GET /api/users?address=Delhi
```

```http
GET /api/users?role=STORE_OWNER
```

Multiple filters can be combined:

```http
GET /api/users?name=john&role=STORE_OWNER
```

The filtering is performed on the backend using Sequelize query conditions rather than downloading all records and filtering them exclusively on the frontend.

---

# API Overview

The following is a high-level overview of the application's API structure.

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

## Users

```text
POST /api/users
GET  /api/users
GET  /api/users/:id
```

Example filtering:

```text
GET /api/users?name=john
GET /api/users?email=example
GET /api/users?address=Delhi
GET /api/users?role=ADMIN
```

## Stores

```text
POST /api/stores
GET  /api/stores
GET  /api/stores/:id
```

## Ratings

```text
POST /api/stores/:id/rating
```

The rating value must be within:

```text
1 - 5
```

## Admin and Store Owner Dashboard

GET /api/dashboard

---

# Rating System

Users can submit ratings from **1 to 5 stars**.

The system maintains the relationship between:

```text
User
   │
   │ rates
   ▼
Store
```

A user's rating is associated with both the user and store.

The application calculates the store's average rating from submitted ratings.

For example:

```text
Ratings:
5
4
5
3

Average:
4.25
```

The frontend displays the calculated rating and related rating statistics.

---

# Environment Variables

## Backend `.env`

Create:

```text
server/.env
```

Example:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10

FRONTEND_URL=http://localhost:3000
```

## Frontend `.env`

Create:

```text
client/.env
```

Example:

```env
REACT_API_URL=http://localhost:8000/api
```
