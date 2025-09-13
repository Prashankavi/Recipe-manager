// src/components/RecipeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime, getTotalTime, truncate } from '../utils/helpers';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const totalTime = getTotalTime(recipe.prepTime, recipe.cookTime);

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <div className="recipe-category">
          <span className="category-badge">{recipe.category}</span>
        </div>
        <div className="recipe-meta">
          <span className="recipe-time">
            ⏱️ {formatTime(totalTime)}
          </span>
          <span className="recipe-servings">
            👥 {recipe.servings} servings
          </span>
        </div>
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-title">
          <Link to={`/recipe/${recipe.id}`} className="recipe-link">
            {recipe.title}
          </Link>
        </h3>
        
        {recipe.description && (
          <p className="recipe-description">
            {truncate(recipe.description, 120)}
          </p>
        )}

        <div className="recipe-ingredients-preview">
          <strong>Ingredients:</strong> {recipe.ingredients.slice(0, 3).join(', ')}
          {recipe.ingredients.length > 3 && ` and ${recipe.ingredients.length - 3} more...`}
        </div>
      </div>

      <div className="recipe-card-footer">
        <div className="recipe-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary btn-sm">
            View Recipe
          </Link>
          <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;