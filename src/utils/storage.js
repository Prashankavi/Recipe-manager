// Local Storage utilities for data persistence

export const storage = {
  // Generic storage methods
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Specific methods for our app
  getRecipes: () => {
    return storage.get('recipes') || [];
  },

  saveRecipes: (recipes) => {
    storage.set('recipes', recipes);
  },

  getCategories: () => {
    const defaultCategories = [
      'Breakfast',
      'Lunch', 
      'Dinner',
      'Dessert',
      'Snack',
      'Vegetarian',
      'Quick & Easy'
    ];
    return storage.get('categories') || defaultCategories;
  },

  saveCategories: (categories) => {
    storage.set('categories', categories);
  },

  getCurrentUser: () => {
    return storage.get('currentUser');
  },

  saveCurrentUser: (user) => {
    storage.set('currentUser', user);
  },

  getUsers: () => {
    return storage.get('users') || [];
  },

  saveUsers: (users) => {
    storage.set('users', users);
  },

  // Initialize default data
  initializeData: () => {
    // Initialize categories if they don't exist
    if (!storage.get('categories')) {
      storage.saveCategories([
        'Breakfast',
        'Lunch', 
        'Dinner',
        'Dessert',
        'Snack',
        'Vegetarian',
        'Quick & Easy'
      ]);
    }

    // Initialize users if they don't exist
    if (!storage.get('users')) {
      storage.saveUsers([]);
    }

    // Initialize recipes if they don't exist
    if (!storage.get('recipes')) {
      const sampleRecipes = [
        {
          id: '1',
          title: 'Classic Pancakes',
          description: 'Fluffy and delicious pancakes perfect for breakfast',
          category: 'Breakfast',
          prepTime: '10',
          cookTime: '15',
          servings: '4',
          ingredients: [
            '2 cups all-purpose flour',
            '2 tablespoons sugar',
            '2 teaspoons baking powder',
            '1/2 teaspoon salt',
            '2 eggs',
            '1 1/2 cups milk',
            '1/4 cup melted butter'
          ],
          instructions: [
            'Mix dry ingredients in a large bowl',
            'Whisk eggs, milk, and melted butter in another bowl',
            'Combine wet and dry ingredients until just mixed',
            'Heat a lightly oiled griddle over medium-high heat',
            'Pour batter onto the griddle and cook until bubbles form',
            'Flip and cook until golden brown'
          ],
          createdBy: 'demo',
          createdAt: new Date().toISOString()
        }
      ];
      storage.saveRecipes(sampleRecipes);
    }
  }
};