import { useEffect, useState } from 'react';

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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const defaultHomepage = {
  location_text: 'Kigali, Rwanda · Since 2020',
  hero_title: 'Handcrafted with love',
  hero_highlight: 'made for real food lovers',
  hero_description:
    'Artisan breads, handmade cheeses, fermented kombucha, gourmet boxes, cooking classes, events and catering. All made fresh in Kigali.',
  button_one_text: 'Explore our boxes',
  button_two_text: 'My loyalty savings',
  hero_image: '/assets/image-3.jpg',
};

const defaultAbout = {
  eyebrow: 'About Steffi',
  title: 'European chef,<br/><em>Kigali heart</em>',
  description:
    'The Gourmet Shop brings European craft, fresh local ingredients and warm community experiences together in Kigali.',
  quote: 'Food should feel generous, beautiful and real — handmade with love.',
  image_one: '/assets/image-4.jpg',
  image_two: '/assets/image-5.jpg',
};

function getImageUrl(imagePath) {
  if (!imagePath) return '';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_URL}${imagePath}`;
  }

  return imagePath;
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

  useEffect(() => {
    let mounted = true;

    async function loadHomepageContent() {
      try {
        const [homepageData, aboutData] = await Promise.all([
          getHomepage(),
          getAbout(),
        ]);

        if (!mounted) return;

        setHomepage(homepageData?.homepage || defaultHomepage);
        setAbout(aboutData?.about || defaultAbout);
      } catch (error) {
        console.error('Failed to load homepage content:', error);
      }
    }

    loadHomepageContent();

    return () => {
      mounted = false;
    };
  }, []);

  const heroImage = getImageUrl(homepage.hero_image);
  const aboutImageOne = getImageUrl(about.image_one);
  const aboutImageTwo = getImageUrl(about.image_two);

  return (
    <>
      <section className="min-h-[calc(100vh-84px)] grid lg:grid-cols-[54%_46%]">
        <div className="bg-olive-dark flex flex-col justify-center px-5 md:px-16 pt-10 pb-16 md:pb-24">
          <div className="text-white/40 text-xs tracking-[.28em] uppercase mb-5">
            {homepage.location_text}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-cream font-light leading-tight">
            {homepage.hero_title}
            <br />
            <em className="text-orange-200/80">
              {homepage.hero_highlight}
            </em>
          </h1>

          <p className="text-white/50 max-w-md leading-8 mt-6 font-light">
            {homepage.hero_description}
          </p>

          <div className="max-w-xl border border-white/10 bg-white/5 mt-8 p-5">
            <p className="text-[.6rem] text-orange-200/70 uppercase tracking-[.22em] mb-4">
              ★ Order more — save more, every month
            </p>

            <div className="grid grid-cols-4 text-center divide-x divide-white/10">
              <div className="px-2">
                <b className="font-serif text-white text-2xl">0%</b>

                <p className="text-[.55rem] text-white/35 uppercase mt-1">
                  Curious
                </p>

                <p className="text-[.5rem] text-white/25 uppercase">
                  Free
                </p>
              </div>

              <div className="px-2">
                <b className="font-serif text-white text-2xl">10%</b>

                <p className="text-[.55rem] text-white/35 uppercase mt-1">
                  Regular
                </p>

                <p className="text-[.5rem] text-white/25 uppercase">
                  100K RWF
                </p>
              </div>

              <div className="px-2">
                <b className="font-serif text-white text-2xl">20%</b>

                <p className="text-[.55rem] text-white/35 uppercase mt-1">
                  Gold
                </p>

                <p className="text-[.5rem] text-white/25 uppercase">
                  250K RWF
                </p>
              </div>

              <div className="px-2">
                <b className="font-serif text-white text-2xl">25%</b>

                <p className="text-[.55rem] text-white/35 uppercase mt-1">
                  Connoisseur
                </p>

                <p className="text-[.5rem] text-white/25 uppercase">
                  500K RWF
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => scrollToSection('boxes')}
              className="border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-olive-dark transition text-center"
              >
              {homepage.button_one_text || 'Explore boxes'}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('loyalty')}
              className="border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-olive-dark transition"
            >
              {homepage.button_two_text || 'My loyalty savings'}
            </button>
          </div>
        </div>

        <div
          className="hidden lg:block bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
      </section>

      <FindShop />
            <section className="section bg-linen">
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[520px]">
            <div
              className="absolute top-0 left-0 w-2/3 h-[85%] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${aboutImageOne})`,
              }}
            />

            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cover bg-center bg-no-repeat border-8 border-cream"
              style={{
                backgroundImage: `url(${aboutImageTwo})`,
              }}
            />
          </div>

          <div>
            <SectionTitle
              eyebrow={about.eyebrow || defaultAbout.eyebrow}
              title={about.title || defaultAbout.title}
            >
              {about.description || defaultAbout.description}
            </SectionTitle>

            <blockquote className="font-serif italic text-2xl text-olive-dark leading-9 border-l-2 border-bordeaux pl-5">
              “{about.quote || defaultAbout.quote}”
            </blockquote>

            <button
              type="button"
              onClick={() => scrollToSection('community')}
              className="inline-block mt-8 bg-bordeaux text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Join the Community
            </button>
          </div>
        </div>
      </section>

      <div id="boxes">
        <BoxesMarquee />
      </div>

      <div id="events">
        <Events />
      </div>

      <div id="loyalty">
        <Loyalty />
      </div>

      <div id="community">
        <Community />
      </div>
      <Newsletter />
       <CatalogueCTA />
    </>
  );
}