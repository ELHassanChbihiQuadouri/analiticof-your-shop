import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>AnaliticOf Your Shop</Link>
      </div>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>

        {!isLoggedIn && (
          <>
            <li><Link to="/signup" style={styles.link}>Sign Up</Link></li>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
          </>
        )}

        {isLoggedIn && (
          <>
            <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
            <li>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5de0e6',
    padding: '10px 20px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: '#ecf0f1',
    textDecoration: 'none',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    alignItems: 'center',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    color: '#ecf0f1',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Navbar;
