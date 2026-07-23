import { useEffect, useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import {
  getNewsletters,
  deleteNewsletter,
} from '../api/newsletterApi';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    try {
      const data = await getNewsletters();
      setSubscribers(data.newsletters || data.data || data || []);
    } catch (error) {
      console.error('Failed to load newsletter subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this subscriber?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteNewsletter(id);
      await loadSubscribers();
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-olive/10 rounded-xl p-8">
        <p className="text-stone-500">Loading newsletter subscribers...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Mailing List
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Newsletter Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          View and manage users who subscribed to website updates.
        </p>
      </div>

      <div className="bg-white border border-olive/10 rounded-xl p-6 mb-7">
        <p className="text-xs uppercase tracking-[.16em] text-stone-500">
          Total Subscribers
        </p>

        <h2 className="font-serif text-4xl text-olive-dark mt-2">
          {subscribers.length}
        </h2>
      </div>

      <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
        <h2 className="font-serif text-3xl text-olive-dark mb-5">
          Subscribers
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b">
              <th className="py-3">Email</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="border-b border-olive/10"
              >
                <td className="py-4">
                  <div className="flex items-center gap-2 text-olive-dark">
                    <Mail size={16} />
                    {subscriber.email}
                  </div>
                </td>

                <td className="text-stone-500">
                  {subscriber.created_at
                    ? new Date(subscriber.created_at).toLocaleDateString()
                    : '-'}
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(subscriber.id)}
                    className="inline-flex items-center gap-1 text-stone-500 underline"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {subscribers.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="py-8 text-center text-stone-500"
                >
                  No newsletter subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}