import { useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';

import SectionTitle from '../components/SectionTitle';
import Newsletter from './Newsletter';
import Events from './Events';
import Loyalty from './Loyalty';
import Community from './Community';
import CatalogueCTA from '../components/CatalogueCTA';
import FindShop from '../components/FindShop';
import BoxesMarquee from '../components/BoxesMarquee';

import { getHomepage } from '../api/homepageApi';
import { getAbout } from '../api/aboutApi';
import { getSettings } from '../api/settingsApi';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultHomepage = {
  location_text: 'Kigali, Rwanda · Since 2020',
  hero_title: 'Handcrafted with love',
  hero_highlight: 'made for real food lovers',
  hero_description:
    'Artisan breads, handmade cheeses, fermented kombucha, gourmet boxes, cooking classes, events and catering. All made fresh in Kigali.',
  button_one_text: 'Explore our gourmet catalogues',
  button_two_text: 'My Loyalty Community',
  hero_image: '/assets/image-3.jpg',
};

const defaultAbout = {
  eyebrow: 'About Steffi',
  title: 'European chef,<br/><em>Kigali heart</em>',
  description:
    'The Gourmet Shop brings European craft, fresh local ingredients and warm community experiences together in Kigali.',
  quote:
    'Food should feel generous, beautiful and real — handmade with love.',
  image_one: '/assets/image-4.jpg',
  image_two: '/assets/image-5.jpg',
};

const defaultSettings = {
  whatsapp_number: '+250 785 211 051',
};

const defaultHeroImages = [
  '/assets/image-3.jpg',
  '/assets/image-4.jpg',
  '/assets/image-5.jpg',
];

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

function cleanWhatsAppNumber(number) {
  return String(number || '')
    .replace(/\+/g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');
}

function scrollToSection(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

export default function Home() {
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [about, setAbout] = useState(defaultAbout);
  const [settings, setSettings] = useState(defaultSettings);

  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  /*
   * Load homepage, about and settings content
   */
  useEffect(() => {
    let mounted = true;

    async function loadHomepageContent() {
      try {
        const [homepageData, aboutData, settingsData] =
          await Promise.all([
            getHomepage(),
            getAbout(),
            getSettings(),
          ]);

        if (!mounted) {
          return;
        }

        setHomepage({
          ...defaultHomepage,
          ...(homepageData?.homepage || {}),
        });

        setAbout({
          ...defaultAbout,
          ...(aboutData?.about || {}),
        });

        setSettings({
          ...defaultSettings,
          ...(settingsData?.settings || {}),
        });
      } catch (error) {
        console.error(
          'Failed to load homepage content:',
          error
        );
      }
    }

    loadHomepageContent();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Load hero images from gallery
   */
  useEffect(() => {
    let mounted = true;

    async function loadHeroImages() {
      try {
        const response = await api.get('/gallery');

        const galleryItems =
          response.data?.gallery || [];

        const uploadedHeroImages = galleryItems
          .filter((item) => {
            const category = String(
              item.category || ''
            ).toLowerCase();

            const status = String(
              item.status || 'active'
            ).toLowerCase();

            return (
              category === 'hero' &&
              status === 'active'
            );
          })
          .sort(
            (firstItem, secondItem) =>
              Number(firstItem.sort_order || 0) -
              Number(secondItem.sort_order || 0)
          )
          .map((item) =>
            getImageUrl(item.image)
          )
          .filter(Boolean);

        if (
          mounted &&
          uploadedHeroImages.length > 0
        ) {
          setHeroImages(uploadedHeroImages);
          setActiveHeroIndex(0);
        }
      } catch (error) {
        console.error(
          'Failed to load hero images:',
          error
        );
      }
    }

    loadHeroImages();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Automatically change hero image every 5 seconds
   */
  useEffect(() => {
    if (heroImages.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveHeroIndex((currentIndex) =>
        currentIndex === heroImages.length - 1
          ? 0
          : currentIndex + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroImages]);

  const aboutImageOne = getImageUrl(
    about.image_one
  );

  const aboutImageTwo = getImageUrl(
    about.image_two
  );

  const whatsappNumber = useMemo(
    () =>
      cleanWhatsAppNumber(
        settings.whatsapp_number ||
          defaultSettings.whatsapp_number
      ),
    [settings.whatsapp_number]
  );

  const loyaltyWhatsAppUrl = useMemo(() => {
    const message =
      'Hello Steffi! I would like to learn more about the Gourmet Loyalty Community.';

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  }, [whatsappNumber]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-black">
        {/* Hero background images */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
        >
          {heroImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === activeHeroIndex
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url("${image}")`,
              }}
            />
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/15" />

          {/* Gradient overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex min-h-[calc(100vh-84px)] items-center">
          <div className="w-full px-5 py-14 sm:px-8 md:px-16 md:py-20">
            <div className="max-w-3xl">
              {/* Location */}
              <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/80">
                {homepage.location_text ||
                  defaultHomepage.location_text}
              </p>

              {/* Hero title */}
              <h1 className="font-serif text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {homepage.hero_title ||
                  defaultHomepage.hero_title}

                <br />

                <em className="text-orange-200">
                  {homepage.hero_highlight ||
                    defaultHomepage.hero_highlight}
                </em>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-base font-light leading-8 text-white/90 sm:text-lg">
                {homepage.hero_description ||
                  defaultHomepage.hero_description}
              </p>

              {/* Hero buttons */}
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                {/* Catalogue button */}
                <button
                  type="button"
                  onClick={() =>
                    scrollToSection('boxes')
                  }
                  className="rounded-full border border-white/70 bg-black/15 px-6 py-3 text-center text-white backdrop-blur-sm transition hover:border-bordeaux hover:bg-bordeaux"
                >
                  {homepage.button_one_text ||
                    defaultHomepage.button_one_text}
                </button>

                {/* WhatsApp Loyalty button */}
                <a
                  href={loyaltyWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/70 bg-white/10 px-6 py-3 text-center text-white backdrop-blur-sm transition hover:border-bordeaux hover:bg-bordeaux"
                >
                  {homepage.button_two_text ||
                    defaultHomepage.button_two_text}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero indicators */}
        {heroImages.length > 1 && (
          <div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            aria-hidden="true"
          >
            {heroImages.map((image, index) => (
              <span
                key={`${image}-indicator-${index}`}
                className={`h-2 w-2 rounded-full transition ${
                  index === activeHeroIndex
                    ? 'bg-white'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* FIND SHOP */}
      <FindShop />

      {/* ABOUT SECTION */}
      <section className="section bg-linen">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
          {/* About images */}
          <div className="relative h-[420px] sm:h-[480px] md:h-[520px]">
            <div
              className="absolute left-0 top-0 h-[85%] w-2/3 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${aboutImageOne}")`,
              }}
              role="img"
              aria-label="Steffi Metz story and culinary experience"
            />

            <div
              className="absolute bottom-0 right-0 h-1/2 w-1/2 border-8 border-cream bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${aboutImageTwo}")`,
              }}
              role="img"
              aria-label="Steffi Metz artisan food experience"
            />
          </div>

          {/* About content */}
          <div>
            <SectionTitle
              eyebrow={
                about.eyebrow ||
                defaultAbout.eyebrow
              }
              title={
                about.title ||
                defaultAbout.title
              }
            >
              {about.description ||
                defaultAbout.description}
            </SectionTitle>

            <blockquote className="border-l-2 border-bordeaux pl-5 font-serif text-xl italic leading-9 text-olive-dark sm:text-2xl">
              “
              {about.quote ||
                defaultAbout.quote}
              ”
            </blockquote>

            <button
              type="button"
              onClick={() =>
                scrollToSection('community')
              }
              className="mt-8 inline-block rounded-full bg-bordeaux px-6 py-3 text-white transition hover:opacity-90"
            >
              Discover the Community
            </button>
          </div>
        </div>
      </section>

      {/* GOURMET BOXES */}
      <div id="boxes">
        <BoxesMarquee />
      </div>

      {/* EVENTS */}
      <div id="events">
        <Events />
      </div>

      {/* LOYALTY */}
      <div id="loyalty">
        <Loyalty />
      </div>

      {/* COMMUNITY */}
      <div id="community">
        <Community />
      </div>

      {/* NEWSLETTER */}
      <Newsletter />

      {/* CATALOGUE CTA */}
      <CatalogueCTA />
    </>
  );
}