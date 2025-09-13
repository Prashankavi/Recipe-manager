import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import AddEditRecipe from './pages/AddEditRecipe';
import Categories from './pages/Categories';
import Login from './pages/Login';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (loading) {
    return <div className="loading-app">Loading...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated && (
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
      )}
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Home /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/recipe/:id" 
            element={
              isAuthenticated ? 
              <RecipeDetail /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/add-recipe" 
            element={
              isAuthenticated ? 
              <AddEditRecipe /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/edit-recipe/:id" 
            element={
              isAuthenticated ? 
              <AddEditRecipe /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/categories" 
            element={
              isAuthenticated ? 
              <Categories /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;