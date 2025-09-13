// External API service for recipe suggestions
// Note: This would require a real API key in production

const SPOONACULAR_API_KEY = 'your_api_key_here'; // Replace with actual API key
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const apiService = {
  // Get random recipe suggestions
  getRandomRecipes: async (number = 6) => {
    try {
      // Mock data for demo purposes since we don't have a real API key
      const mockRecipes = [
        {
          id: 'api_1',
          title: 'Spaghetti Carbonara',
          readyInMinutes: 30,
          servings: 4,
          image: 'https://via.placeholder.com/312x231?text=Carbonara',
          summary: 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
          extendedIngredients: [
            { original: '400g spaghetti' },
            { original: '200g pancetta, diced' },
            { original: '4 large eggs' },
            { original: '100g Parmesan cheese, grated' },
            { original: 'Black pepper to taste' }
          ],
          analyzedInstructions: [{
            steps: [
              { step: 'Cook spaghetti according to package instructions.' },
              { step: 'Fry pancetta until crispy.' },
              { step: 'Beat eggs with Parmesan cheese.' },
              { step: 'Toss hot pasta with pancetta and egg mixture.' },
              { step: 'Season with black pepper and serve immediately.' }
            ]
          }]
        },
        {
          id: 'api_2',
          title: 'Chicken Stir Fry',
          readyInMinutes: 20,
          servings: 4,
          image: 'https://via.placeholder.com/312x231?text=Stir+Fry',
          summary: 'Quick and healthy chicken stir fry with vegetables.',
          extendedIngredients: [
            { original: '500g chicken breast, sliced' },
            { original: '2 bell peppers, sliced' },
            { original: '1 onion, sliced' },
            { original: '2 cloves garlic, minced' },
            { original: '3 tbsp soy sauce' },
            { original: '2 tbsp vegetable oil' }
          ],
          analyzedInstructions: [{
            steps: [
              { step: 'Heat oil in a wok or large pan.' },
              { step: 'Cook chicken until browned and cooked through.' },
              { step: 'Add vegetables and garlic, stir fry for 3-4 minutes.' },
              { step: 'Add soy sauce and toss to combine.' },
              { step: 'Serve hot with rice.' }
            ]
          }]
        },
        {
          id: 'api_3',
          title: 'Chocolate Chip Cookies',
          readyInMinutes: 25,
          servings: 24,
          image: 'https://via.placeholder.com/312x231?text=Cookies',
          summary: 'Classic homemade chocolate chip cookies.',
          extendedIngredients: [
            { original: '2 cups all-purpose flour' },
            { original: '1 cup butter, softened' },
            { original: '3/4 cup brown sugar' },
            { original: '1/2 cup white sugar' },
            { original: '2 eggs' },
            { original: '2 cups chocolate chips' }
          ],
          analyzedInstructions: [{
            steps: [
              { step: 'Preheat oven to 375°F (190°C).' },
              { step: 'Cream butter and sugars together.' },
              { step: 'Beat in eggs one at a time.' },
              { step: 'Mix in flour gradually.' },
              { step: 'Fold in chocolate chips.' },
              { step: 'Bake for 9-11 minutes until golden brown.' }
            ]
          }]
        }
      ];

      return { success: true, recipes: mockRecipes };
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return { success: false, error: 'Failed to fetch recipe suggestions' };
    }
  },

  // Search recipes by ingredients
  searchByIngredients: async (ingredients, number = 6) => {
    try {
      // Mock response for demo
      const mockResults = [
        {
          id: 'search_1',
          title: 'Quick Pasta Salad',
          image: 'https://via.placeholder.com/312x231?text=Pasta+Salad',
          usedIngredientCount: 2,
          missedIngredientCount: 1
        }
      ];

      return { success: true, recipes: mockResults };
    } catch (error) {
      console.error('Error searching recipes by ingredients:', error);
      return { success: false, error: 'Failed to search recipes' };
    }
  },

  // Get recipe details by ID
  getRecipeDetails: async (id) => {
    try {
      // In a real implementation, this would make an API call
      // For demo, return null to indicate external recipe not available
      return { success: false, error: 'External recipe details not available in demo' };
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return { success: false, error: 'Failed to fetch recipe details' };
    }
  },

  // Convert external recipe to our format
  convertToLocalFormat: (apiRecipe, userId) => {
    try {
      const ingredients = apiRecipe.extendedIngredients ? 
        apiRecipe.extendedIngredients.map(ing => ing.original) : [];
      
      const instructions = apiRecipe.analyzedInstructions && 
        apiRecipe.analyzedInstructions[0] && 
        apiRecipe.analyzedInstructions[0].steps ? 
        apiRecipe.analyzedInstructions[0].steps.map(step => step.step) : [];

      return {
        title: apiRecipe.title,
        description: apiRecipe.summary ? 
          apiRecipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
        category: 'Imported',
        prepTime: '10',
        cookTime: apiRecipe.readyInMinutes ? apiRecipe.readyInMinutes.toString() : '30',
        servings: apiRecipe.servings ? apiRecipe.servings.toString() : '4',
        ingredients,
        instructions,
        source: 'Spoonacular API',
        originalId: apiRecipe.id
      };
    } catch (error) {
      console.error('Error converting recipe format:', error);
      return null;
    }
  },

  // Check if API is available
  isApiAvailable: () => {
    return SPOONACULAR_API_KEY && SPOONACULAR_API_KEY !== 'your_api_key_here';
  }
};