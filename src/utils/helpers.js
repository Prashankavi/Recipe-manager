// Helper utility functions

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time (e.g., "25 mins")
export const formatTime = (minutes) => {
  if (!minutes) return 'N/A';
  const mins = parseInt(minutes);
  if (mins < 60) {
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${hours}h ${remainingMins}m`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Search/filter recipes
export const filterRecipes = (recipes, searchTerm, selectedCategory) => {
  return recipes.filter(recipe => {
    const matchesSearch = !searchTerm || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Parse ingredients from text (for bulk adding)
export const parseIngredients = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Parse instructions from text (for bulk adding)
export const parseInstructions = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line, index) => {
      // Remove numbering if present
      const cleanLine = line.replace(/^\d+\.?\s*/, '');
      return cleanLine;
    });
};

// Validate recipe data
export const validateRecipe = (recipe) => {
  const errors = [];
  
  if (!recipe.title || recipe.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!recipe.category) {
    errors.push('Category is required');
  }
  
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  }
  
  if (!recipe.instructions || recipe.instructions.length === 0) {
    errors.push('At least one instruction is required');
  }
  
  return errors;
};

// Sort recipes by different criteria
export const sortRecipes = (recipes, sortBy) => {
  const sorted = [...recipes];
  
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'prepTime':
      return sorted.sort((a, b) => {
        const timeA = parseInt(a.prepTime) || 0;
        const timeB = parseInt(b.prepTime) || 0;
        return timeA - timeB;
      });
    default:
      return sorted;
  }
};

// Calculate total time
export const getTotalTime = (prepTime, cookTime) => {
  const prep = parseInt(prepTime) || 0;
  const cook = parseInt(cookTime) || 0;
  return prep + cook;
};  

export default { formatTime, isValidEmail, isValidPassword, filterRecipes, capitalize, truncate, parseIngredients, parseInstructions, validateRecipe, sortRecipes, getTotalTime };

