// src/pages/Login.js
import React, { useState } from 'react';
import { authService } from '../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
      }));
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ 
        ...prev, 
        general: '' 
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation (only for registration)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let result;
      
      if (isLogin) {
        result = await authService.login(formData.email, formData.password);
      } else {
        result = await authService.register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        // Clear form data on success
        setFormData({ name: '', email: '', password: '' });
        onLogin(result.user);
      } else {
        setErrors({ general: result.error || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>
      
      <div className={`login-container ${loading ? 'loading' : ''}`}>
        {/* Glass morphism header */}
        <div className="login-header">
          <div className="brand-logo">
            <div className="logo-icon">🍳</div>
            <h1>RecipeVault</h1>
          </div>
          <h2 className={`form-title ${isLogin ? 'slide-in-right' : 'slide-in-left'}`}>
            {isLogin ? "Welcome Back!" : "Join Our Community"}
          </h2>
          <p className="form-subtitle">
            {isLogin 
              ? "Your culinary journey continues here" 
              : "Start your delicious adventure with us"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message slide-down">
              <div className="error-icon">⚠️</div>
              {errors.general}
            </div>
          )}

          <div className="form-fields">
            {!isLogin && (
              <div className={`form-group ${formData.name ? 'filled' : ''} slide-in-up`} style={{ animationDelay: '0.1s' }}>
                <div className="input-container">
                  <div className="input-icon">👤</div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Full Name"
                    disabled={loading}
                  />
                  <label htmlFor="name" className="floating-label">Full Name</label>
                </div>
                {errors.name && (
                  <span className="field-error shake">{errors.name}</span>
                )}
              </div>
            )}

            <div className={`form-group ${formData.email ? 'filled' : ''} slide-in-up`} style={{ animationDelay: '0.2s' }}>
              <div className="input-container">
                <div className="input-icon">✉️</div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Email Address"
                  disabled={loading}
                  autoComplete="username"
                />
                <label htmlFor="email" className="floating-label">Email Address</label>
              </div>
              {errors.email && (
                <span className="field-error shake">{errors.email}</span>
              )}
            </div>

            <div className={`form-group ${formData.password ? 'filled' : ''} slide-in-up`} style={{ animationDelay: '0.3s' }}>
              <div className="input-container">
                <div className="input-icon">🔒</div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder={isLogin ? "Password" : "Create Password (min. 6 chars)"}
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <label htmlFor="password" className="floating-label">
                  {isLogin ? "Password" : "Create Password"}
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="field-error shake">{errors.password}</span>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary btn-full slide-in-up ${loading ? 'loading' : ''}`}
            style={{ animationDelay: '0.4s' }}
            disabled={loading}
          >
            <div className="btn-content">
              {loading && <div className="spinner"></div>}
              <span className="btn-text">
                {loading 
                  ? (isLogin ? "Signing you in..." : "Creating your account...") 
                  : (isLogin ? "Sign In" : "Create Account")
                }
              </span>
              {!loading && <div className="btn-arrow">→</div>}
            </div>
          </button>
        </form>

        <div className="login-footer slide-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="divider">
            <span>or</span>
          </div>
          <p className="toggle-text">
            {isLogin ? "New to RecipeVault?" : "Already have an account?"}
          </p>
          <button 
            type="button" 
            className="link-button"
            onClick={toggleMode}
            disabled={loading}
          >
            {isLogin ? "Create free account" : "Sign in instead"}
          </button>
          
          {isLogin && (
            <div className="features-preview">
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>Secure & Private</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">☁️</span>
                <span>Cloud Sync</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;