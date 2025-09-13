// src/pages/AddEditRecipe.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import { parseIngredients, parseInstructions } from '../utils/helpers';
import './AddEditRecipe.css';

const AddEditRecipe = () => {
const { id } = useParams();
const navigate = useNavigate();
const isEditing = Boolean(id);

const [formData, setFormData] = useState({
title: '',
description: '',
category: '',
prepTime: '',
cookTime: '',
servings: '4',
ingredients: [''],
instructions: ['']
});

const [categories, setCategories] = useState([]);
const [errors, setErrors] = useState([]);
const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(isEditing);

useEffect(() => {
loadCategories();
if (isEditing) {
loadRecipe();
}
}, [id, isEditing]);

const loadCategories = () => {
const allCategories = storage.getCategories();
setCategories(allCategories);
};

const loadRecipe = () => {
const recipe = recipeService.getRecipeById(id);

if (recipe) {
const currentUser = authService.getCurrentUser();

// Check if user owns the recipe
if (!currentUser || recipe.createdBy !== currentUser.id) {
navigate('/', {
state: {
message: 'You can only edit your own recipes',
type: 'error'
}
});
return;
}

setFormData({
title: recipe.title,
description: recipe.description || '',
category: recipe.category,
prepTime: recipe.prepTime,
cookTime: recipe.cookTime,
servings: recipe.servings,
ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
instructions: recipe.instructions.length > 0 ? recipe.instructions : ['']
});
} else {
navigate('/');
}

setInitialLoading(false);
};

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({
...prev,
[name]: value
}));

// Clear errors when user starts typing
if (errors.length > 0) {
setErrors([]);
}
};

const handleIngredientChange = (index, value) => {
const newIngredients = [...formData.ingredients];
newIngredients[index] = value;
setFormData(prev => ({
...prev,
ingredients: newIngredients
}));
};

const addIngredient = () => {
setFormData(prev => ({
...prev,
ingredients: [...prev.ingredients, '']
}));
};

const removeIngredient = (index) => {
if (formData.ingredients.length > 1) {
const newIngredients = formData.ingredients.filter((_, i) => i !== index);
setFormData(prev => ({
...prev,
ingredients: newIngredients
}));
}
};

const handleInstructionChange = (index, value) => {
const newInstructions = [...formData.instructions];
newInstructions[index] = value;
setFormData(prev => ({
...prev,
instructions: newInstructions
}));
};

const addInstruction = () => {
setFormData(prev => ({
...prev,
instructions: [...prev.instructions, '']
}));
};

const removeInstruction = (index) => {
if (formData.instructions.length > 1) {
const newInstructions = formData.instructions.filter((_, i) => i !== index);
setFormData(prev => ({
...prev,
instructions: newInstructions
}));
}
};

const handleBulkIngredients = (text) => {
const ingredients = parseIngredients(text);
setFormData(prev => ({
...prev,
ingredients: ingredients.length > 0 ? ingredients : ['']
}));
};

const handleBulkInstructions = (text) => {
const instructions = parseInstructions(text);
setFormData(prev => ({
...prev,
instructions: instructions.length > 0 ? instructions : ['']
}));
};

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setErrors([]);

const currentUser = authService.getCurrentUser();
if (!currentUser) {
setErrors(['You must be logged in to save recipes']);
setLoading(false);
return;
}

// Clean up the data
const cleanData = {
...formData,
ingredients: formData.ingredients.filter(ing => ing.trim().length > 0),
instructions: formData.instructions.filter(inst => inst.trim().length > 0)
};

try {
let result;
if (isEditing) {
result = recipeService.updateRecipe(id, cleanData, currentUser.id);
} else {
result = recipeService.createRecipe(cleanData, currentUser.id);
}

if (result.success) {
navigate(`/recipe/${result.recipe.id}`, {
state: {
message: isEditing ? 'Recipe updated successfully!' : 'Recipe created successfully!',
type: 'success'
}
});
} else {
setErrors(result.errors || ['Failed to save recipe']);
}
} catch (error) {
console.error('Error saving recipe:', error);
setErrors(['An unexpected error occurred. Please try again.']);
}

setLoading(false);
};

if (initialLoading) {
return (
<div className="container">
<div className="loading-spinner">
<div className="spinner"></div>
</div>
</div>
);
}

return (
<div className="add-edit-recipe-page">
<div className="container">
{/* Header */}
<div className="page-header">
<Link to={isEditing ? `/recipe/${id}` : '/'} className="back-btn">
← {isEditing ? 'Back to Recipe' : 'Back to Home'}
</Link>
<h1>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h1>
</div>

{/* Form */}
<form onSubmit={handleSubmit} className="recipe-form">
{errors.length > 0 && (
<div className="error-message">
<ul>
{errors.map((error, index) => (
<li key={index}>{error}</li>
))}
</ul>
</div>
)}

<div className="form-grid">
{/* Basic Information */}
<div className="form-section">
<h2>Basic Information</h2>

<div className="form-group">
<label htmlFor="title" className="form-label">
Recipe Title *
</label>
<input
type="text"
id="title"
name="title"
value={formData.title}
onChange={handleInputChange}
className="form-input"
placeholder="Enter recipe title"
required
/>
</div>

<div className="form-group">
<label htmlFor="description" className="form-label">
Description
</label>
<textarea
id="description"
name="description"
// Completion of src/pages/AddEditRecipe.js (from where it cut off)

                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Brief description of the recipe"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="servings" className="form-label">
                  Servings *
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  max="50"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prepTime" className="form-label">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="15"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cookTime" className="form-label">
                  Cook Time (minutes)
                </label>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="form-section">
            <h2>Ingredients</h2>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input-group">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="form-input"
                  placeholder="e.g., 2 cups flour"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn btn-danger btn-sm"
                  disabled={formData.ingredients.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="btn btn-secondary add-btn"
            >
              + Add Ingredient
            </button>

            <details className="bulk-input">
              <summary>Bulk Add Ingredients</summary>
              <textarea
                className="form-textarea"
                placeholder="Paste ingredients here, one per line&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
                rows="6"
                onChange={(e) => handleBulkIngredients(e.target.value)}
              />
              <small>Paste multiple ingredients, one per line. This will replace all current ingredients.</small>
            </details>
          </div>

          {/* Instructions Section */}
          <div className="form-section">
            <h2>Instructions</h2>
            
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="instruction-input-group">
                <div className="step-number">{index + 1}</div>
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className="form-textarea"
                  placeholder="Describe this step..."
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="btn btn-danger btn-sm"
                  disabled={formData.instructions.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addInstruction}
              className="btn btn-secondary add-btn"
            >
              + Add Step
            </button>

            <details className="bulk-input">
              <summary>Bulk Add Instructions</summary>
              <textarea
                className="form-textarea"
                placeholder="Paste instructions here, one per line&#10;1. Mix dry ingredients&#10;2. Add wet ingredients&#10;3. Bake for 25 minutes"
                rows="6"
                onChange={(e) => handleBulkInstructions(e.target.value)}
              />
              <small>Paste multiple instructions, one per line. Numbers will be automatically handled.</small>
            </details>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Link 
            to={isEditing ? `/recipe/${id}` : '/'} 
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Recipe' : 'Create Recipe'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddEditRecipe;