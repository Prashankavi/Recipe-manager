// src/services/authService.js
// Update this to match your actual XAMPP folder structure
// Common examples:
// const API_BASE_URL = 'http://localhost/recipe-manager/src/pages';
// const API_BASE_URL = 'http://localhost/recipe_manager/src/pages';
// const API_BASE_URL = 'http://localhost/src/pages';
const API_BASE_URL = 'http://localhost/RECIPE-MANAGER/src/pages'; // ← Change this to your actual path

class AuthService {
  constructor() {
    this.currentUser = this.loadUserFromStorage();
  }

  // Load user from localStorage on service initialization
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }

  // Save user to localStorage
  saveUserToStorage(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Remove user from localStorage
  removeUserFromStorage() {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  }

  // Make API request with proper error handling
  async makeApiRequest(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API request error (${endpoint}):`, error);
      
      // Return a standardized error response
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check if the server is running.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }

  // Login method
  async login(email, password) {
    const result = await this.makeApiRequest('login.php', {
      email,
      password
    });

    if (result.success) {
      this.currentUser = result.user;
      this.saveUserToStorage(result.user);
    }

    return result;
  }

  // Register method
  async register(name, email, password) {
    const result = await this.makeApiRequest('register.php', {
      name,
      email,
      password
    });

    if (result.success) {
      // After successful registration, log the user in
      this.currentUser = result.user;
      this.saveUserToStorage(result.user);
    }

    return result;
  }

  // Logout method
  logout() {
    this.currentUser = null;
    this.removeUserFromStorage();
    return { success: true };
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Update current user data (useful after profile updates)
  updateCurrentUser(userData) {
    this.currentUser = { ...this.currentUser, ...userData };
    this.saveUserToStorage(this.currentUser);
  }

  // Validate token/session (if you implement JWT or session validation)
  async validateSession() {
    if (!this.currentUser) {
      return { success: false, error: 'No user session found' };
    }

    // You can implement server-side session validation here
    // For now, we'll just check if we have user data
    return { success: true, user: this.currentUser };
  }
}

// Export a singleton instance
export const authService = new AuthService();