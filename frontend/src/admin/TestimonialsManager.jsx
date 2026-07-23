import { useEffect, useState } from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';
import FormInput from '../components/FormInput';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../api/testimonialsApi';

const emptyForm = {
  customer_name: '',
  customer_title: '',
  rating: 5,
  message: '',
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data.testimonials || data.data || data || []);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setNotice('');
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);

    setForm({
      customer_name: testimonial.customer_name || testimonial.name || '',
      customer_title: testimonial.customer_title || testimonial.title || '',
      rating: testimonial.rating || 5,
      message: testimonial.message || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice('');

    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
      };

      if (editingId) {
        await updateTestimonial(editingId, payload);
        setNotice('Testimonial updated successfully.');
      } else {
        await createTestimonial(payload);
        setNotice('Testimonial created successfully.');
      }

      resetForm();
      await loadTestimonials();
    } catch (error) {
      setNotice(
        error.response?.data?.message || 'Failed to save testimonial.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this testimonial?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteTestimonial(id);
      await loadTestimonials();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Customer Reviews
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Testimonials Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Add, update, and delete customer testimonials shown on the public
          website.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <h2 className="font-serif text-3xl text-olive-dark">
            {editingId ? 'Update Testimonial' : 'Add Testimonial'}
          </h2>

          <FormInput
            label="Customer Name"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="Customer name"
            required
          />

          <FormInput
            label="Customer Title"
            name="customer_title"
            value={form.customer_title}
            onChange={handleChange}
            placeholder="Regular customer, event guest..."
          />

          <div className="grid gap-2">
            <label
              htmlFor="rating"
              className="text-xs uppercase tracking-[.16em] text-stone-500"
            >
              Rating
            </label>

            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="input"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <FormInput
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            textarea
            rows={5}
            placeholder="Write testimonial message..."
            required
          />

          {notice && (
            <p className="text-sm text-olive-dark">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading
              ? 'Saving...'
              : editingId
                ? 'Update Testimonial'
                : 'Create Testimonial'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-bordeaux text-bordeaux px-6 py-3 rounded uppercase tracking-wider text-sm"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="bg-white border border-olive/10 rounded-xl p-6">
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Existing Testimonials
          </h2>

          {testimonials.length === 0 ? (
            <p className="text-stone-500 text-sm">
              No testimonials found.
            </p>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((testimonial) => {
                const customerName =
                  testimonial.customer_name || testimonial.name || 'Customer';

                const customerTitle =
                  testimonial.customer_title || testimonial.title || '';

                const rating = Number(testimonial.rating || 5);

                return (
                  <div
                    key={testimonial.id}
                    className="border border-olive/10 rounded-lg p-5 bg-cream"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-2xl text-olive-dark">
                          {customerName}
                        </h3>

                        {customerTitle && (
                          <p className="text-xs uppercase tracking-widest text-stone-500">
                            {customerTitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-bordeaux">
                        {Array.from({ length: rating }).map((_, index) => (
                          <Star key={index} size={15} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-stone-600 leading-7 mt-4">
                      {testimonial.message}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(testimonial)}
                        className="inline-flex items-center gap-1 text-bordeaux text-sm underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(testimonial.id)}
                        className="inline-flex items-center gap-1 text-stone-500 text-sm underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}