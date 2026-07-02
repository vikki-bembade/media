import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const { data } = await api.get(`/users/search?q=${query}`);
      setUsers(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">Search users</h1>
        <input className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Search by name or username" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="space-y-3">
          {users.map((user) => (
            <Link key={user._id} to={`/profile/${user._id}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200">
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-slate-400">{user.name}</p>
              </div>
              <span className="text-sm text-sky-400">View profile</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
