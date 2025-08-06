# Parcel Delivery System

This is the backend for a Parcel Delivery System that enables registered users to send and receive parcels. The project follows a Modular MVC architecture, designed for scalability, maintainability, and ease of feature extension.

---

## 🚀 Features

- 📮 User roles: `Admin`, `Sender`, `Receiver`
- 🔐 JWT-based Authentication
- 🔍 Advanced filtering, search, and pagination
- 📦 Parcel creation and delivery tracking
- 🧾 Status log with timestamps and updater info
- ❌ Soft delete and block user/parcel support
- 🧪 Centralized error handling and validation

## Techstack

- **Typescript** --> Type safety.
- **ESLint** --> Code linting.
- **MongoDB** --> Database,
- **Express** --> Server Framework.
- **Zod** --> Schema Validation.
- **Bcrypt** --> Password Hashing.
- **JWT** --> Auth tokens.
- **Mongoose** --> MongoDB ODM.
- **Vercel** --> Deployment.
- **Git** + **Github** --> Version Control.

## Folder Structure

```bash
src/
│
├── config/             # Environment config
├── error/              # Global error handling
├── interface/          # Global Interface to extend Express Req
├── middleware/         # Auth & validation & Error middleware
├── modules/
│ ├── auth              # Authentication service, controller
│ ├── parcel/           # Parcel model, controller, service
│ └── user/             # User model, controller, service
├── routes/             # Global Routes
├── utils/              # Utility Functions
├── app.ts              # Main express app
└── server.ts           # Server entry point

```

## API Endpoints Overview

The base Api structure is: **<http://localhost:5000/api/v1/>**

### User

- **POST** -> **/user/create**         -> Admin cannot register. They can only be promoted by other Admins.
- **GET** -> **/user/:id**             -> No restriction as long as they are an registered in user.
- **GET** -> **/user/get-all**         -> Only Admins can access. Supports filter, search, pagination,etc.
- **PATCH** -> **/user/update/:id**    -> Protected Route. Only Admins have full access.
- **DELETE** -> **/user/delete/:id**   -> Soft delete. Non Admins can only delete their own account

### Auth

- **POST** -> **/auth/login** -> Login route that also sets up the cookies for all users.
- **POST** -> **/auth/reset-password** -> Protected Route to change password.
- **POST** -> **/auth/logout** -> Removes the cookies on client side.
- **POST** -> **/auth/refresh-token** -> Gives fresh Access Tokens to users with valid refresh tokens.
  
### Parcel

- **GET** -> **/parcel/get-all/me** -> Fetches all the parcels associated with the User.
- **GET** -> **/parcel/get-all** -> Admin only route. Fetches every single parcel in the system. Supports pagination, filtering , searching,etc.
- **GET** -> **/parcel/get/:trackingId** -> Fetches a single parcel based on Tracking Id. The parcel has to associated with user, unless they are Admin.
- **PATCH** -> **/parcel/update/sender/:trackingId** -> Modifies the user's parcel as long as its not Dispatched yet.
- **PATCH** -> **/parcel/update/receiver/:trackingId** -> Allows Users to confirm delivery or cancel if not dispatched.
- **PATCH** -> **/parcel/update/admin/:trackingId** -> Admins can update the status of the parcel.
- **DELETE** -> **parcel/delete/:trackingId** -> Soft deletes Parcels. Only Admins and Senders.
- **POST** -> **/parcel/create** -> Only Admins and Senders can create parcels.

## User Roles Overview

- **Admin** --> Full Access to any parcel or user.
- **Sender** --> Request to send a parcel to admins. Limited Parcel update and view their own parcels.
- **Receiver** --> Confirm Delivery or Cancel it. Can view their own parcels.

## Setting Up Project

1. Clone and install:

    ```bash
        git clone https://github.com/Shadow-Blaxe-123/Parcel-Delivery-System-Backend.git
        cd Parcel-System-Delivery-Backend
        npm install
    ```

2. Set up Environment Variables in .env file in the project root directory.

    ```bash
        # Server Setup
        PORT= "your Port"
        DB_URL= "your-mongo-db-url"
        NODE_ENV= "development"

        # Bcrypt
        HASH_SALT= "Salt Number"

        # JWT Secrets
        ACCESS_TOKEN_SECRET= "Your Secret"
        ACCESS_TOKEN_EXPIRES_IN= "1d"
        REFRESH_TOKEN_SECRET= "Your Secret"
        REFRESH_TOKEN_EXPIRES_IN= "30d"

        # First Admin
        ADMIN_NAME= "fill it as you wish."
        ADMIN_EMAIL= "fill it as you wish."
        ADMIN_PASSWORD= "fill it as you wish."
        ADMIN_ADDRESS= "fill it as you wish."

    ```

3. Run the project.

    ```bash
        npm run dev
    ```
