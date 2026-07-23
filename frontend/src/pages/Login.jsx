import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: 'admin@steffi.com',
    password: 'admin123',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid login details'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-linen flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white border border-olive/10 rounded-xl p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Admin Access
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Login
        </h1>

        <p className="text-stone-600 text-sm leading-7 mt-3">
          Enter your admin credentials to access the website dashboard.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-7">
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          {error && (
            <p className="text-sm text-bordeaux">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}