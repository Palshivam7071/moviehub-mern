import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        <Link to="/" className={styles.logo}>MovieHub</Link>
        <nav className={styles.navLinks}>
          {user ? (
            <>
              <span className={styles.welcomeMessage}>
                Welcome, {user.name} {user.role === 'ADMIN' && '👑'}
              </span>
              <button onClick={handleLogout} className={styles.navButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Link to="/register" className={`${styles.navLink} ${styles.registerButton}`}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;