// src/pages/Categories.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { storage } from '../utils/storage';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    
    try {
      const allCategories = storage.getCategories();
      const allRecipes = recipeService.getAllRecipes();

      // Calculate recipe count for each category
      const statsWithCounts = allCategories.map(category => {
        const recipesInCategory = allRecipes.filter(recipe => recipe.category === category);
        return {
          category,
          count: recipesInCategory.length,
          recipes: recipesInCategory.slice(0, 3) // Show first 3 recipes as preview
        };
      });

      setCategories(allCategories);
      setCategoryStats(statsWithCounts);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    
    setLoading(false);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Breakfast': '🍳',
      'Lunch': '🥗',
      'Dinner': '🍽️',
      'Dessert': '🍰',
      'Snack': '🍿',
      'Vegetarian': '🥕',
      'Quick & Easy': '⚡',
      'Appetizer': '🥨',
      'Main Course': '🍖',
      'Side Dish': '🥔',
      'Soup': '🍲',
      'Salad': '🥬',
      'Beverage': '🥤',
      'Baking': '👨‍🍳'
    };
    return iconMap[category] || '🍴';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1>Recipe Categories</h1>
          <p>Browse recipes by category to find exactly what you're looking for</p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categoryStats.map((stat, index) => (
            <div key={stat.category} className="category-card">
              <div className="category-header">
                <div className="category-icon">
                  {getCategoryIcon(stat.category)}
                </div>
                <div className="category-info">
                  <h3 className="category-name">{stat.category}</h3>
                  <span className="recipe-count">
                    {stat.count} {stat.count === 1 ? 'recipe' : 'recipes'}
                  </span>
                </div>
              </div>

              {stat.count > 0 && (
                <div className="category-preview">
                  <h4>Recent Recipes:</h4>
                  <ul className="recipe-preview-list">
                    {stat.recipes.map(recipe => (
                      <li key={recipe.id}>
                        <Link 
                          to={`/recipe/${recipe.id}`}
                          className="recipe-preview-link"
                        >
                          {recipe.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {stat.count > 3 && (
                    <p className="more-recipes">
                      and {stat.count - 3} more...
                    </p>
                  )}
                </div>
              )}

              <div className="category-footer">
                {stat.count > 0 ? (
                  <Link 
                    to={`/?category=${encodeURIComponent(stat.category)}`}
                    className="btn btn-primary btn-sm"
                  >
                    View All {stat.category} Recipes
                  </Link>
                ) : (
                  <Link
                    to="/add-recipe"
                    className="btn btn-secondary btn-sm"
                  >
                    Add First Recipe
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categoryStats.every(stat => stat.count === 0) && (
          <div className="empty-state">
            <h3>No recipes yet</h3>
            <p>Start building your recipe collection by adding your first recipe!</p>
            <Link to="/add-recipe" className="btn btn-primary">
              Add Your First Recipe
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="category-stats">
          <div className="stat-item">
            <span className="stat-number">
              {categoryStats.reduce((sum, stat) => sum + stat.count, 0)}
            </span>
            <span className="stat-label">Total Recipes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {categoryStats.filter(stat => stat.count > 0).length}
            </span>
            <span className="stat-label">Categories Used</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length}</span>
            <span className="stat-label">Total Categories</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/add-recipe" className="btn btn-primary">
            Add New Recipe
          </Link>
          <Link to="/" className="btn btn-secondary">
            Browse All Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;