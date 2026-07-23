import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import BoxCard from '../components/BoxCard';
import { getData } from '../api/index';

const imgs = [
  '/assets/image-6.jpg',
  '/assets/image-7.jpg',
  '/assets/image-8.jpg',
  '/assets/image-9.jpg',
  '/assets/image-10.jpg',
  '/assets/image-11.jpg',
  '/assets/image-12.jpg',
];

export default function Boxes() {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    getData('/boxes').then(setBoxes);
  }, []);

  return (
    <section className="section bg-cream">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-12">
          <SectionTitle
            eyebrow="Handmade in Kigali"
            title={`Our <em>Gourmet Boxes</em>`}
          >
            Every box is freshly assembled daily. Members save 10–25%. Tap any
            box to order via WhatsApp.
          </SectionTitle>

          <div className="lg:pb-10">
            <p className="text-stone-600 text-sm leading-7 font-light max-w-xl">
              Every box is freshly assembled daily. Members save 10–25%. Tap any
              box to see full contents and order via WhatsApp.
            </p>

            <a
              href="https://wa.me/c/250785211051"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-bordeaux text-xs uppercase tracking-[.16em] hover:text-[#25D366] transition"
            >
              <MessageCircle size={15} />
              Full WhatsApp Catalogue →
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {boxes.map((box, index) => (
            <BoxCard
              key={box.id}
              box={box}
              img={imgs[index % imgs.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}