"use client";

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-[#ff4545] text-white rounded-lg hover:bg-[#ff3535] transition-colors ${className}`}
      {...props}
    >
      {children || "Button"}
    </button>
  );
};

export default Button;
