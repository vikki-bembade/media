import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-2xl font-semibold text-white">Create account</h1>
        <p className="mb-6 text-sm text-slate-400">Join MediaHub today</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white">Register</button>
        </form>
        <p className="mt-4 text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-400">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
