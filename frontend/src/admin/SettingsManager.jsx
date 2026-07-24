import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getSettings,
  updateSettings,
  updateSettingsWithLogo,
  updateShopImage,
} from '../api/settingsApi';

const defaultForm = {
  site_name: '',
  whatsapp_number: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  catalogue_title: '',
  catalogue_description: '',
  newsletter_title: '',
  newsletter_description: '',
  shop_title: '',
  opening_hours: '',
};

function getImageUrl(imagePath) {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:5000${imagePath}`;
  }

  return imagePath;
}

export default function SettingsManager() {
  const [form, setForm] = useState(defaultForm);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [shopImageFile, setShopImageFile] = useState(null);
  const [shopImagePreview, setShopImagePreview] = useState('');

  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      const settings = data.settings || data.data || data || {};

      setForm({
        site_name: settings.site_name || '',
        whatsapp_number: settings.whatsapp_number || '',
        email: settings.email || '',
        address: settings.address || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        tiktok: settings.tiktok || '',
        catalogue_title: settings.catalogue_title || '',
        catalogue_description: settings.catalogue_description || '',
        newsletter_title: settings.newsletter_title || '',
        newsletter_description: settings.newsletter_description || '',
        shop_title: settings.shop_title || '',
        opening_hours: settings.opening_hours || '',
      });

      if (settings.logo) {
        setLogoPreview(getImageUrl(settings.logo));
      }

      if (settings.shop_image) {
        setShopImagePreview(getImageUrl(settings.shop_image));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleShopImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setShopImageFile(file);
      setShopImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setNotice('');

    try {
      await updateSettings(form);

      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile);
        await updateSettingsWithLogo(logoFormData);
      }

      if (shopImageFile) {
        const shopImageFormData = new FormData();
        shopImageFormData.append('shop_image', shopImageFile);
        await updateShopImage(shopImageFormData);
      }

      setNotice('Settings updated successfully.');
      setLogoFile(null);
      setShopImageFile(null);

      await loadSettings();
    } catch (error) {
      setNotice(error.response?.data?.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Website Configuration
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Settings Manager
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Update website identity, contact details, WhatsApp links, catalogue
          section, newsletter section, and shop information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-olive/10 rounded-xl p-6 grid gap-8"
      >
        <div>
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            General Website Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <FormInput
              label="Site Name"
              name="site_name"
              value={form.site_name}
              onChange={handleChange}
              placeholder="Steffi Metz"
              required
            />

            <FormInput
              label="WhatsApp Number"
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              placeholder="+250 785 211 051"
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hello@steffimetz.rw"
            />

            <FormInput
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Kigali, Rwanda"
            />

            <FormInput
              label="Instagram URL"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />

            <FormInput
              label="Facebook URL"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />

            <FormInput
              label="TikTok URL"
              name="tiktok"
              value={form.tiktok}
              onChange={handleChange}
              placeholder="https://tiktok.com/..."
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Logo
          </h2>

          <ImageUpload
            label="Website Logo"
            imagePreview={logoPreview}
            onChange={handleLogoChange}
            onRemove={() => {
              setLogoFile(null);
              setLogoPreview('');
            }}
          />
        </div>

        <div>
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Catalogue Section
          </h2>

          <div className="grid gap-5">
            <FormInput
              label="Catalogue Title"
              name="catalogue_title"
              value={form.catalogue_title}
              onChange={handleChange}
              placeholder="Browse the complete catalogue"
            />

            <FormInput
              label="Catalogue Description"
              name="catalogue_description"
              value={form.catalogue_description}
              onChange={handleChange}
              textarea
              rows={4}
              placeholder="From individual products to full gourmet boxes..."
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Newsletter Section
          </h2>

          <div className="grid gap-5">
            <FormInput
              label="Newsletter Title"
              name="newsletter_title"
              value={form.newsletter_title}
              onChange={handleChange}
              placeholder="Recipes & offers, in your inbox"
            />

            <FormInput
              label="Newsletter Description"
              name="newsletter_description"
              value={form.newsletter_description}
              onChange={handleChange}
              textarea
              rows={4}
              placeholder="Exclusive recipes, product launches and event invitations..."
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-olive-dark mb-5">
            Find Shop Section
          </h2>

          <div className="grid gap-5">
            <FormInput
              label="Shop Section Title"
              name="shop_title"
              value={form.shop_title}
              onChange={handleChange}
              placeholder="Find the Gourmet Shop"
            />

            <FormInput
              label="Opening Hours"
              name="opening_hours"
              value={form.opening_hours}
              onChange={handleChange}
              textarea
              rows={4}
              placeholder="Mon – Fri: 09:00 – 18:00&#10;Sat: 10:00 – 14:00"
            />

            <ImageUpload
              label="Shop Image"
              imagePreview={shopImagePreview}
              onChange={handleShopImageChange}
              onRemove={() => {
                setShopImageFile(null);
                setShopImagePreview('');
              }}
            />
          </div>
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
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}