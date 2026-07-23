import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getAbout,
  updateAboutWithImage,
} from '../api/aboutApi';

export default function AboutManager() {
  const [form, setForm] = useState({
    eyebrow: '',
    title: '',
    description: '',
    quote: '',
  });

  const [imageOne, setImageOne] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [previewOne, setPreviewOne] = useState('');
  const [previewTwo, setPreviewTwo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAbout();
        const about = data.about || data;

        setForm({
          eyebrow: about.eyebrow || '',
          title: about.title || '',
          description: about.description || '',
          quote: about.quote || '',
        });

        if (about.image_one) {
          setPreviewOne(about.image_one);
        }

        if (about.image_two) {
          setPreviewTwo(about.image_two);
        }
      } catch (error) {
        console.error('Failed to load about section:', error);
      }
    };

    loadAbout();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageOneChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageOne(file);
      setPreviewOne(URL.createObjectURL(file));
    }
  };

  const handleImageTwoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageTwo(file);
      setPreviewTwo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageOne) {
        formData.append('image_one', imageOne);
      }

      if (imageTwo) {
        formData.append('image_two', imageTwo);
      }

      await updateAboutWithImage(formData);
      setMessage('About section updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update about section.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Website Content
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          About Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Update the About Steffi section, including text, quote, and images.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-olive/10 rounded-xl p-6 grid gap-6"
      >
        <FormInput
          label="Eyebrow Text"
          name="eyebrow"
          value={form.eyebrow}
          onChange={handleChange}
          placeholder="About Steffi"
        />

        <FormInput
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="European chef, Kigali heart"
        />

        <FormInput
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          textarea
          placeholder="Write about section description..."
        />

        <FormInput
          label="Quote"
          name="quote"
          value={form.quote}
          onChange={handleChange}
          textarea
          placeholder="Food should feel generous..."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            label="About Image One"
            imagePreview={previewOne}
            onChange={handleImageOneChange}
            onRemove={() => {
              setImageOne(null);
              setPreviewOne('');
            }}
          />

          <ImageUpload
            label="About Image Two"
            imagePreview={previewTwo}
            onChange={handleImageTwoChange}
            onRemove={() => {
              setImageTwo(null);
              setPreviewTwo('');
            }}
          />
        </div>

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
          {loading ? 'Saving...' : 'Save About Section'}
        </button>
      </form>
    </div>
  );
}