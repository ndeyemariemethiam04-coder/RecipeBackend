# RecipeBackend

This is the backend for a Recipe Application built as a Midterm Project for Web Dev 2. The project features full authentication and authorization, database integration using SQLite natively, and RESTful API endpoints.

## Tech Stack
- **Node.js**: Backend runtime environment
- **Express**: Fast, unopinionated web framework for Node.js
- **SQLite**: Lightweight serverless relational database utilizing `sqlite3` and `sqlite` wrapper
- **JSON Web Tokens (JWT)**: Secure user authentication
- **Bcrypt**: Password hashing

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)

### Installation
1. Clone the repository and navigate into the project directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Look at the `.env.example` file and create a new file named `.env` in the root folder with your specific credentials:
   ```env
   PORT=5000
   SECRET_KEY="YOUR_SECRET_KEY"
   ```
   **Note**: Ensure that `.env` is NOT uploaded to GitHub. It is already added to `.gitignore`.

### Features & Usage
- **Authentication**: Register and Login to manage your recipes.
- **Recipes**: Add, Edit, and Delete recipes.
- **Search**: Search recipes by `title`, `ingredients`, or `category` using the `?q=` query parameter.
- **Images**: This project supports **Base64 image strings** stored directly in the database. When adding a recipe via the API, send the image data as a string in the `coverImage` field.
- **Categories**: You can specify a `category` (e.g., Breakfast, Lunch, Dinner) when creating or editing recipes.

4. Start the application in development mode:
   ```bash
   npm run dev
   ```
   The backend will now be available at `http://localhost:<PORT>`.

## Deployment (Local via Ngrok)

To expose the backend API for your frontend or external use without hosting it on a full cloud server, you can use **ngrok**.
1. Download and install [ngrok](https://ngrok.com/).
2. Run your application locally:
   ```bash
   npm run dev
   ```
3. Expose the port using ngrok (replace 5000 with your actual port):
   ```bash
   ngrok http 5000
   ```
4. Copy the secure `https` URL provided by ngrok and use it as the base URL for your frontend application. Note that every time you restart ngrok, this URL will change. You can also setup a free hobby account on a service like [Render](https://render.com/) if you want a permanent deployment.

## API Endpoints

### User Authentication

| Method | Endpoint      | Description           | Protection   |
|--------|---------------|-----------------------|--------------|
| POST   | `/login`      | User login endpoint   | none         |
| POST   | `/signUp`     | Register a new user   | none         |
| GET    | `/user/:id`   | Fetch user details    | none         |

### Recipes Actions

| Method | Endpoint        | Description                       | Protection        |
|--------|-----------------|-----------------------------------|-------------------|
| GET    | `/recipe`       | Retrieve all recipes              | none              |
| GET    | `/recipe/:id`   | Retrieve a single recipe by ID    | none              |
| POST   | `/recipe`       | Add a new recipe                  | **Token Required**|
| PUT    | `/recipe/:id`   | Edit an existing recipe           | **Token Required**|
| DELETE | `/recipe/:id`   | Delete a recipe                   | **Token Required**|

> **Note**: For routes that require protection, include the JSON Web Token in the headers as:
> `Authorization: Bearer <Your_Token>`
