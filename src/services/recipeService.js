import { storage } from '../utils/storage';
import { generateId, validateRecipe, filterRecipes, sortRecipes } from '../utils/helpers';

export const recipeService = {
  // Get all recipes
  getAllRecipes: (searchTerm = '', category = '', sortBy = 'newest') => {
    try {
      const recipes = storage.getRecipes();
      const filtered = filterRecipes(recipes, searchTerm, category);
      return sortRecipes(filtered, sortBy);
    } catch (error) {
      console.error('Error getting recipes:', error);
      return [];
    }
  },

  // Get recipe by ID
  getRecipeById: (id) => {
    try {
      const recipes = storage.getRecipes();
      return recipes.find(recipe => recipe.id === id);
    } catch (error) {
      console.error('Error getting recipe by ID:', error);
      return null;
    }
  },

  // Create new recipe
  createRecipe: (recipeData, userId) => {
    try {
      // Validate recipe data
      const errors = validateRecipe(recipeData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const recipes = storage.getRecipes();
      
      const newRecipe = {
        id: generateId(),
        title: recipeData.title.trim(),
        description: recipeData.description ? recipeData.description.trim() : '',
        category: recipeData.category,
        prepTime: recipeData.prepTime || '0',
        cookTime: recipeData.cookTime || '0',
        servings: recipeData.servings || '1',
        ingredients: recipeData.ingredients.filter(ing => ing.trim().length > 0),
        instructions: recipeData.instructions.filter(inst => inst.trim().length > 0),
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      recipes.push(newRecipe);
      storage.saveRecipes(recipes);

      return { success: true, recipe: newRecipe };
    } catch (error) {
      console.error('Error creating recipe:', error);
      return { success: false, errors: ['Failed to create recipe. Please try again.'] };
    }
  },

  // Update existing recipe
  updateRecipe: (id, recipeData, userId) => {
    try {
      // Validate recipe data
      const errors = validateRecipe(recipeData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const recipes = storage.getRecipes();
      const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
      
      if (recipeIndex === -1) {
        return { success: false, errors: ['Recipe not found'] };
      }

      const existingRecipe = recipes[recipeIndex];
      
      // Check if user owns the recipe (basic authorization)
      if (existingRecipe.createdBy !== userId) {
        return { success: false, errors: ['You can only edit your own recipes'] };
      }

      const updatedRecipe = {
        ...existingRecipe,
        title: recipeData.title.trim(),
        description: recipeData.description ? recipeData.description.trim() : '',
        category: recipeData.category,
        prepTime: recipeData.prepTime || '0',
        cookTime: recipeData.cookTime || '0',
        servings: recipeData.servings || '1',
        ingredients: recipeData.ingredients.filter(ing => ing.trim().length > 0),
        instructions: recipeData.instructions.filter(inst => inst.trim().length > 0),
        updatedAt: new Date().toISOString()
      };

      recipes[recipeIndex] = updatedRecipe;
      storage.saveRecipes(recipes);

      return { success: true, recipe: updatedRecipe };
    } catch (error) {
      console.error('Error updating recipe:', error);
      return { success: false, errors: ['Failed to update recipe. Please try again.'] };
    }
  },

  // Delete recipe
  deleteRecipe: (id, userId) => {
    try {
      const recipes = storage.getRecipes();
      const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
      
      if (recipeIndex === -1) {
        return { success: false, error: 'Recipe not found' };
      }

      const recipe = recipes[recipeIndex];
      
      // Check if user owns the recipe
      if (recipe.createdBy !== userId) {
        return { success: false, error: 'You can only delete your own recipes' };
      }

      recipes.splice(recipeIndex, 1);
      storage.saveRecipes(recipes);

      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return { success: false, error: 'Failed to delete recipe. Please try again.' };
    }
  },

  // Get recipes by user
  getRecipesByUser: (userId) => {
    try {
      const recipes = storage.getRecipes();
      return recipes.filter(recipe => recipe.createdBy === userId);
    } catch (error) {
      console.error('Error getting user recipes:', error);
      return [];
    }
  },

  // Get recipes by category
  getRecipesByCategory: (category) => {
    try {
      const recipes = storage.getRecipes();
      return recipes.filter(recipe => recipe.category === category);
    } catch (error) {
      console.error('Error getting recipes by category:', error);
      return [];
    }
  },

  // Search recipes
  searchRecipes: (query) => {
    try {
      const recipes = storage.getRecipes();
      const searchTerm = query.toLowerCase().trim();
      
      return recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.category.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm)
        )
      );
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  },

  // Get recipe statistics
  getRecipeStats: (userId) => {
    try {
      const recipes = storage.getRecipes();
      const userRecipes = recipes.filter(recipe => recipe.createdBy === userId);
      const categories = storage.getCategories();
      
      const categoryStats = categories.map(category => ({
        category,
        count: userRecipes.filter(recipe => recipe.category === category).length
      }));

      return {
        totalRecipes: userRecipes.length,
        categoriesUsed: categoryStats.filter(stat => stat.count > 0).length,
        categoryBreakdown: categoryStats,
        averagePrepTime: userRecipes.length > 0 ? 
          Math.round(userRecipes.reduce((sum, recipe) => sum + (parseInt(recipe.prepTime) || 0), 0) / userRecipes.length) : 0
      };
    } catch (error) {
      console.error('Error getting recipe stats:', error);
      return {
        totalRecipes: 0,
        categoriesUsed: 0,
        categoryBreakdown: [],
        averagePrepTime: 0
      };
    }
  }
};