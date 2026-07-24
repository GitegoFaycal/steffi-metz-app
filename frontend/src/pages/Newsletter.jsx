import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { submitNewsletter } from '../api/index';
import { getSettings } from '../api/settingsApi';

const defaultSettings = {
  newsletter_title: 'Recipes & offers, in your inbox',
  newsletter_description:
    'Exclusive recipes, product launches and event invitations — no spam, just handmade goodness.',
};

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data.settings || defaultSettings);
      } catch (error) {
        console.error('Failed to load newsletter settings:', error);
      }
    }

    loadSettings();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await submitNewsletter(email);
      setMessage('Thank you for subscribing.');
      setEmail('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-olive-dark text-white py-20">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <p className="text-[.65rem] uppercase tracking-[.25em] text-orange-200/60 mb-5">
          Stay inspired
        </p>

        <h2 className="font-serif text-4xl md:text-5xl leading-tight text-cream">
          {settings.newsletter_title || defaultSettings.newsletter_title}
        </h2>

        <p className="text-white/50 max-w-xl mx-auto mt-5 leading-8 text-sm font-light">
          {settings.newsletter_description ||
            defaultSettings.newsletter_description}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 bg-white/10 border border-white/10 flex items-center px-4">
            <Mail size={16} className="text-white/40 mr-3" />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent outline-none text-white placeholder:text-white/35 py-4 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-bordeaux text-white px-7 py-4 uppercase tracking-[.18em] text-xs hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p className="text-sm text-orange-100 mt-4">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}