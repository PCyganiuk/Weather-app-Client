import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

interface NavbarProps {
  buttons: string[];
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ buttons, isLoggedIn, handleLogout }) => {
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location, isLoggedIn]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">Weather Station</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarWeather" aria-controls="navbarWeather" aria-expanded={false} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarWeather">
          <ul className="navbar-nav mr-auto">
            {buttons.map((button, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={`/${button.replace(' ', '-').toLowerCase()}`}>{button}</Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav ml-auto">
            {isLoggedIn ? (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
