import { MessageCircle, Star } from "lucide-react";
import { whatsapp } from "../api";

export default function BoxCard({ box, img }) {
  const price = Number(String(box.price).replace(/,/g, ""));
  const imageSrc = box.image || img;

  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-stone-200">
      {/* Image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={box.name}
          className="w-full h-64 object-cover"
        />

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-[#4b5933]/90 text-[#d7c28d] px-4 py-2 font-serif text-lg">
          {box.price} RWF
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Serves */}
        <p className="text-[11px] uppercase tracking-[.25em] text-[#b05b64] font-medium">
          Serves {box.serves}
        </p>

        {/* Title */}
        <h3 className="mt-2 text-3xl font-serif text-[#4b5933]">
          {box.name}
        </h3>

        {/* Savings */}
        <div className="mt-4 bg-[#fbf3f4] border border-[#f2dede] px-3 py-2 flex items-center gap-2 text-[#b05b64] text-sm">
          <Star size={14} fill="currentColor" />
          Members save from {(price * 0.1).toLocaleString()} RWF
        </div>

        {/* Order Button */}
        <button
          onClick={() =>
            whatsapp(
              `Hi Steffi! I would like to order ${box.name} (${box.price} RWF).`
            )
          }
          className="mt-5 w-full bg-[#25D366] hover:bg-[#1ea954] text-white py-3 uppercase tracking-[.18em] text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <MessageCircle size={16} />
          Order
        </button>
      </div>
    </div>
  );
}