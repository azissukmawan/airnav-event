export const InputText = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  disabled = false,
  required = false,
  className = "",
  error,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-typo-secondary">
        {label || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`bg-typo-white2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-60 transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${error ? "ring-2 ring-red-500" : ""} ${className}`}
        {...rest}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
};