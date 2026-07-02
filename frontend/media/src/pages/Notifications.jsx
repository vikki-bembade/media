import { useEffect, useState } from 'react';
import api from '../services/api';

const Notifications = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/users/notifications');
      setItems(data);
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">Notifications</h1>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200">
              <p>{item.sender?.username} {item.type === 'follow' ? 'followed you' : item.type === 'like' ? 'liked your post' : 'commented on your post'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
