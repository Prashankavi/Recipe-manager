// src/components/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...', 
  overlay = false,
  fullPage = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    dark: 'spinner-dark'
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`;
  const containerClass = `spinner-container ${overlay ? 'spinner-overlay' : ''} ${fullPage ? 'spinner-fullpage' : ''}`;

  return (
    <div className={containerClass}>
      <div className="spinner-content">
        <div className={spinnerClass}>
          <div className="spinner-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;