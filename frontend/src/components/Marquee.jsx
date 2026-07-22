const products = [
  'Sourdough Bread',
  'Artisan Cheese',
  'House Granola',
  'Rosemary Focaccia',
  'Homemade Hummus',
  'Kombucha',
  'Almond Butter',
  'Fresh Pretzels',
];

export default function Marquee() {
  const repeatedProducts = [...products, ...products];

  return (
    <div className="w-full overflow-hidden bg-bordeaux py-3">
      <div className="flex w-max whitespace-nowrap animate-marquee">
        {repeatedProducts.map((product, index) => (
          <span
            key={`${product}-${index}`}
            className="font-serif italic text-white/70 px-10 relative after:content-['·'] after:absolute after:right-0 after:text-white/35"
          >
            {product}
          </span>
        ))}
      </div>
    </div>
  );
}