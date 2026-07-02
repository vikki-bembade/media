import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Upload, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-white">
          MediaHub
        </Link>
        <div className="flex items-center gap-4 text-slate-300">
          <Link to="/" className="flex items-center gap-1 hover:text-white"><Home size={18} /> Home</Link>
          <Link to="/search" className="flex items-center gap-1 hover:text-white"><Search size={18} /> Search</Link>
          <Link to="/upload" className="flex items-center gap-1 hover:text-white"><Upload size={18} /> Upload</Link>
          <Link to="/notifications" className="flex items-center gap-1 hover:text-white"><Bell size={18} /> Alerts</Link>
          <Link to={`/profile/${user?._id || ''}`} className="flex items-center gap-1 hover:text-white"><User size={18} /> Profile</Link>
          <button onClick={handleLogout} className="flex items-center gap-1 hover:text-white"><LogOut size={18} /> Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
