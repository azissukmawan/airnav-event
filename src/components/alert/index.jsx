const alertStyles = {
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-800",
    icon: "",
  },
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-800",
    icon: "",
  },
  warning: {
    wrapper: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "",
  },
};

const Alert = ({
  message,
  type = "info",
  onClose,
}) => {
  const style = alertStyles[type];

  return (
    <div
      className={`p-4 rounded-lg border ${style.wrapper} flex items-center gap-3`}
    >
      <span className="text-xl">{style.icon}</span>

      <p className="flex-1">{message}</p>

      {onClose && (
        <button
          onClick={onClose}
          className="hover:bg-gray-200 rounded-full p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
