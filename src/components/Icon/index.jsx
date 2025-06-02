"use client";

const Icon = ({ lib = "bx", name = "", className = "", ...props }) => {
  let fullClass = "";

  switch (lib) {
    case "fa":
    case "fa-solid":
      fullClass = `fa-solid ${name}`;
      break;
    case "fa-brands":
      fullClass = `fa-brands ${name}`;
      break;
    case "bx":
      fullClass = `bx ${name}`;
      break;
    case "bxs":
      fullClass = `bx bxs-${name}`;
      break;
    default:
      fullClass = name;
  }

  return <i className={`${fullClass} ${className}`} {...props}></i>;
};

export default Icon;
