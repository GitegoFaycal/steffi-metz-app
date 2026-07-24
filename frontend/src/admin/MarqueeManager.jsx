import { useEffect, useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import FormInput from '../components/FormInput';
import {
  getAdminMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
} from '../api/marqueeApi';

const emptyForm = {
  text: '',
  sort_order: 0,
  status: 'active',
};

export default function MarqueeManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      const data = await getAdminMarqueeItems();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to load marquee items:', error);
    }
  };

  useEffect(() => {
    loadItems();
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

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      text: item.text || '',
      sort_order: item.sort_order || 0,
      status: item.status || 'active',
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
        await updateMarqueeItem(editingId, payload);
        setNotice('Marquee item updated successfully.');
      } else {
        await createMarqueeItem(payload);
        setNotice('Marquee item created successfully.');
      }

      resetForm();
      await loadItems();
    } catch (error) {
      setNotice(
        error.response?.data?.message || 'Failed to save marquee item.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this marquee item?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteMarqueeItem(id);
      await loadItems();
    } catch (error) {
      console.error('Failed to delete marquee item:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Homepage Motion Text
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Marquee Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Manage the moving text strip shown on the public homepage.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-bordeaux text-white flex items-center justify-center">
              <PlusCircle size={20} />
            </div>

            <h2 className="font-serif text-3xl text-olive-dark">
              {editingId ? 'Update Item' : 'Add Item'}
            </h2>
          </div>

          <FormInput
            label="Marquee Text"
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Fresh sourdough daily"
            required
          />

          <FormInput
            label="Sort Order"
            name="sort_order"
            type="number"
            value={form.sort_order}
            onChange={handleChange}
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
                ? 'Update Item'
                : 'Create Item'}
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
            Existing Marquee Items
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Text</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-olive/10">
                  <td className="py-4 font-medium text-olive-dark">
                    {item.text}
                  </td>

                  <td>{item.sort_order}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs uppercase ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 text-bordeaux underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 text-stone-500 underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-stone-500"
                  >
                    No marquee items found.
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