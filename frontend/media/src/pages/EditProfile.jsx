import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', username: user?.username || '', bio: user?.bio || '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/users/profile', form);
    navigate(`/profile/${user?._id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">Edit profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
          <textarea className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" />
          <button className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;