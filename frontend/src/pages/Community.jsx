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
  community_eyebrow: 'Cook With Us',
  community_title: 'Apply to join<br/><em>one cooking session</em>',
  community_description:
    'Apply online to cook with the Steffi Metz community. Applications are reviewed first, and selected applicants may join one session. You may bring your own product or pay the product cost if needed.',
  community_button_text: 'Apply to Cook With Us',
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

  return (
    <section
      id="community"
      className="relative min-h-[760px] md:min-h-[680px] overflow-hidden flex items-center"
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

      <div className="absolute inset-0 bg-olive-dark/75" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
        <div className="max-w-2xl bg-black/25 border border-white/10 p-5 md:p-12 backdrop-blur-sm">
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

          <div className="bg-white/10 border border-white/10 p-5 mt-6 mb-6">
            <p className="text-[.65rem] uppercase tracking-[.22em] text-orange-100 mb-3">
              Application Conditions
            </p>

            <ul className="grid gap-2 text-white/70 text-sm leading-6">
              <li>• Apply online before joining.</li>
              <li>• We review applications and choose who joins.</li>
              <li>• Each application is valid for one session only.</li>
              <li>• To join another session, submit a new application.</li>
              <li>• You may bring your own product or ingredients.</li>
              <li>
                • If you do not bring your own product, you may pay the product
                cost.
              </li>
            </ul>
          </div>

          <Link
            to="/community-application"
            className="mt-2 bg-bordeaux text-white px-7 py-4 uppercase tracking-[.18em] text-xs font-semibold inline-flex items-center gap-3 hover:bg-[#b03358] transition"
          >
            {settings.community_button_text ||
              defaultSettings.community_button_text}
          </Link>
        </div>
      </div>
    </section>
  );
}