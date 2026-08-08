import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import api from '../api/axiosConfig';
import { getSettings } from '../api/settingsApi';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultImages = [
  '/assets/image-15.jpg',
  '/assets/image-16.jpg',
  '/assets/image-17.jpg',
];

const defaultSettings = {
  community_eyebrow: 'Our Community',
  community_title: 'Food, learning and<br/><em>shared experiences</em>',
  community_description:
    'Discover cooking sessions, workshops and community experiences with Steffi Metz. Choose an upcoming event and submit an application for the session you would like to attend.',
  community_button_text: 'Explore Events',
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

        if (communityImages.length > 0) {
          setImages(communityImages);
        }
      } catch (error) {
        console.error('Failed to load community background images:', error);
      }
    }

    loadGalleryImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === images.length - 1 ? 0 : currentIndex + 1
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, [images]);

  return (
    <section
      id="community"
      className="relative min-h-[560px] overflow-hidden bg-olive-dark"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url("${image}")`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-olive-dark/35" />

        <div className="absolute inset-0 bg-gradient-to-r from-olive-dark/80 via-olive-dark/45 to-transparent" />
      </div>

      <div className="container-page relative z-10 flex min-h-[560px] items-center py-16">
        <div className="max-w-2xl rounded-sm border border-white/15 bg-black/20 p-6 backdrop-blur-sm sm:p-8 md:p-10">
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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/events" className="btn-primary">
              {settings.community_button_text ||
                defaultSettings.community_button_text}
            </Link>

            <Link
              to="/gallery"
              className="btn-secondary border-white/80 text-white hover:border-bordeaux"
            >
              View Community Moments
            </Link>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          aria-hidden="true"
        >
          {images.map((image, index) => (
            <span
              key={`${image}-indicator-${index}`}
              className={`h-2 w-2 rounded-full transition ${
                index === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
