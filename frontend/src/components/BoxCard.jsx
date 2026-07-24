import { Star } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { whatsapp } from '../api/index';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

function getImageUrl(imagePath, fallbackImage) {
  const finalImage = imagePath || fallbackImage;

  if (!finalImage) {
    return '/assets/image-6.jpg';
  }

  if (finalImage.startsWith('http')) {
    return finalImage;
  }

  if (finalImage.startsWith('/uploads')) {
    return `${SERVER_URL}${finalImage}`;
  }

  return finalImage;
}

export default function BoxCard({ box, img }) {
  const price = Number(String(box.price || 0).replace(/,/g, '')) || 0;
  const imageSrc = getImageUrl(box.image, img);

  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-stone-200">
      <div className="relative overflow-hidden">
  <img
    src={imageSrc}
    alt={box.name}
    className="w-full h-72 object-cover"
  />

  <div className="absolute bottom-4 right-4 bg-[#4b5933]/90 text-[#d7c28d] px-4 py-2 font-serif text-lg">
    {box.price} RWF
  </div>
</div>

      <div className="p-5">
        <p className="text-[11px] uppercase tracking-[.25em] text-[#b05b64] font-medium">
          Serves {box.serves}
        </p>

        <h3 className="mt-2 text-3xl font-serif text-[#4b5933]">
          {box.name}
        </h3>

        <div className="mt-4 bg-[#fbf3f4] border border-[#f2dede] px-3 py-2 flex items-center gap-2 text-[#b05b64] text-sm">
          <Star size={14} fill="currentColor" />
          Members save from {(price * 0.1).toLocaleString()} RWF
        </div>

        <button
          type="button"
          onClick={() =>
            whatsapp(
              `Hi Steffi! I would like to order ${box.name} (${box.price} RWF).`
            )
          }
          className="mt-5 w-full bg-[#25D366] hover:bg-[#1ea954] text-white py-3 uppercase tracking-[.18em] text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <FaWhatsapp size={17} />
          Order
        </button>
      </div>
    </div>
  );
}