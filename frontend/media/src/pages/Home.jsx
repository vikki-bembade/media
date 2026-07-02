import { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const { user } = useAuth();

  const loadPosts = async () => {
    const { data } = await api.get('/posts/feed');
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = async (postId) => {
    const post = posts.find((item) => item._id === postId);
    const liked = post.likes?.some((id) => id.toString() === user?._id);
    if (liked) {
      await api.post(`/posts/${postId}/unlike`);
    } else {
      await api.post(`/posts/${postId}/like`);
    }
    loadPosts();
  };

  const handleComment = async (postId) => {
    const text = drafts[postId]?.trim();
    if (!text) return;
    await api.post(`/posts/${postId}/comments`, { text });
    setDrafts((prev) => ({ ...prev, [postId]: '' }));
    loadPosts();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex gap-6 px-4 py-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        {posts.map((post) => {
          const liked = post.likes?.some((id) => id.toString() === user?._id);
          return (
            <article key={post._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-200">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-semibold text-white">{post.user?.username?.[0]?.toUpperCase()}</div>
                <div>
                  <p className="font-semibold">{post.user?.username}</p>
                  <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {post.mediaType === 'image' ? <img src={`http://localhost:5000${post.media}`} alt="post" className="mb-3 w-full rounded-xl object-cover" /> : <video controls src={`http://localhost:5000${post.media}`} className="mb-3 w-full rounded-xl" />}
              <p className="mb-2 text-sm">{post.caption}</p>
              <div className="mb-3 flex gap-4 text-sm text-slate-400">
                <button onClick={() => handleLike(post._id)} className={`rounded-full px-3 py-1 ${liked ? 'bg-sky-600 text-white' : 'bg-slate-800'}`}>❤ {post.likes?.length || 0}</button>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
              <div className="space-y-2">
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="rounded-lg bg-slate-950 p-2 text-sm text-slate-300">
                    <span className="font-semibold text-white">{comment.user?.username}</span> {comment.text}
                  </div>
                ))}
                <div className="flex gap-2">
                  <input className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" placeholder="Write a comment" value={drafts[post._id] || ''} onChange={(e) => setDrafts((prev) => ({ ...prev, [post._id]: e.target.value }))} />
                  <button onClick={() => handleComment(post._id)} className="rounded-xl bg-sky-600 px-3 py-2 text-sm text-white">Post</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
