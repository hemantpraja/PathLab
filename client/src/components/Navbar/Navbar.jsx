import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonComponent } from "../../components/index.js";
import { landingNavlinks } from '../../constants/constants.js';
import { useSelector } from 'react-redux';
import cookies from 'js-cookie';

const Header = () => {

  const token = cookies.get("admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [links, setNavLinks] = useState(landingNavlinks);

  const admin = useSelector((state) => state.admin);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLinkClick = (slug, isSublink = false) => {
    const updatedNavLinks = landingNavlinks.map((link) => {

      if (link.slug === slug) {
        return {
          ...link,
          active: true,
        };
      } else {
        return { ...link, active: false };
      }
    });
    setNavLinks(updatedNavLinks);
  };
  return (
    <nav className="bg-white border-gray-200 py-2.5 shadow-md fixed top-0 left-0 w-full z-50 ">
      <div className="flex flex-wrap items-center justify-between px-10 mx-auto">
        <h1 className="text-3xl px-8 font-bold">
          <i>PathLab</i>
        </h1>
        <div className="flex items-center lg:w-full lg:order-2">
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu-2"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className={`w-6 h-6 ${isMenuOpen ? 'hidden' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg className={`w-6 h-6 ${isMenuOpen ? '' : 'hidden'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className={`items-center w-full lg:flex lg:w-auto ${isMenuOpen ? '' : 'hidden'}`} id="mobile-menu-2">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">

            {links && links.map((link, index) => (
              <li
                key={index}
                className="relative flex items-center"
                onClick={() => { handleLinkClick(link.slug) }}
              >
                {/* Main Nav Link */}
                <p className={`py-2 lg:pl-1 pr-0 text-gray-700 lg:p-0 cursor-pointer hover:text-blue-600 hover:text-md transition-all duration-100 relative ${link.active ? "text-blue-600 mb-2" : ""}`}>
                  {link.title}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-transform duration-300 transform ${link.active ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                </p>

              </li>
            ))}
            {
              admin && token && admin?.admin?.id ? (
                <div className="sm:flex items-center gap-5">
                  <Link to="/dashboard">
                    <ButtonComponent
                      title="Dashboard"
                      className="bg-transparent border-2 my-2 lg:mt-0 border-blue-500 py-2 pt-1 text-sm rounded-full px-5 text-blue-500 hover:bg-blue-500 hover:text-white transition-transform duration-300 transform hover:scale-105 active:bg-blue-700 active:border-blue-700 active:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </Link>
                </div>
              ) : (
                <div className="sm:flex items-center gap-5">
                  <Link to="/signup">
                    <ButtonComponent
                      title="SignUp"
                      className="bg-transparent border-2 my-2 lg:mt-0 border-blue-500 py-2 pt-1 text-sm rounded-full px-5 text-blue-500 hover:bg-blue-500 hover:text-white transition-transform duration-300 transform hover:scale-105 active:bg-blue-700 active:border-blue-700 active:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </Link>
                  <Link to="/signin">
                    <ButtonComponent
                      title="Login"
                      className="bg-blue-500 border-2 my-2 lg:mt-0 border-blue-500 py-2 pt-1 text-sm rounded-full px-5 text-white hover:bg-blue-600 hover:text-white transition-transform duration-300 transform hover:scale-105 active:bg-blue-700 active:border-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </Link>
                </div>
              )}
          </ul>
        </div>
      </div >
    </nav >
  );
};

export default Header;
