import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import api from '../api/axiosConfig';
import { getSettings } from '../api/settingsApi';
import { whatsapp } from '../api/index';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultImages = [
  '/assets/image-15.jpg',
  '/assets/image-16.jpg',
  '/assets/image-17.jpg',
];

const defaultSettings = {
  community_eyebrow: 'Join the movement',
  community_title: 'The Artisan<br/><em>Food Community</em>',
  community_description:
    'Expats, locals, families and professionals meet around handmade food, practical workshops and memorable experiences.',
  community_button_text: 'Join on WhatsApp',
  community_whatsapp_message:
    'Hi Steffi! I would like to join the Artisan Food Community updates.',
};

function getImageUrl(imagePath) {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_URL}${imagePath}`;
  }

  return imagePath;
}

export default function Community() {
  const [images, setImages] = useState(defaultImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        setSettings({
          ...defaultSettings,
          ...(data.settings || {}),
        });
      } catch (error) {
        console.error('Failed to load community settings:', error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    async function loadGalleryImages() {
      try {
        const response = await api.get('/gallery');
        const galleryItems = response.data.gallery || [];

        const communityImages = galleryItems
          .filter((item) => {
            const category = String(item.category || '').toLowerCase();

            return category.includes('community');
          })
          .map((item) => getImageUrl(item.image))
          .filter(Boolean);

        const allGalleryImages = galleryItems
          .map((item) => getImageUrl(item.image))
          .filter(Boolean);

        if (communityImages.length > 0) {
          setImages(communityImages);
          return;
        }

        if (allGalleryImages.length > 0) {
          setImages(allGalleryImages);
        }
      } catch (error) {
        console.error('Failed to load community background images:', error);
      }
    }

    loadGalleryImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === images.length - 1 ? 0 : currentIndex + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [images]);

  const joinCommunity = () => {
    whatsapp(
      settings.community_whatsapp_message ||
        defaultSettings.community_whatsapp_message
    );
  };

  return (
    <section
      id="community"
      className="relative min-h-[680px] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-olive-dark/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
        <div className="max-w-2xl bg-black/25 border border-white/10 p-8 md:p-12 backdrop-blur-sm">
          <SectionTitle
            eyebrow={
              settings.community_eyebrow ||
              defaultSettings.community_eyebrow
            }
            title={
              settings.community_title ||
              defaultSettings.community_title
            }
            light
          >
            {settings.community_description ||
              defaultSettings.community_description}
          </SectionTitle>

          <button
            type="button"
            onClick={joinCommunity}
            className="mt-6 bg-[#25D366] text-white px-7 py-4 uppercase tracking-[.18em] text-xs font-semibold inline-flex items-center gap-3 hover:bg-[#1ea954] transition"
          >
            <FaWhatsapp size={17} />

            {settings.community_button_text ||
              defaultSettings.community_button_text}
          </button>
        </div>
      </div>
    </section>
  );
}