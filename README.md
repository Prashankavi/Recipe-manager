# Recipe Manager

A full-stack web application for managing personal recipes, built with React frontend and PHP backend.

![Recipe Manager Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Recipe+Manager+Screenshot)

## Features

### 🍳 Recipe Management
- **Create, Read, Update, Delete** recipes
- **Rich recipe details**: ingredients, instructions, prep/cook time, servings
- **Bulk ingredient/instruction input** for faster recipe creation
- **Recipe categorization** with predefined categories
- **Search and filter** recipes by title, ingredients, or category
- **Sort recipes** by newest, oldest, or alphabetically

### 👤 User Authentication
- **User registration** with validation
- **Secure login** with password hashing
- **Session persistence** using localStorage
- **User-specific recipes** - users can only edit/delete their own recipes

### 📱 User Interface
- **Responsive design** - works on desktop, tablet, and mobile
- **Modern UI** with smooth animations and transitions
- **Category browsing** with recipe counts and previews
- **Intuitive navigation** with breadcrumbs and back buttons
- **Loading states** and error handling
- **Empty state messages** for better UX

### 🔍 Search & Discovery
- **Real-time search** across recipe titles and ingredients
- **Category filtering** with visual category cards
- **Recipe statistics** and quick access to popular categories
- **Advanced sorting** options

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **CSS3** - Styling with modern features (Grid, Flexbox, animations)
- **LocalStorage** - Client-side data persistence

### Backend
- **PHP 8+** - Server-side logic
- **MySQL** - Database
- **XAMPP** - Local development environment

### Development Tools
- **Create React App** - React project setup
- **ESLint** - Code linting
- **Modern JavaScript** (ES6+)

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) and npm
- **XAMPP** (or similar PHP/MySQL environment)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** (optional, for cloning the repository)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/recipe-manager.git
cd recipe-manager
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm start
```
The React app will run at `http://localhost:3000`

### 3. Backend Setup

#### Database Setup
1. **Start XAMPP** (Apache and MySQL)
2. **Open phpMyAdmin** at `http://localhost/phpmyadmin`
3. **Create database**:
   ```sql
   CREATE DATABASE recipe_manager;
   USE recipe_manager;
   ```
4. **Create users table**:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

#### PHP Files Setup
1. **Copy PHP files** to your XAMPP htdocs directory:
   ```
   C:\xampp\htdocs\RECIPE-MANAGER\
   └── src\
       └── pages\
           ├── cors.php
           ├── db.php
           ├── login.php
           ├── register.php
           └── test.html (optional - for testing)
   ```

2. **Update database connection** in `src/pages/db.php`:
   ```php
   $host = "localhost";
   $user = "root";        // Your MySQL username
   $pass = "";           // Your MySQL password
   $db = "recipe_manager";
   ```

3. **Test the backend** by visiting:
   - `http://localhost/RECIPE-MANAGER/src/pages/test.html`
   - All tests should pass ✅

### 4. Configure API Connection

Update the API base URL in `src/services/authService.js`:
```javascript
const API_BASE_URL = 'http://localhost/RECIPE-MANAGER/src/pages';
```

## File Structure

```
recipe-manager/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   ├── SearchBar.js
│   │   └── RecipeCard.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── cors.php
│   │   ├── db.php
│   │   ├── login.php
│   │   ├── Login.js
│   │   ├── AddEditRecipe.js
│   │   ├── RecipeDetail.js
│   │   └── Categories.js
│   │   └── register.php
│   ├── services/
│   │   ├── authService.js
│   │   └── recipeService.js
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── xampp-backend/
│   └── src/
│       └── pages/
├── package.json
└── README.md
```

## Usage Guide

### Getting Started
1. **Register an account** or login with existing credentials
2. **Add your first recipe** using the "Add New Recipe" button
3. **Browse recipes** on the home page
4. **Search and filter** to find specific recipes
5. **Edit or delete** your own recipes

