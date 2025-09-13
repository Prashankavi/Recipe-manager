// src/pages/RecipeDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { authService } from '../services/authService';
import { formatTime, formatDate, getTotalTime } from '../utils/helpers';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = () => {
    setLoading(true);
    setError('');

    const recipeData = recipeService.getRecipeById(id);
    
    if (recipeData) {
      setRecipe(recipeData);
    } else {
      setError('Recipe not found');
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError('You must be logged in to delete recipes');
      return;
    }

    setDeleting(true);
    
    const result = recipeService.deleteRecipe(id, currentUser.id);
    
    if (result.success) {
      navigate('/', { 
        state: { 
          message: 'Recipe deleted successfully!',
          type: 'success'
        }
      });
    } else {
      setError(result.error);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const canUserEdit = () => {
    const currentUser = authService.getCurrentUser();
    return currentUser && recipe && currentUser.id === recipe.createdBy;
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

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Oops!</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Recipe Not Found</h2>
          <p>The recipe you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const totalTime = getTotalTime(recipe.prepTime, recipe.cookTime);

  return (
    <div className="recipe-detail-page">
      <div className="container">
        {/* Back Button */}
        <div className="recipe-navigation">
          <Link to="/" className="back-btn">
            ← Back to Recipes
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="recipe-header">
          <div className="recipe-title-section">
            <span className="category-badge">{recipe.category}</span>
            <h1 className="recipe-title">{recipe.title}</h1>
            {recipe.description && (
              <p className="recipe-description">{recipe.description}</p>
            )}
            <div className="recipe-meta">
              <span className="meta-item">
                ⏱️ Prep: {formatTime(recipe.prepTime)}
              </span>
              <span className="meta-item">
                🔥 Cook: {formatTime(recipe.cookTime)}
              </span>
              <span className="meta-item">
                ⏰ Total: {formatTime(totalTime)}
              </span>
              <span className="meta-item">
                👥 Serves: {recipe.servings}
              </span>
            </div>
            <div className="recipe-date">
              Created on {formatDate(recipe.createdAt)}
            </div>
          </div>
        </div>

        <div className="recipe-content">
          {/* Ingredients Section */}
          <div className="recipe-section">
            <div className="section-header">
              <h2>Ingredients</h2>
              <span className="ingredient-count">
                {recipe.ingredients.length} items
              </span>
            </div>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-text">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="recipe-section">
            <div className="section-header">
              <h2>Instructions</h2>
              <span className="step-count">
                {recipe.instructions.length} steps
              </span>
            </div>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="instruction-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="instruction-text">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        {canUserEdit() && (
          <div className="recipe-actions">
            <Link 
              to={`/edit-recipe/${recipe.id}`} 
              className="btn btn-primary"
            >
              ✏️ Edit Recipe
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
              disabled={deleting}
            >
              🗑️ Delete Recipe
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Recipe</h3>
            <p>
              Are you sure you want to delete "<strong>{recipe.title}</strong>"? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;