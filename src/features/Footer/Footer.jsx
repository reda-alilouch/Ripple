"use client";
import styles from "@/features/Footer/footer.module.css";
const Footer = () => (
  <footer
    className={`${styles.footer} footer container px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 xl:grid-cols-4 gap-8 items-start m-auto mb-20`}
    id="footer"
  >
    <div className="about text-wrap sm:col-span-2 m-auto">
      <h4 className="about__h4 font-bold w-24 text-xl border-x-0 border-t-0 border-b-4 border-[#ff4545]">
        About Us
      </h4>
      <p className="mt-5 text-slate-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
        voluptatibus laudantium consectetur laborum rem. Natus tenetur, maiores
        maxime adipisci est corrupti ad fugit reprehenderit repellat obcaecati
        eum quae dolores accusantium repellendus? Molestiae id dolores alias.
        Exercitationem accusamus consequuntur nam ullam.
      </p>
    </div>

    <div className="social mt-5 xl:mt-0 m-auto">
      <h4 className="about__h4 font-bold w-34 text-xl border-x-0 border-t-0 border-b-4 border-[#ff4545]">
        Social Media
      </h4>
      <div className="flex gap-2 mt-5">
        <a href="#">
          <i className="bx bxl-instagram-alt text-2xl"></i>
        </a>
        <a href="#">
          <i className="bx bxl-discord-alt text-2xl"></i>
        </a>
        <a href="#">
          <i className="bx bxl-telegram text-2xl"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-x-twitter text-2xl"></i>
        </a>
      </div>
    </div>

    <div className="contact mt-5 xl:mt-0 m-auto">
      <h4 className="about__h4 font-bold w-22 text-xl border-x-0 border-t-0 border-b-4 border-[#ff4545]">
        Contact
      </h4>
      <div className="mt-5">
        <div>
          <i className="bx bxs-location-plus mr-1"></i>
          <span className="text-slate-600">
            655 Undaa street nice, Pa 20000 Fr
          </span>
        </div>
        <div className="mt-1">
          <i className="bx bxs-phone mr-1"></i>
          <span className="text-slate-600">+1 234 567 8900</span>
        </div>
        <div className="mt-1">
          <i className="bx bxs-message-rounded-dots mr-1"></i>
          <span className="text-slate-600">ripple.contact@email.com</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