### Adding Recipes
- Fill in basic information (title, category, servings, times)
- Add ingredients one by one or use **bulk input** for faster entry
- Add step-by-step instructions
- Use the **bulk instruction** feature for copy-pasting from other sources

### Recipe Categories
The app includes these predefined categories:
- Breakfast, Lunch, Dinner
- Dessert, Snack, Appetizer
- Main Course, Side Dish
- Soup, Salad, Beverage
- Vegetarian, Quick & Easy, Baking

### Search & Filter
- **Search by text**: Recipe titles and ingredients
- **Filter by category**: Use the dropdown or visit Categories page
- **Sort options**: Newest first, Oldest first, Alphabetical

## API Endpoints

### Authentication
- `POST /login.php` - User login
- `POST /register.php` - User registration

### Recipes (Frontend handled)
Recipes are currently stored in localStorage, but the structure supports easy migration to backend:
- Recipe CRUD operations
- Category management
- Search and filtering

## Data Models

### User
```javascript
{
  id: number,
  name: string,
  email: string,
  created_at: timestamp
}
```

### Recipe
```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,
  prepTime: number,
  cookTime: number,
  servings: number,
  ingredients: string[],
  instructions: string[],
  createdBy: number,
  createdAt: timestamp
}
```

## Security Features

- **Password hashing** using PHP's `password_hash()`
- **Input validation** and sanitization
- **CORS protection** configured for frontend
- **User session management**
- **Authorization checks** for recipe modifications

## Development

### Running in Development Mode
```bash
# Frontend (React)
npm start          # Runs on http://localhost:3000

# Backend (XAMPP)
# Start Apache and MySQL through XAMPP Control Panel
# PHP files served from http://localhost/RECIPE-MANAGER/
```

### Code Style
- **ESLint** configuration for JavaScript
- **Consistent naming conventions**
- **Component-based architecture**
- **Separation of concerns** (services, utils, components)

### Adding New Features
1. **Frontend**: Add components in `src/components/` or pages in `src/pages/`
2. **Backend**: Add PHP endpoints in the XAMPP directory
3. **Services**: Update `authService.js` or `recipeService.js` for API calls
4. **Styling**: Add CSS files alongside components

## Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy the 'build' folder to your web server
```

### Backend Deployment
- Upload PHP files to your web server
- Update database credentials in `db.php`
- Ensure MySQL database is created with proper tables
- Configure CORS headers for your domain

## Troubleshooting

### Common Issues

#### "Unable to connect to server"
- Check if XAMPP Apache is running
- Verify the API_BASE_URL in authService.js
- Test PHP endpoints directly in browser

#### Database Connection Failed
- Ensure MySQL is running in XAMPP
- Check database credentials in db.php
- Verify database and table exist

#### CORS Errors
- Check that cors.php is included in all PHP files
- Verify frontend URL in CORS headers
- Clear browser cache

#### Recipe Not Saving
- Check browser console for JavaScript errors
- Verify localStorage is working
- Check form validation

### Debug Mode
Enable console logging by adding this to your React components:
```javascript
console.log('Debug info:', data);
```

For PHP debugging, add error reporting:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m "Add new feature"`
5. **Push to the branch**: `git push origin feature/new-feature`
6. **Submit a pull request**

### Development Guidelines
- Write clean, documented code
- Test on multiple browsers
- Follow existing code patterns
- Update README if adding new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Include error messages** and browser console logs

## Roadmap

### Upcoming Features
- [ ] Recipe images upload
- [ ] Recipe sharing and public recipes
- [ ] Meal planning functionality  
- [ ] Grocery list generation
- [ ] Recipe rating and reviews
- [ ] Mobile app (React Native)
- [ ] Recipe import from URLs
- [ ] Nutritional information
- [ ] Recipe collections/cookbooks

### Technical Improvements
- [ ] Move recipes to backend database
- [ ] Add user profile management
- [ ] Implement JWT authentication
- [ ] Add automated testing
- [ ] Progressive Web App features
- [ ] Performance optimizations

---

**Made with ❤️ for food lovers and home cooks**

*Happy Cooking! 🍳*