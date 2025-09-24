# BookLibrary Frontend Configuration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api

# For production
# REACT_APP_API_URL=https://your-backend-api.com/api
```

## Backend API Requirements

Your backend should provide the following endpoints:

### Authentication
- `POST /api/auth/login` - Login with email/password, returns JWT token
- `POST /api/auth/register` - Register new user, returns JWT token

### Books
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query&category=cat&author=auth` - Search books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Expected Data Formats

#### User Object
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "admin" | "user"
}
```

#### Book Object
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "author": "string",
  "category": "string",
  "image": "string", // URL to image
  "createdAt": "string", // ISO date
  "updatedAt": "string"  // ISO date
}
```

#### Auth Response
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string", 
    "name": "string",
    "role": "admin" | "user"
  }
}
```

## Features

- **Authentication**: JWT-based login/register with 30min token validity
- **Role-based Access**: Admin (CRUD operations) vs User (view/search only)
- **Book Management**: Full CRUD operations for admins
- **Search**: Advanced search with filters (title, author, category)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Image Upload**: Support for book cover images
- **Modern UI**: Beautiful design with smooth animations

## JWT Token Handling

The app automatically:
- Stores JWT tokens in localStorage
- Adds Authorization headers to API requests
- Redirects to login when token expires
- Validates token expiration client-side

## Usage

1. Users can register/login
2. Browse books in grid layout on dashboard
3. Search books with advanced filters
4. View detailed book information
5. Admins can add/edit/delete books
6. Automatic token refresh handling