import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getBoxes,
  createBox,
  updateBox,
  deleteBox,
} from '../api/boxesApi';

const emptyForm = {
  name: '',
  price: '',
  serves: '',
  items: '',
};

export default function BoxesManager() {
  const [boxes, setBoxes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  const loadBoxes = async () => {
    try {
      const data = await getBoxes();
      setBoxes(data.boxes || data.data || data || []);
    } catch (error) {
      console.error('Failed to load boxes:', error);
    }
  };

  useEffect(() => {
    loadBoxes();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreview('');
  };

  const handleEdit = (box) => {
    setEditingId(box.id);

    setForm({
      name: box.name || '',
      price: box.price || '',
      serves: box.serves || '',
      items: Array.isArray(box.items) ? box.items.join(', ') : box.items || '',
    });

    setPreview(box.image || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('serves', form.serves);
      formData.append('items', form.items);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await updateBox(editingId, formData);
        setMessage('Box updated successfully.');
      } else {
        await createBox(formData);
        setMessage('Box created successfully.');
      }

      resetForm();
      loadBoxes();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save box.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this box?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteBox(id);
      loadBoxes();
    } catch (error) {
      console.error('Failed to delete box:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Content Manager
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Boxes Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Add, update, and delete gourmet boxes shown on the public website.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <h2 className="font-serif text-3xl text-olive-dark">
            {editingId ? 'Update Box' : 'Add Box'}
          </h2>

          <FormInput
            label="Box Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="52,000"
            required
          />

          <FormInput
            label="Serves"
            name="serves"
            value={form.serves}
            onChange={handleChange}
            placeholder="2"
          />

          <FormInput
            label="Items"
            name="items"
            value={form.items}
            onChange={handleChange}
            textarea
            placeholder="Sourdough, Cheese, Kombucha"
          />

          <ImageUpload
            label="Box Image"
            imagePreview={preview}
            onChange={handleImageChange}
            onRemove={() => {
              setImageFile(null);
              setPreview('');
            }}
          />

          {message && (
            <p className="text-sm text-olive-dark">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition"
          >
            {editingId ? 'Update Box' : 'Create Box'}
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
            Existing Boxes
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b">
                <th className="py-3">Name</th>
                <th>Price</th>
                <th>Serves</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {boxes.map((box) => (
                <tr key={box.id} className="border-b border-olive/10">
                  <td className="py-4 font-medium text-olive-dark">
                    {box.name}
                  </td>
                  <td>{box.price}</td>
                  <td>{box.serves}</td>
                  <td>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(box)}
                        className="text-bordeaux underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(box.id)}
                        className="text-stone-500 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {boxes.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-stone-500">
                    No boxes found.
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