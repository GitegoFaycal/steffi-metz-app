export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'bg-bordeaux',
}) {
  return (
    <div className="bg-white border border-olive/10 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.16em] text-stone-500">
            {title}
          </p>

          <h3 className="font-serif text-4xl text-olive-dark mt-3">
            {value}
          </h3>

          {description && (
            <p className="text-sm text-stone-500 mt-2">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`${color} text-white w-12 h-12 rounded-full flex items-center justify-center`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}