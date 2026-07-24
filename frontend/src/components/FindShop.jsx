import { useEffect, useState } from 'react';
import { MapPin, Clock, MessageCircle, Mail, Navigation } from 'lucide-react';
import { getSettings } from '../api/settingsApi';

const defaultSettings = {
  site_name: 'Steffi Metz',
  whatsapp_number: '+250 785 211 051',
  email: 'hello@steffimetz.rw',
  address: 'Kigali, Rwanda',
  shop_title: 'Find the Gourmet Shop',
  opening_hours: 'Mon - Fri: 09:00 - 18:00\nSat: 10:00 - 14:00',
  shop_image: '/assets/image-13.jpg',
};

function cleanWhatsAppNumber(number) {
  return String(number || '')
    .replace(/\+/g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '');
}

function getImageUrl(imagePath) {
  if (!imagePath) {
    return defaultSettings.shop_image;
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:5000${imagePath}`;
  }

  return imagePath;
}

export default function FindShop() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data.settings || defaultSettings);
      } catch (error) {
        console.error('Failed to load shop settings:', error);
      }
    }

    loadSettings();
  }, []);

  const whatsappNumber = cleanWhatsAppNumber(
    settings.whatsapp_number || defaultSettings.whatsapp_number
  );

  const shopImage = getImageUrl(settings.shop_image);

  const openDirections = () => {
    const address = settings.address || defaultSettings.address;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
      '_blank'
    );
  };

  const openWhatsApp = () => {
    const message = 'Hi Steffi! I would like to visit the Gourmet Shop.';

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const openEmail = () => {
    const email = settings.email || defaultSettings.email;
    window.location.href = `mailto:${email}`;
  };

  return (
    <section className="bg-linen py-20">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-[.65rem] uppercase tracking-[.25em] text-bordeaux mb-5">
            Visit us
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-olive-dark">
            {settings.shop_title || defaultSettings.shop_title}
          </h2>

          <div className="mt-9 divide-y divide-olive/10 border-y border-olive/10 max-w-xl">
            <div className="py-5 flex gap-4">
              <MapPin className="text-bordeaux shrink-0 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase tracking-[.18em] text-stone-500">
                  Address
                </p>

                <p className="text-olive-dark mt-1">
                  {settings.address || defaultSettings.address}
                </p>
              </div>
            </div>

            <div className="py-5 flex gap-4">
              <Clock className="text-bordeaux shrink-0 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase tracking-[.18em] text-stone-500">
                  Opening Hours
                </p>

                <p className="text-olive-dark mt-1 whitespace-pre-line">
                  {settings.opening_hours || defaultSettings.opening_hours}
                </p>
              </div>
            </div>

            <div className="py-5 flex gap-4">
              <MessageCircle className="text-bordeaux shrink-0 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase tracking-[.18em] text-stone-500">
                  WhatsApp
                </p>

                <p className="text-olive-dark mt-1">
                  {settings.whatsapp_number || defaultSettings.whatsapp_number}
                </p>
              </div>
            </div>

            <div className="py-5 flex gap-4">
              <Mail className="text-bordeaux shrink-0 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase tracking-[.18em] text-stone-500">
                  Email
                </p>

                <p className="text-olive-dark mt-1">
                  {settings.email || defaultSettings.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              type="button"
              onClick={openDirections}
              className="bg-bordeaux text-white px-6 py-3 uppercase tracking-[.16em] text-xs inline-flex items-center gap-2 hover:bg-[#b03358] transition"
            >
              <Navigation size={16} />
              Get Directions
            </button>

            <button
              type="button"
              onClick={openEmail}
              className="border border-olive/20 text-olive-dark px-6 py-3 uppercase tracking-[.16em] text-xs inline-flex items-center gap-2 hover:bg-olive-dark hover:text-white transition"
            >
              <Mail size={16} />
              Email Us
            </button>
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-4 text-bordeaux text-xs uppercase tracking-[.16em] hover:underline"
          >
            Message us on WhatsApp →
          </button>
        </div>

        <div>
          <div
            className="min-h-[360px] bg-cover bg-center bg-no-repeat shadow-sm"
            style={{
              backgroundImage: `url(${shopImage})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}