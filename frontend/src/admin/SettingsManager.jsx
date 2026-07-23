import { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import {
  getSettings,
  updateSettings,
  updateSettingsWithLogo,
} from '../api/settingsApi';

const emptyForm = {
  site_name: '',
  whatsapp_number: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  tiktok: '',
};

export default function SettingsManager() {
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
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
      });

      if (settings.logo) {
        setLogoPreview(settings.logo);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice('');

    try {
      await updateSettings(form);

      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await updateSettingsWithLogo(formData);
      }

      setNotice('Settings updated successfully.');
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
          Update website contact details, WhatsApp number, social links, and
          logo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-olive/10 rounded-xl p-6 grid gap-6"
      >
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

        <ImageUpload
          label="Website Logo"
          imagePreview={logoPreview}
          onChange={handleLogoChange}
          onRemove={() => {
            setLogoFile(null);
            setLogoPreview('');
          }}
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
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}