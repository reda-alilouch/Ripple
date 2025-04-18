import styles from "./Icon.module.css";

const Icon = ({ lib = "fa", name = "", className = "", ...props }) => {
  let fullClass = "";
  let wrapperClass = "";

  switch (lib) {
    case "fa":
    case "fa-solid":
      fullClass = `fa-solid ${name}`;
      wrapperClass = "icon-fa";
      break;
    case "fa-brands":
      fullClass = `fa-brands ${name}`;
      wrapperClass = "icon-fa";
      break;
    case "bx":
      fullClass = `bx ${name}`;
      wrapperClass = "icon-bx";
      break;
    case "bxs":
      fullClass = `bx bxs-${name}`;
      wrapperClass = "icon-bx";
      break;
    default:
      fullClass = name;
  }

  return (
    <span className={styles[wrapperClass]}>
      <i className={`${fullClass} ${className}`} {...props}></i>
    </span>
  );
};

export default Icon;
