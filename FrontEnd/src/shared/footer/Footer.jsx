import React from "react";
import logo from "../../assets/logo.png";
const Footer = () => {
  return (
    <div>
    {/* Top Footer Section */}
    <footer className="footer flex flex-col md:flex-row justify-around items-start p-10 bg-pink-100 text-pink-800 shadow-inner">
      <nav>
        <h2 className="footer-title text-lg font-semibold text-pink-900 mb-3">Services</h2>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h2 className="footer-title text-lg font-semibold text-pink-900 mb-3">Company</h2>
        <a className="link link-hover">About Us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press Kit</a>
      </nav>
      <nav>
        <h2 className="footer-title text-lg font-semibold text-pink-900 mb-3">Legal</h2>
        <a className="link link-hover">Terms of Use</a>
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Cookie Policy</a>
      </nav>
    </footer>
  
    {/* Bottom Footer Section */}
    <footer className="footer items-center justify-between px-6 md:px-10 py-6 border-t bg-pink-200 text-pink-900 border-pink-300 flex flex-col md:flex-row gap-6 md:gap-0">
      <aside className="flex items-center gap-4">
        <img className="w-16 h-16 object-contain" src={logo} alt="Logo" />
        <p className="text-sm md:text-base font-semibold leading-tight">
          <span className="text-lg font-bold">Paw Match</span><br />
          Helping Friends of Pets 🐾
        </p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-6 text-pink-700">
          <a aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775..."></path>
            </svg>
          </a>
          <a aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631..."></path>
            </svg>
          </a>
          <a aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4..."></path>
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  </div>
  
  );
};

export default Footer;
