export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  textarea = false,
  rows = 4,
}) {
  return (
    <div className="grid gap-2">
      {label && (
        <label
          htmlFor={name}
          className="text-xs uppercase tracking-[.16em] text-stone-500"
        >
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="input resize-none"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input"
        />
      )}
    </div>
  );
}