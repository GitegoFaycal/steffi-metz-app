import { useEffect, useState } from 'react';
import { Pencil, Trash2, BadgePlus } from 'lucide-react';
import FormInput from '../components/FormInput';
import {
  getAdminLoyaltyTiers,
  createLoyaltyTier,
  updateLoyaltyTier,
  deleteLoyaltyTier,
} from '../api/loyaltyApi';

const emptyForm = {
  icon: '',
  name: '',
  monthly_spend: '',
  discount: '',
  benefits: '',
  sort_order: 0,
  status: 'active',
};

export default function LoyaltyManager() {
  const [tiers, setTiers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTiers = async () => {
    try {
      const data = await getAdminLoyaltyTiers();
      setTiers(data.tiers || data.data || []);
    } catch (error) {
      console.error('Failed to load loyalty tiers:', error);
    }
  };

  useEffect(() => {
    loadTiers();
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

  const handleEdit = (tier) => {
    setEditingId(tier.id);

    setForm({
      icon: tier.icon || '',
      name: tier.name || '',
      monthly_spend: tier.monthly_spend || '',
      discount: tier.discount || '',
      benefits: tier.benefits || '',
      sort_order: tier.sort_order || 0,
      status: tier.status || 'active',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice('');

    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order || 0),
      };

      if (editingId) {
        await updateLoyaltyTier(editingId, payload);
        setNotice('Loyalty tier updated successfully.');
      } else {
        await createLoyaltyTier(payload);
        setNotice('Loyalty tier created successfully.');
      }

      resetForm();
      await loadTiers();
    } catch (error) {
      setNotice(
        error.response?.data?.message || 'Failed to save loyalty tier.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this loyalty tier?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteLoyaltyTier(id);
      await loadTiers();
    } catch (error) {
      console.error('Failed to delete loyalty tier:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Loyalty Programme
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Loyalty Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Manage membership tiers, discounts, monthly spend requirements, and
          benefits shown on the public loyalty section.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-bordeaux text-white flex items-center justify-center">
              <BadgePlus size={20} />
            </div>

            <h2 className="font-serif text-3xl text-olive-dark">
              {editingId ? 'Update Tier' : 'Add Tier'}
            </h2>
          </div>

          <FormInput
            label="Icon"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="🌱"
          />

          <FormInput
            label="Tier Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Gourmet Regular"
            required
          />

          <FormInput
            label="Monthly Spend"
            name="monthly_spend"
            value={form.monthly_spend}
            onChange={handleChange}
            placeholder="100,000 RWF/month"
          />

          <FormInput
            label="Discount"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="10%"
            required
          />

          <FormInput
            label="Benefits"
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            textarea
            rows={4}
            placeholder="10% off all boxes & products · Priority event booking"
          />

          <FormInput
            label="Sort Order"
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={handleChange}
            placeholder="1"
          />

          <div className="grid gap-2">
            <label
              htmlFor="status"
              className="text-xs uppercase tracking-[.16em] text-stone-500"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

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
                ? 'Update Tier'
                : 'Create Tier'}
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

        <div className="bg-white border border-olive/10 rounded-xl p-6 overflow-x-auto">
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Existing Loyalty Tiers
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Tier</th>
                <th>Monthly Spend</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.id} className="border-b border-olive/10">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {tier.icon || '★'}
                      </span>

                      <div>
                        <p className="font-medium text-olive-dark">
                          {tier.name}
                        </p>

                        <p className="text-xs text-stone-500 max-w-xs">
                          {tier.benefits}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-stone-600">
                    {tier.monthly_spend}
                  </td>

                  <td className="font-serif text-2xl text-bordeaux">
                    {tier.discount}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs uppercase ${
                        tier.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tier.status}
                    </span>
                  </td>

                  <td>{tier.sort_order}</td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(tier)}
                        className="inline-flex items-center gap-1 text-bordeaux underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(tier.id)}
                        className="inline-flex items-center gap-1 text-stone-500 underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {tiers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-stone-500"
                  >
                    No loyalty tiers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}