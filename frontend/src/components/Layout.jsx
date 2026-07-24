import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from 'react-icons/fa';
import { getSettings } from '../api/settingsApi';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultSettings = {
  site_name: 'Steffi Metz',
  logo: '/assets/image-1.png',
  whatsapp_number: '+250 785 211 051',
  email: 'hello@steffimetz.rw',
  address: 'Kigali, Rwanda',
  instagram: '',
  facebook: '',
  tiktok: '',
  footer_description:
    'Artisan foods, catering, gourmet gift boxes, cooking classes and unforgettable culinary experiences handcrafted in Kigali.',
};

function getImageUrl(imagePath) {
  if (!imagePath) {
    return defaultSettings.logo;
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_URL}${imagePath}`;
  }

  return imagePath;
}

function cleanWhatsAppNumber(number) {
  return String(number || '')
    .replace(/\+/g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '');
}

function openExternalLink(url) {
  if (!url) {
    return;
  }

  const finalUrl = url.startsWith('http') ? url : `https://${url}`;

  window.open(finalUrl, '_blank', 'noopener,noreferrer');
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        setSettings({
          ...defaultSettings,
          ...(data?.settings || {}),
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(defaultSettings);
      }
    }

    loadSettings();
  }, []);

  const logoUrl = getImageUrl(settings.logo);
  const siteName = settings.site_name || defaultSettings.site_name;

  const whatsappNumber = cleanWhatsAppNumber(
    settings.whatsapp_number || defaultSettings.whatsapp_number
  );

  const links = [
    ['boxes', 'Boxes'],
    ['events', 'Events'],
    ['loyalty', 'Loyalty'],
    ['community', 'Community'],
  ];

  const scrollToSection = (id) => {
    setOpen(false);

    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const openCatalogue = () => {
    window.open(
      `https://wa.me/c/${whatsappNumber}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-transparent">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
  <img
    src={logoUrl}
    alt={siteName}
    className="h-12 w-auto object-contain"
  />

  <span className="hidden md:block text-2xl font-serif text-cream">
    {siteName}
  </span>
</Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="uppercase tracking-[.15em] text-xs text-cream hover:text-orange-200 transition [text-shadow:0_2px_8px_rgba(0,0,0,.8)]"
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={openCatalogue}
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full hover:scale-105 transition"
            >
              <FaWhatsapp size={16} />
              Catalogue
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden"
          >
            <Menu
              size={28}
              className="text-white [filter:drop-shadow(0_2px_8px_rgba(0,0,0,.8))]"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-olive-dark/95 flex flex-col items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={30} />
          </button>

          {links.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className="text-3xl font-serif text-white hover:text-bordeaux transition"
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCatalogue();
            }}
            className="flex items-center gap-3 text-[#25D366] text-2xl"
          >
            <FaWhatsapp size={28} />
            Catalogue
          </button>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Loyalty Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-olive-dark border-t border-bordeaux px-4 py-2 flex items-center gap-3">
        <span className="bg-bordeaux text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded">
          🌱 Gourmet Curious
        </span>

        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[6%] h-full bg-gradient-to-r from-bordeaux to-orange-500" />
        </div>

        <span className="hidden md:block text-white/60 text-xs">
          100,000 RWF/month → 10% off everything
        </span>

        <button
          type="button"
          onClick={() => scrollToSection('loyalty')}
          className="bg-bordeaux text-white text-xs uppercase tracking-wider px-3 py-2 rounded hover:opacity-90 transition"
        >
          See Benefits →
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-olive-dark text-white py-14 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
  <img
    src={logoUrl}
    alt={siteName}
    className="h-16 w-auto mb-4 object-contain"
  />

  <p className="text-white/60 leading-7 text-sm">
    {settings.footer_description || defaultSettings.footer_description}
  </p>
</div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-2xl mb-4">
              Contact
            </h3>

            <p className="text-white/60 text-sm leading-7">
              {settings.address || defaultSettings.address}
              <br />
              WhatsApp:{' '}
              {settings.whatsapp_number || defaultSettings.whatsapp_number}
              <br />
              Email: {settings.email || defaultSettings.email}
            </p>

            <div className="flex items-center gap-4 mt-5">
              <button
                type="button"
                onClick={openWhatsApp}
                className="w-9 h-9 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition"
                aria-label="Open WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp size={17} />
              </button>

              <button
                type="button"
                onClick={() => openExternalLink(settings.instagram)}
                disabled={!settings.instagram}
                className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition ${
                  settings.instagram
                    ? 'text-white/60 hover:bg-bordeaux hover:text-white hover:border-bordeaux'
                    : 'text-white/25 cursor-not-allowed'
                }`}
                aria-label="Open Instagram"
                title="Instagram"
              >
                <FaInstagram size={17} />
              </button>

              <button
                type="button"
                onClick={() => openExternalLink(settings.facebook)}
                disabled={!settings.facebook}
                className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition ${
                  settings.facebook
                    ? 'text-white/60 hover:bg-bordeaux hover:text-white hover:border-bordeaux'
                    : 'text-white/25 cursor-not-allowed'
                }`}
                aria-label="Open Facebook"
                title="Facebook"
              >
                <FaFacebookF size={15} />
              </button>

              <button
                type="button"
                onClick={() => openExternalLink(settings.tiktok)}
                disabled={!settings.tiktok}
                className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition ${
                  settings.tiktok
                    ? 'text-white/60 hover:bg-bordeaux hover:text-white hover:border-bordeaux'
                    : 'text-white/25 cursor-not-allowed'
                }`}
                aria-label="Open TikTok"
                title="TikTok"
              >
                <FaTiktok size={15} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-2xl mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-white/60">
              {links.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="text-left hover:text-white transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}