import React, { useState } from "react";
import LabDetails from './LabDetails'
import { LabProfile as profileArray, } from "../../../constants/constants";
import ReportDetails from "./ReportDetails";
import BillDetails from "./BillDetails";
import DoctorDetails from "./DoctorDetails";
import { ButtonComponent } from "../..";

function LabProfile() {
  const [links, setNavlinks] = useState(profileArray);
  const [activeLink, setActiveLink] = useState(links[0].slug);

  const handleLinkClick = (slug,) => {
    const updatedNavlinks = links.map((link) => {
      if (link.slug === slug) {
        return {
          ...link,
          active: true,
        }
      } else {
        return { ...link, active: false };
      }
    });
    setNavlinks(updatedNavlinks);
    setActiveLink(slug);
    // navigate(slug);
  };

  return (
    <>
      <div className="bg-background  ">
        <div className="pt-8 px-8 ">
          <ul className="flex gap-5">
            {links.map((link, index) => (
              <li onClick={() => handleLinkClick(link.slug)} key={index}>
                <p className={`py-2 lg:pl-1 pr-0 text-gray-700 lg:p-1 cursor-pointer hover:text-btn-color hover:text-md transition-all duration-100 relative ${link.active ? "text-blue-500 mb-2" : ""}`}>
                  <span className={`${link.active ? "text-btn-color" : ""}`} > {link.title}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-btn-color transition-transform duration-300 transform ${link.active ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:flex justify-between bg-background ">
        <div className="w-full">

          {
            activeLink == "labdetails" ?
              <LabDetails /> : ""
          }
          {
            activeLink == "reportdetails" ?
              <ReportDetails /> : ""
          }
          {
            activeLink == "billdetails" ?
              <BillDetails /> : ""
          }
          {
            activeLink == "doctordetails" ?
              <DoctorDetails /> : ""
          }
        </div>
        <div className="bg-background sm:px-3 p-5 md:px-3 md:py-0">
          <div className="sm:w-48 h-72 bg-white border-2  rounded-md flex flex-col justify-center items-center text-sm py-8 w-full">
            <ButtonComponent title="FREE TRIAL" className="rounded-lg text-[12px] border border-btn-color text-white" />
            <p className="py-1">Subscription Plan</p>
            <p className="py-1">17/06/2024</p>
            <p className="py-1">Subscription End Date</p>
            <ButtonComponent title="Subscribe" className="mt-3 bg-btn-color py-0 text-white" />
          </div>
        </div>
      </div>

    </>

  )
}

export default LabProfile