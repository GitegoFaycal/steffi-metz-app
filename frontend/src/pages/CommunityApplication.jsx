import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { submitCommunityApplication } from '../api/communityApplicationsApi';

const initialForm = {
  full_name: '',
  phone: '',
  email: '',
  product_idea: '',
  brings_own_product: 'yes',
  willing_to_pay_product_cost: 'no',
  preferred_date: '',
  message: '',
  agreed_to_terms: false,
};

export default function CommunityApplication() {
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type == 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setNotice('');

    try {
      await submitCommunityApplication(form);

      setNotice(
        'Application submitted successfully. We will review it and contact selected applicants.'
      );

      setForm(initialForm);
    } catch (error) {
      setNotice(
        error.response?.data?.message || 'Failed to submit application.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-cream pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-bordeaux underline mb-8"
        >
          <ArrowLeft size={16} />
          Back home
        </Link>

        <p className="text-xs uppercase tracking-[.25em] text-bordeaux">
          Cook With Us
        </p>

        <h1 className="font-serif text-5xl text-olive-dark mt-3">
          Community Application
        </h1>

        <p className="text-stone-600 leading-7 mt-5 max-w-3xl">
          Apply to cook with us for one session. Applications are reviewed first,
          and submitting this form does not guarantee approval. Approved
          applicants may bring their own product or ingredients, or pay the cost
          of the product needed for the session. Each application is valid for
          one session only.
        </p>

        <div className="bg-white border border-stone-200 p-6 mt-8">
          <h2 className="font-serif text-2xl text-olive-dark mb-4">
            Conditions
          </h2>

          <ul className="grid gap-3 text-sm text-stone-600 leading-6">
            <li>• You must apply online before joining.</li>
            <li>• We choose who joins after reviewing applications.</li>
            <li>• The application is for one cooking session only.</li>
            <li>• To join another session, you must apply again.</li>
            <li>• You may bring your own product or ingredients.</li>
            <li>• If you do not bring your own product, you may pay the product cost.</li>
            <li>• Approved applicants will be contacted by WhatsApp or email.</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 p-6 mt-8 grid gap-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="input mt-2"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                WhatsApp / Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="input mt-2"
                placeholder="+250..."
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input mt-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                Preferred Session Date
              </label>
              <input
                type="date"
                name="preferred_date"
                value={form.preferred_date}
                onChange={handleChange}
                className="input mt-2"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-stone-500">
              Product or Food Idea
            </label>
            <input
              name="product_idea"
              value={form.product_idea}
              onChange={handleChange}
              className="input mt-2"
              placeholder="What would you like to cook or bring?"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                Will you bring your own product?
              </label>
              <select
                name="brings_own_product"
                value={form.brings_own_product}
                onChange={handleChange}
                className="input mt-2"
              >
                <option value="yes">Yes, I will bring it</option>
                <option value="no">No, I will not bring it</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-stone-500">
                If not, can you pay product cost?
              </label>
              <select
                name="willing_to_pay_product_cost"
                value={form.willing_to_pay_product_cost}
                onChange={handleChange}
                className="input mt-2"
              >
                <option value="yes">Yes, I can pay</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-stone-500">
              Why do you want to cook with us?
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="input mt-2"
              placeholder="Tell us about your interest..."
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-stone-600 leading-6">
            <input
              type="checkbox"
              name="agreed_to_terms"
              checked={form.agreed_to_terms}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <span>
              I understand that this application is for one session only, does
              not guarantee approval, and I must apply again for another future
              session.
            </span>
          </label>

          {notice && (
            <p className="text-sm text-olive-dark">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-bordeaux text-white px-7 py-4 uppercase tracking-[.18em] text-xs font-semibold hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </section>
  );
}