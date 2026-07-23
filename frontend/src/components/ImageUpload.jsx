import { UploadCloud, X } from 'lucide-react';

export default function ImageUpload({
  label = 'Upload Image',
  imagePreview,
  onChange,
  onRemove,
}) {
  return (
    <div className="grid gap-3">
      <p className="text-xs uppercase tracking-[.16em] text-stone-500">
        {label}
      </p>

      {imagePreview ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-olive/10 bg-white">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 bg-bordeaux text-white rounded-full p-2 hover:bg-[#b03358] transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <label className="border-2 border-dashed border-olive/20 bg-white rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-bordeaux transition">
          <UploadCloud className="text-bordeaux mb-3" size={34} />
          <span className="text-sm text-stone-600">
            Click to choose an image
          </span>
          <span className="text-xs text-stone-400 mt-1">
            JPG, PNG, WEBP supported
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}