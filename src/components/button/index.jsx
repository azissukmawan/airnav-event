import { Link } from "react-router-dom";
import { Typography } from "../typography";
import clsx from "clsx";

const variantClasses = {
  primary: 'p-2 md:px-4 md:py-2 bg-primary text-typo-white border-0 hover:bg-primary-70 items-center justify-center',
  secondary: 'p-2 md:px-4 md:py-2 bg-primary-10 text-primary hover:bg-primary-20 items-center justify-center',
  third: 'px-4 py-2 bg-typo-light text-typo-surface items-center justify-center',
  red: 'px-4 py-2 bg-error text-white hover:bg-error-70 items-center justify-center',
  green: 'px-4 py-2 bg-success text-white items-center justify-center',
  white: 'px-4 py-2 bg-white text-primary hover:bg-primary hover:text-primary-10 items-center justify-center',
  outline: 'px-4 py-2 bg-typo-white text-primary border-2 border-primary hover:bg-primary hover:text-typo-white items-center justify-center',
  underline: 'underline text-primary hover:text-typo-secondary items-center justify-center',
  status: "flex items-center gap-2 bg-blue-50 text-gray-700 border border-blue-100 rounded-full px-4 py-1.5 text-sm hover:bg-blue-100 transition-all",
};

export const Button = ({
  variant = 'primary',
  children,
  iconLeft,
  iconRight,
  className = '',
  onClick,
  to,
  type = "button",
}) => {
  const variantStyle = variantClasses[variant] || variantClasses.primary;

  const buttonContent = (
    <div className="flex items-center justify-center space-x-1">
      {iconLeft && <span className="w-6 h-6">{iconLeft}</span>}
      <Typography type="button" font="poppins" weight="semibold">
        {children}
      </Typography>
      {iconRight && <span className="flex items-center w-6 h-6">{iconRight}</span>}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={clsx('inline-block rounded-md', variantStyle, className)}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={clsx('flex justify-center rounded-md', variantStyle, className)}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};