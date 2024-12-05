import React, { useState } from "react";
import { outsourcetype } from "../../../constants/constants";
import InputField from "../../common/InputFeild";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ButtonComponent } from "../..";

function Outsource() {
  const [links, setNavlinks] = useState(outsourcetype);
  const [size, setSize] = React.useState(null);

  const [link, setLink] = useState("testwise");

  const handleOpen = (value) => setSize(value);
  const handleLinkClick = (slug, isSublink = false) => {
    const updatedNavlinks = links.map((link) => {

      if (link.slug === slug && !isSublink) {
        return {
          ...link,
          active: true,
          sublink: link.sublink ? link.sublink.map((sublink) => ({ ...sublink, active: false })) : [],
        };
      } else if (link.sublink) {
        const updatedSublinks = link.sublink.map((sublink) => ({
          ...sublink, active: sublink.slug === slug && isSublink,
        }));
        return { ...link, sublink: updatedSublinks, active: false };
      } else {
        return { ...link, active: false };
      }
    });
    setNavlinks(updatedNavlinks);
    setLink(slug);
  };

  return (
    <>
      <div className="bg-background ">
        <div className="px-4 py-8 flex justify-between items-center">
          <div className="w-2/3">

            <ul className="flex gap-5">
              {links.map((link, index) => (
                <li onClick={() => handleLinkClick(link.slug)} key={index}>
                  <span
                    className={`font-medium ${link.active
                      ? "text-btn-color border-b-2 py-2 border-btn-color"
                      : ""
                      }`}
                  >
                    {link.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/3 flex items-center">
            {
              link === "testwise" ?
                <InputField placeholder="Add New Test" className="h-9 py-0 placeholder:text-sm " />
                : ""
            }

            {
              link === "labwise" ?
                <>
                  <InputField placeholder="Enter Lab Name" isSearch={false} className="h-9 py-0 placeholder:text-sm " />
                  <ButtonComponent title="AddLab" className="h-9 text-white flex items-center font-medium" />
                </>
                : ""
            }

          </div>
        </div>
      </div>

      {
        link === "testwise" ?
          <div className="bg-background px-4 w-full h-full">
            <div className="bg-white p-2 h-full">
              <div className="lg:w-1/3">
                <InputField placeholder="Search by Test Name" className="h-9 py-0 " />
              </div>
              <div className="overflow-auto h-40 py-2">
                <table className="w-full border-collapse ">
                  <thead className="bg-gray-50 text-gray-600 text-sm leading-normal">
                    <tr>
                      <th className="py-5 text-start px-6 w-2/12">Sr. No.</th>
                      <th className="py-5 text-start px-6 w-4/12">Test Name</th>
                      <th className="py-5 text-start px-6 w-2/12">Lab List</th>
                      <th className="py-5 text-start px-6 w-2/12">Action</th>
                    </tr>
                  </thead>
                  <tbody className=" text-sm font-normal">
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-4 px-6 text-left">1</td>
                      <td className="py-4 px-6 text-left">Comple Blood Test</td>
                      <td className="py-4 px-6 text-left">Lab List</td>
                      <td className="py-4 px-6 text-left flex items-center gap-5">
                        <AiOutlineDelete className="text-xl text-red-600" />
                        <FaRegEdit className="text-xl text-blue-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          : ""
      }

      {
        link === "labwise" ?
          <div className="bg-background px-4 w-full h-full">
            <div className="bg-white p-2 h-full">
              <div className="lg:w-1/3">
                <InputField placeholder="Search by Lab Name" className="h-9 py-0 " />
              </div>
              <div className="overflow-auto h-40 py-2">
                <table className="w-full border-collapse ">
                  <thead className="bg-gray-50 text-gray-600 text-sm leading-normal">
                    <tr>
                      <th className="py-5 text-start px-6 w-2/12">Sr. No.</th>
                      <th className="py-5 text-start px-6 w-4/12">Lab Name</th>
                      <th className="py-5 text-start px-6 w-2/12">Total No. of Tests</th>
                      <th className="py-5 text-start px-6 w-2/12">Action</th>
                    </tr>
                  </thead>
                  <tbody className=" text-sm font-normal">
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-4 px-6 text-left">1</td>
                      <td className="py-4 px-6 text-left">Comple Blood Test</td>
                      <td className="py-4 px-6 text-left">Lab List</td>
                      <td className="py-4 px-6 text-left flex items-center gap-5">
                        <AiOutlineDelete className="text-xl text-red-600" />
                        <FaRegEdit className="text-xl text-blue-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          : ""
      }

    </>
  );
}

export default Outsource;