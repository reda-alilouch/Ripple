
"use client";

const Button = ({ id, name, className = "", onClick, ...props }) => {
  return (
    <button id={id} onClick={onClick} className={`btn ${className}`} {...props}>
      {name}
    </button>
  );
};

export default Button;
