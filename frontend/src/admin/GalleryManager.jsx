import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../api/galleryApi';

const emptyForm = {
  title: '',
  category: '',
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadGallery = async () => {
    try {
      const data = await getGallery();
      setGallery(data.gallery || data.data || data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    }
  };

  useEffect(() => {
    loadGallery();
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
    setMessage('');
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || '',
      category: item.category || '',
    });

    setPreview(item.image || item.image_url || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('category', form.category);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await updateGalleryImage(editingId, formData);
        setMessage('Gallery image updated successfully.');
      } else {
        if (!imageFile) {
          setMessage('Please choose an image.');
          setLoading(false);
          return;
        }

        await uploadGalleryImage(formData);
        setMessage('Gallery image uploaded successfully.');
      }

      resetForm();
      await loadGallery();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to save gallery image.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this gallery image?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteGalleryImage(id);
      await loadGallery();
    } catch (error) {
      console.error('Failed to delete gallery image:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Media Manager
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Gallery Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Upload, update, and delete gallery images displayed on the public
          website.
        </p>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-olive/10 rounded-xl p-6 grid gap-5"
        >
          <h2 className="font-serif text-3xl text-olive-dark">
            {editingId ? 'Update Gallery Image' : 'Upload Gallery Image'}
          </h2>

          <FormInput
            label="Image Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Fresh sourdough bread"
            required
          />

          <FormInput
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Food, Events, Classes..."
          />

          <ImageUpload
            label="Gallery Image"
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
            disabled={loading}
            className="bg-bordeaux text-white px-6 py-3 rounded uppercase tracking-wider text-sm hover:bg-[#b03358] transition disabled:opacity-60"
          >
            {loading
              ? 'Saving...'
              : editingId
                ? 'Update Image'
                : 'Upload Image'}
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
            Gallery Images
          </h2>

          {gallery.length === 0 ? (
            <p className="text-stone-500 text-sm">
              No gallery images found.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {gallery.map((item) => {
                const imageSrc = item.image || item.image_url;

                return (
                  <div
                    key={item.id}
                    className="border border-olive/10 rounded-lg overflow-hidden bg-cream"
                  >
                    {imageSrc ? (
                      {imageSrc}
                    ) : (
                      <div className="w-full h-48 bg-stone-200 flex items-center justify-center text-stone-500 text-sm">
                        No image
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-serif text-xl text-olive-dark">
                        {item.title}
                      </h3>

                      {item.category && (
                        <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">
                          {item.category}
                        </p>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 text-bordeaux text-sm underline"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 text-stone-500 text-sm underline"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
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