"use client";
import { useTranslation } from "react-i18next";

const socialLinks = [
  {
    href: "https://instagram.com/",
    icon: "bx bxl-instagram-alt",
    label: "Instagram",
  },
  {
    href: "https://discord.com/",
    icon: "bx bxl-discord-alt",
    label: "Discord",
  },
  {
    href: "https://telegram.org/",
    icon: "bx bxl-telegram",
    label: "Telegram",
  },
  {
    href: "https://twitter.com/",
    icon: "fa-brands fa-x-twitter",
    label: "Twitter",
  },
];

const Footer = () => {
  const { t } = useTranslation(["footer"]);
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-[#232946] pt-8 pb-24 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* About */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-bold text-base text-[#FF4545] mb-2 uppercase tracking-wide">
            {t("aboutUs")}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t("aboutText", {
              defaultValue:
                "Ripple est une plateforme musicale moderne pour découvrir, partager et profiter de la musique du monde entier. Rejoignez notre communauté passionnée !",
            })}
          </p>
        </div>
        {/* Social Media */}
        <div className="flex-1 min-w-[180px]">
          <h4 className="font-bold text-base text-[#FF4545] mb-2 uppercase tracking-wide">
            {t("socialMedia")}
          </h4>
          <div className="flex gap-4 mt-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-[#FF4545] hover:text-[#b32d2d] text-2xl transition-colors"
              >
                <i className={link.icon}></i>
              </a>
            ))}
          </div>
        </div>
        {/* Contact */}
        <div className="flex-1 min-w-[180px]">
          <h4 className="font-bold text-base text-[#FF4545] mb-2 uppercase tracking-wide">
            {t("contact")}
          </h4>
          <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <i className="bx bxs-location-plus text-[#FF4545]"></i>
              <span>655 Undaa street nice, Pa 20000 Fr</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="bx bxs-phone text-[#FF4545]"></i>
              <span>+1 234 567 8900</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="bx bxs-message-rounded-dots text-[#FF4545]"></i>
              <span>ripple.contact@email.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-center text-gray-400 text-xs">
        <span className="block border-t border-gray-200 dark:border-[#232946] pt-4 mt-4">
          &copy; {year} Ripple.{" "}
          {t("copyright", { defaultValue: "Tous droits réservés." })}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
