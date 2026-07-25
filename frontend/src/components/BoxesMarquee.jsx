import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { getBoxes } from '../api/boxesApi';
import { whatsapp } from '../api/index';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const fallbackBoxes = [
  {
    id: 1,
    name: 'The Gourmet Picnic Box',
    price: '52,000',
    serves: '2',
    image: '/assets/image-6.jpg',
  },
  {
    id: 2,
    name: 'The Artisan Dip Box',
    price: '45,000',
    serves: '2',
    image: '/assets/image-7.jpg',
  },
  {
    id: 3,
    name: 'The Pretzel & Cheese Box',
    price: '39,000',
    serves: '2',
    image: '/assets/image-8.jpg',
  },
];

function getImageUrl(imagePath) {
  if (!imagePath) {
    return '/assets/image-6.jpg';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_URL}${imagePath}`;
  }

  return imagePath;
}

export default function BoxesMarquee() {
  const [boxes, setBoxes] = useState(fallbackBoxes);

  useEffect(() => {
    async function loadBoxes() {
      try {
        const data = await getBoxes();

        if (data.boxes?.length > 0) {
          setBoxes(data.boxes);
        }
      } catch (error) {
        console.error('Failed to load boxes marquee:', error);
      }
    }

    loadBoxes();
  }, []);

  const marqueeBoxes = [...boxes, ...boxes];

  return (
    <section id="home-boxes" className="bg-cream py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 mb-10">
        <p className="text-xs uppercase tracking-[.25em] text-bordeaux">
          Gourmet Boxes
        </p>

        <h2 className="font-serif text-4xl md:text-5xl text-olive-dark mt-3">
          Fresh boxes,
          <br />
          <em className="text-bordeaux">moving through the season</em>
        </h2>

        <p className="text-stone-600 max-w-2xl mt-4 leading-7">
          Explore handcrafted gourmet boxes made for picnics, gatherings,
          gifts, events and everyday food lovers.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-box-marquee hover:[animation-play-state:paused]">
          {marqueeBoxes.map((box, index) => {
            const imageSrc = getImageUrl(box.image);

            return (
              <article
                key={`${box.id || box.name}-${index}`}
                className="min-w-[300px] md:min-w-[360px] bg-white border border-stone-200 shadow-sm overflow-hidden"
              >
                <Link to="/boxes" className="block">
                  <div className="relative h-64 overflow-hidden">
                    {imageSrc}

                    <div className="absolute bottom-4 right-4 bg-[#4b5933]/90 text-[#d7c28d] px-4 py-2 font-serif text-lg">
                      {box.price} RWF
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] uppercase tracking-[.25em] text-bordeaux">
                      Serves {box.serves}
                    </p>

                    <h3 className="font-serif text-2xl text-olive-dark mt-2">
                      {box.name}
                    </h3>

                    <p className="text-stone-500 text-sm mt-3">
                      Click to view all boxes
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    whatsapp(
                      `Hi Steffi! I would like to order ${box.name} (${box.price} RWF).`
                    )
                  }
                  className="mx-5 mb-5 w-[calc(100%-2.5rem)] bg-[#25D366] hover:bg-[#1ea954] text-white py-3 uppercase tracking-[.18em] text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp size={16} />
                  Order
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}