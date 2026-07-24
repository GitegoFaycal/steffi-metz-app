import { useEffect, useState } from 'react';
import { getMarqueeItems } from '../api/marqueeApi';

const defaultItems = [
  'Fresh sourdough daily',
  'Handmade in Kigali',
  'Gourmet boxes available',
  'Cooking classes and events',
];

export default function Marquee() {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    async function loadMarqueeItems() {
      try {
        const data = await getMarqueeItems();
        const apiItems = data.items || [];

        if (apiItems.length > 0) {
          setItems(apiItems.map((item) => item.text));
        }
      } catch (error) {
        console.error('Failed to load marquee items:', error);
      }
    }

    loadMarqueeItems();
  }, []);

  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-bordeaux text-white overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {repeatedItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="uppercase tracking-[.18em] text-xs mx-8 text-white/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}