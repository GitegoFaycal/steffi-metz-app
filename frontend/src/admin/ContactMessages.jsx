import { useEffect, useState } from 'react';
import { MailOpen, Search, Trash2 } from 'lucide-react';
import {
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  searchContactMessages,
} from '../api/contactApi';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data.messages || data.data || data || []);
    } catch (error) {
      console.error('Failed to load contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!keyword.trim()) {
      loadMessages();
      return;
    }

    try {
      const data = await searchContactMessages(keyword);
      setMessages(data.messages || data.data || data || []);
    } catch (error) {
      console.error('Failed to search messages:', error);
    }
  };

  const handleView = async (message) => {
    try {
      const isRead = message.is_read || message.status === 'read';

      if (!isRead) {
        await markMessageAsRead(message.id);
      }

      await loadMessages();

      setSelectedMessage({
        ...message,
        is_read: true,
        status: 'read',
      });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      setSelectedMessage(message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this message?');

    if (!confirmed) return;

    try {
      await deleteContactMessage(id);
      setSelectedMessage(null);
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-olive/10 rounded-xl p-8">
        <p className="text-stone-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Inbox
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Contact Messages
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          View, search, mark as read, and delete messages submitted from the
          public website contact form.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-olive/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, email, subject..."
          className="input flex-1"
        />

        <button
          type="submit"
          className="bg-bordeaux text-white px-5 py-3 rounded uppercase tracking-wider text-xs hover:bg-[#b03358] transition inline-flex items-center justify-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
      </form>

      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-7">
        {/* Messages Table */}
        <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Messages
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Sender</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((message) => {
                const isRead =
                  message.is_read || message.status === 'read';

                return (
                  <tr key={message.id} className="border-b border-olive/10">
                    <td className="py-4">
                      <p className="font-medium text-olive-dark">
                        {message.name}
                      </p>

                      <p className="text-xs text-stone-500">
                        {message.email}
                      </p>
                    </td>

                    <td>{message.subject || 'No subject'}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          isRead
                            ? 'bg-stone-100 text-stone-500'
                            : 'bg-bordeaux text-white'
                        }`}
                      >
                        {isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>

                    <td className="text-stone-500">
                      {message.created_at
                        ? new Date(
                            message.created_at
                          ).toLocaleDateString()
                        : '-'}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleView(message)}
                        className="text-bordeaux hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {messages.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-stone-500"
                  >
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Details */}
        <div className="bg-white border border-olive/10 rounded-xl p-6">
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Message Details
          </h2>

          {!selectedMessage ? (
            <p className="text-stone-500 text-sm">
              Select a message to view details.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-stone-500">
                    Name
                  </p>
                  <p>{selectedMessage.name}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-stone-500">
                    Email
                  </p>
                  <p>{selectedMessage.email}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-[.16em] text-stone-500">
                      Phone
                    </p>
                    <p>{selectedMessage.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-stone-500">
                    Subject
                  </p>
                  <p>{selectedMessage.subject || 'No subject'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[.16em] text-stone-500">
                    Message
                  </p>
                  <p className="leading-7 whitespace-pre-wrap mt-2">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex items-center gap-2 bg-olive text-white px-4 py-2 rounded text-xs uppercase tracking-wider hover:bg-olive-dark transition"
                >
                  <MailOpen size={16} />
                  Reply
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(selectedMessage.id)
                  }
                  className="inline-flex items-center gap-2 border border-bordeaux text-bordeaux px-4 py-2 rounded text-xs uppercase tracking-wider hover:bg-bordeaux hover:text-white transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}