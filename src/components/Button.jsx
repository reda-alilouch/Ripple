"use client";

const Button = ({ className = "", onClick, name, ...props }) => {
  return (
    <button onClick={onClick} className={`${className}`} {...props}>
      {name}
    </button>
  );
};

export default Button;
