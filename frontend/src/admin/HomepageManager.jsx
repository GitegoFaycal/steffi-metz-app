import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getHomepage,
  updateHomepageWithImage,
} from '../api/homepageApi';

export default function HomepageManager() {
  const [form, setForm] = useState({
    location_text: '',
    hero_title: '',
    hero_highlight: '',
    hero_description: '',
    button_one_text: '',
    button_two_text: '',
  });

  const [heroImage, setHeroImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        const data = await getHomepage();
        const homepage = data.homepage || data;

        setForm({
          location_text: homepage.location_text || '',
          hero_title: homepage.hero_title || '',
          hero_highlight: homepage.hero_highlight || '',
          hero_description: homepage.hero_description || '',
          button_one_text: homepage.button_one_text || '',
          button_two_text: homepage.button_two_text || '',
        });

        if (homepage.hero_image) {
          setPreview(homepage.hero_image);
        }
      } catch (error) {
        console.error('Failed to load homepage:', error);
      }
    };

    loadHomepage();
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
      setHeroImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setHeroImage(null);
    setPreview('');
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

      if (heroImage) {
        formData.append('hero_image', heroImage);
      }

      await updateHomepageWithImage(formData);
      setMessage('Homepage updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update homepage.'
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
          Homepage Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Update the homepage hero content, main heading, description, buttons,
          and hero image.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-olive/10 rounded-xl p-6 grid gap-6"
      >
        <FormInput
          label="Location Text"
          name="location_text"
          value={form.location_text}
          onChange={handleChange}
          placeholder="Kigali, Rwanda · Since 2020"
        />

        <FormInput
          label="Hero Title"
          name="hero_title"
          value={form.hero_title}
          onChange={handleChange}
          placeholder="Handcrafted with love"
        />

        <FormInput
          label="Hero Highlight"
          name="hero_highlight"
          value={form.hero_highlight}
          onChange={handleChange}
          placeholder="made for real food lovers"
        />

        <FormInput
          label="Hero Description"
          name="hero_description"
          value={form.hero_description}
          onChange={handleChange}
          textarea
          placeholder="Write homepage hero description..."
        />

        <div className="grid md:grid-cols-2 gap-5">
          <FormInput
            label="Button One Text"
            name="button_one_text"
            value={form.button_one_text}
            onChange={handleChange}
            placeholder="Explore boxes"
          />

          <FormInput
            label="Button Two Text"
            name="button_two_text"
            value={form.button_two_text}
            onChange={handleChange}
            placeholder="My loyalty savings"
          />
        </div>

        <ImageUpload
          label="Hero Image"
          imagePreview={preview}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
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
          {loading ? 'Saving...' : 'Save Homepage'}
        </button>
      </form>
    </div>
  );
}