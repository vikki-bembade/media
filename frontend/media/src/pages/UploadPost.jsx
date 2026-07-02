import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadPost = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('media', file);
    await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">Create post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
          <button className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default UploadPost;
