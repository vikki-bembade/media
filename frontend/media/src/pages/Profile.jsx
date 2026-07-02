import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadProfile = async () => {
    const { data } = await api.get(`/users/profile/${id || 'me'}`);
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleFollow = async () => {
    const isFollowing = profile?.followers?.some((followerId) => followerId.toString() === user?._id);
    if (isFollowing) {
      await api.post(`/users/unfollow/${profile._id}`);
    } else {
      await api.post(`/users/follow/${profile._id}`);
    }
    loadProfile();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{profile?.name}</h1>
            <p className="text-slate-400">@{profile?.username}</p>
            <p className="mt-2 text-sm">{profile?.bio || 'No bio yet'}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{profile?.followers?.length || 0} followers</span>
            <span>{profile?.following?.length || 0} following</span>
            <span>{profile?.posts?.length || 0} posts</span>
            {profile?._id !== user?._id && (
              <button onClick={handleFollow} className="rounded-full bg-sky-600 px-3 py-1 text-white">{profile?.followers?.some((followerId) => followerId.toString() === user?._id) ? 'Unfollow' : 'Follow'}</button>
            )}
            {profile?._id === user?._id && <Link to="/edit-profile" className="rounded-full bg-slate-800 px-3 py-1 text-white">Edit profile</Link>}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {profile?.posts?.map((post) => (
            <div key={post._id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              {post.mediaType === 'image' ? <img src={`http://localhost:5000${post.media}`} alt="post" className="h-48 w-full object-cover" /> : <video controls src={`http://localhost:5000${post.media}`} className="h-48 w-full object-cover" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
