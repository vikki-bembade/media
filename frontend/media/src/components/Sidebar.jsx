import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Upload, Bell, User } from 'lucide-react';

const links = [
  { to: '/', label: 'Feed', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-56 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:block">
      <h2 className="mb-4 text-lg font-semibold text-white">Explore</h2>
      <div className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${location.pathname === to ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Icon size={16} /> {label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
