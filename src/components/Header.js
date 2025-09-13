import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🍳</span>
              <span className="logo-text">Recipe Manager</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/add-recipe" 
              className={`nav-link ${isActive('/add-recipe') ? 'active' : ''}`}
            >
              Add Recipe
            </Link>
            <Link 
              to="/categories" 
              className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
            >
              Categories
            </Link>
          </nav>

          {/* User Menu */}
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">Hello, {currentUser?.name}!</span>
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/add-recipe" 
            className={`nav-link ${isActive('/add-recipe') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Add Recipe
          </Link>
          <Link 
            to="/categories" 
            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </Link>
          <button 
            className="mobile-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      <style jsx>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
        }

        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #333;
        }

        .logo-icon {
          font-size: 28px;
          margin-right: 10px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #667eea;
        }

        .desktop-nav {
          display: flex;
          gap: 30px;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .nav-link.active {
          background: #667eea;
          color: white;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-name {
          font-size: 14px;
          color: #666;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 25px;
          height: 20px;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background: #333;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-nav {
          display: none;
          flex-direction: column;
          gap: 10px;
          padding: 20px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.98);
        }

        .mobile-nav.active {
          display: flex;
        }

        .mobile-logout-btn {
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .desktop-nav,
          .user-info {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav .nav-link {
            padding: 12px 0;
            font-size: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }

          .mobile-nav .nav-link:last-of-type {
            border-bottom: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;