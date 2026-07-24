import { useEffect, useState } from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { getSettings } from '../api/settingsApi';

const defaultSettings = {
  whatsapp_number: '+250 785 211 051',
  catalogue_title: 'Browse the complete catalogue',
  catalogue_description:
    'From individual products to full gourmet boxes — everything on WhatsApp. Members always receive their discount automatically.',
};

function cleanWhatsAppNumber(number) {
  return String(number || '')
    .replace(/\+/g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '');
}

export default function CatalogueCTA() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data.settings || defaultSettings);
      } catch (error) {
        console.error('Failed to load catalogue settings:', error);
      }
    }

    loadSettings();
  }, []);

  const whatsappNumber = cleanWhatsAppNumber(
    settings.whatsapp_number || defaultSettings.whatsapp_number
  );

  const openCatalogue = () => {
    window.open(`https://wa.me/c/${whatsappNumber}`, '_blank');
  };

  const placeOrder = () => {
    const message =
      'Hi Steffi! I would like to place an order from the Gourmet Shop catalogue.';

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <section className="bg-bordeaux text-white py-20">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[42%_58%] gap-10 items-center">
        <div>
          <p className="text-[.65rem] uppercase tracking-[.25em] text-orange-200/60 mb-5">
            Our full range
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-cream">
            {settings.catalogue_title || defaultSettings.catalogue_title}
          </h2>

          <p className="text-white/55 max-w-md mt-6 leading-8 text-sm font-light">
            {settings.catalogue_description ||
              defaultSettings.catalogue_description}
          </p>
        </div>

        <div className="grid gap-4 lg:max-w-xl lg:ml-auto">
          <button
            type="button"
            onClick={openCatalogue}
            className="w-full bg-[#25D366] text-white py-4 px-6 uppercase tracking-[.18em] text-xs font-medium flex items-center justify-center gap-3 hover:bg-[#1da85a] transition"
          >
            <MessageCircle size={17} />
            Open full catalogue on WhatsApp
          </button>

          <button
            type="button"
            onClick={placeOrder}
            className="w-full border border-white/25 text-white py-4 px-6 uppercase tracking-[.18em] text-xs font-medium flex items-center justify-center gap-3 hover:bg-white hover:text-bordeaux transition"
          >
            <ShoppingBag size={17} />
            Place an order directly
          </button>
        </div>
      </div>
    </section>
  );
}