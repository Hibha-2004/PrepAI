import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PrepAI</Link>
      <div className="navbar-links">
        <span className="navbar-user">Hi, {user?.name}</span>
        <Link to="/history" className="navbar-link">History</Link>
        <button onClick={handleLogout} className="navbar-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;