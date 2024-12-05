import { IoIosArrowDown } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { navlinks } from "../../../constants/constants.js";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function SideNavbar() {
  const [links, setNavlinks] = useState(navlinks);
  const [isNavOpen, setNavOpen] = useState(false);
  const [roleManageData, setRoleManageData] = useState({});

  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState({});

  const admin = useSelector((state) => state.admin);

  const toggleDropdown = (index) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleOffcanvas = () => {
    setNavOpen(!isNavOpen);
  };

  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;

      const roleAccessData = {
        receptionNewRegistration: roleData?.reception?.tabs?.newRegistration,
        receptionPatientList: roleData?.reception?.tabs?.patientList,
        technicianReportEntry: roleData?.technician?.tabs?.reportsEntry,
        technicianTestList: roleData?.technician?.tabs?.testList,
        doctorEnterVerify: roleData?.doctor?.tabs?.enterVerify,
        doctorPatientList: roleData?.doctor?.tabs?.patientList,
        doctorAddPackage: roleData?.doctor?.permissions?.addNewPackage,
        doctorEditPackage: roleData?.doctor?.permissions?.editPackage,
        doctorDeletePackage: roleData?.doctor?.permissions?.deletePackage,
      }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);

  const handleLinkClick = (slug, isSublink = false, isLink) => {

    let parts = slug.includes("/") ? slug.split("/") : [slug];
    let subnavlink = parts[1];

    const updatedNavlinks = links.map((link) => {
      if (link.slug === slug && !isSublink) {
        return {
          ...link,
          active: true,
          sublink: link.sublink
            ? link.sublink.map((sublink) => ({ ...sublink, active: false }))
            : [],
        };
      } else if (subnavlink) {

        const updatedSublinks = link.sublink.map((sublink) => ({
          ...sublink,
          active: sublink.slug === subnavlink && isSublink,
        }));

        return { ...link, sublink: updatedSublinks, active: false };
      } else {
        return { ...link, active: false };
      }
    });
    setNavlinks(updatedNavlinks);

    if (isLink) {
      navigate(slug);
    }
  };

  useEffect(() => {
    const pathname = window.location.pathname; // Pathname part of the URL
    const pathParts = pathname.split('/dashboard/');
    const dashboardPath = pathParts.length > 1 ? pathParts[1].split('/')[0] : '';

      handleLinkClick(dashboardPath, false);
  }, [])

  return (
    <>
      <div className="lg:bg-white lg:w-[250px] lg:h-screen lg:p-0 bg-background  lg:block border-r overflow-y-auto">
        <div className="lg:hidden px-2 flex justify-between">
          {!isNavOpen ? (
            <IoMenu
              className="text-black text-3xl "
              onClick={toggleOffcanvas}
            />
          ) : (
            <FaXmark
              className="text-black"
              onClick={toggleOffcanvas}
            />
          )}
          <p className="lg:hidden text-3xl font-bold font-serif mb-0">PathLabs</p>
        </div>

        <div
          className={`absolute top-0 left-0 z-50 h-screen lg:h-full overflow-auto w-64 transform bg-white py-3 lg:py-0 shadow-lg transition-transform duration-300 ease-in-out ${isNavOpen ? "translate-x-0" : "-translate-x-full"
            } lg:static lg:translate-x-0  lg:w-auto lg:bg-transparent lg:shadow-none`}
        >
          <div className="lg:hidden px-2">
            {!isNavOpen ? (
              <IoMenu
                className="text-black text-3xl "
                onClick={toggleOffcanvas}
              />
            ) : (
              <FaXmark
                className="text-black text-3xl "
                onClick={toggleOffcanvas}
              />
            )}
          </div>
          <div className="flex justify-center items-center pt-3 lg:py-0  lg:pt-10">
            <p className="text-4xl font-bold font-serif mb-0 lg:mb-3">PathLabs</p>
          </div>
          {
            roleManageData && (
              <ul className="lg:py-0  ">
                {
                  links.map((link, index) => (

                    ((link.title === "New Registration" && roleManageData?.receptionNewRegistration) || (link.title === "Patient List" && roleManageData?.receptionPatientList) || (link.title === "Enter & Verify" && roleManageData?.doctorEnterVerify) || (link.title === "Patiet List" && roleManageData?.doctorPatientList) || (link.title === "Tests" && roleManageData?.technicianTestList) || (link.title === "Enter & Verify" && roleManageData?.technicianReportEntry)) ? (

                      <li className="relative cursor-pointer" key={index}>
                        <div
                          className={`space-x-2  p-3 text-md font-sans hover:bg-gray-100  flex items-center ${link.active ? "bg-navlink-active-color" : ""
                            }`}
                          onClick={() => {
                            handleLinkClick(link.slug, false, link.isLink);
                            link.sublink &&
                              link.sublink.length > 0 &&
                              toggleDropdown(index);
                          }}
                        >
                          <span className="flex-shrink-0">
                            <link.icon className="text-xl" />
                          </span>
                          <span>{link.title}</span>
                          {link.sublink && link.sublink.length > 0 && (
                            <span
                              className={`absolute lg:right-1 right-4 text-sm transition-transform duration-600 ${openDropdown[index] ? "rotate-180" : "rotate-0"
                                }`}
                            >
                              <IoIosArrowDown />
                            </span>
                          )}
                        </div>
                        {link.sublink && link.sublink.length > 0 && (
                          <div
                            className={`text-left p-2 text-sm w-full mx-auto text-gray-200  transition-all duration-200 ${openDropdown[index] ? "block" : "hidden"
                              }`}
                          >
                            <ul className=" list-none rounded-md w-full ">
                              {link.sublink.map((sublink, subIndex) => (
                                ((sublink.title === "Test List" && roleManageData?.technicianTestList) || (sublink.title === "Packages" && (roleManageData?.doctorAddPackage || roleManageData?.doctorEditPackage || roleManageData?.doctorDeletePackage))) ?
                                  <li
                                    className={`space-x-2 p-3 w-full text-md font-sans cursor-pointer flex items-center hover:bg-gray-100  text-black ${sublink.active
                                      ? "bg-navlink-active-color text-black"
                                      : ""
                                      }`}
                                    key={subIndex}
                                    onClick={() =>
                                      handleLinkClick(
                                        link.slug + "/" + sublink.slug,
                                        true,
                                        sublink.isLink
                                      )
                                    }
                                  >
                                    <span className="text-sm">{sublink.title}</span>
                                  </li>
                                  : ""
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ) : ("")
                  ))}
              </ul>
            )
          }

          {
            roleManageData && Object.keys(roleManageData).length === 0 && (
              <ul className="py-3 lg:py-0 ">
                {links.map((link, index) => (
                  <li className="relative cursor-pointer" key={index}>
                    <div
                      className={`space-x-2  p-3 text-md font-sans hover:bg-gray-100 flex items-center ${link.active ? "bg-navlink-active-color" : ""}`}
                      onClick={() => {
                        handleLinkClick(link.slug, false, link.isLink);
                        link.sublink && link.sublink.length > 0 && toggleDropdown(index);
                      }}
                    >
                      <span className="flex-shrink-0">
                        <link.icon className="text-xl" />
                      </span>
                      <span>{link.title}</span>

                      {link.sublink && link.sublink.length > 0 && (
                        <span className={`absolute lg:right-1 right-4 text-sm transition-transform duration-600 ${openDropdown[index] ? "rotate-180" : "rotate-0"}`} >
                          <IoIosArrowDown />
                        </span>
                      )}
                    </div>

                    {link.sublink && link.sublink.length > 0 && (
                      <div className={`text-left p-2 text-sm w-full mx-auto text-gray-200  transition-all duration-200 ${openDropdown[index] ? "block" : "hidden"}`} >
                        <ul className=" list-none rounded-md w-full">
                          {link.sublink.map((sublink, subIndex) => (
                            <li
                              className={`space-x-2 p-3 w-full text-md font-sans cursor-pointer flex items-center hover:bg-gray-100  text-black ${sublink.active ? "bg-navlink-active-color text-black" : ""}`}
                              key={subIndex}
                              onClick={() =>
                                handleLinkClick(
                                  link.slug + "/" + sublink.slug,
                                  true,
                                  sublink.isLink
                                )
                              }
                            >
                              <span className="text-sm">{sublink.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )
          }
        </div>
      </div>
      {isNavOpen && (
        <div className="fixed inset-0" onClick={toggleOffcanvas}></div>
      )}
    </>
  );
}
