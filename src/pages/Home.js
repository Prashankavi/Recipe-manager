// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/recipeService';
import { storage } from '../utils/storage';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter and sort recipes whenever search criteria change
    const filtered = recipeService.getAllRecipes(searchTerm, selectedCategory, sortBy);
    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, selectedCategory, sortBy]);

  const loadData = () => {
    setLoading(true);
    try {
      // Initialize storage if needed
      storage.initializeData();
      
      const allRecipes = recipeService.getAllRecipes();
      const allCategories = storage.getCategories();
      
      setRecipes(allRecipes);
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
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
    <div className="home-page">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome to Recipe Manager</h1>
          <p>Discover, organize, and share your favorite recipes</p>
          <div className="quick-actions">
            <Link to="/add-recipe" className="btn btn-primary">
              ➕ Add New Recipe
            </Link>
            <Link to="/categories" className="btn btn-secondary">
              📂 Browse Categories
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{recipes.length}</div>
            <div className="stat-label">Total Recipes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{categories.length}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {filteredRecipes.length}
            </div>
            <div className="stat-label">Showing</div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Recipes Grid */}
        <div className="recipes-section">
          {filteredRecipes.length === 0 ? (
            <div className="empty-state">
              {searchTerm || selectedCategory ? (
                <>
                  <h3>No recipes found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <h3>No recipes yet</h3>
                  <p>Get started by adding your first recipe!</p>
                  <Link to="/add-recipe" className="btn btn-primary">
                    Add Your First Recipe
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="recipes-header">
                <h2>
                  {searchTerm || selectedCategory
                    ? `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''}`
                    : 'All Recipes'
                  }
                </h2>
              </div>
              <div className="recipes-grid">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;