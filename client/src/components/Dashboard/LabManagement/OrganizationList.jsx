import React from "react";
import { ButtonComponent } from "../../index";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";

function OrganizationList() {
  return (
    <div className="bg-background p-5">
      <div className="bg-white h-screen">
        <div className="sm:flex justify-between font-medium p-5">
          <div className="text-md font-normal">
            <p className="text-lg font-medium font-sans">Organization List</p>
          </div>
          <div className="sm:flex gap-3 space-y-2 sm:space-y-0">
            <ButtonComponent title={<><MdOutlineFileDownload /> Excel</>} className="h-8 flex items-center text-white gap-1" />
            <ButtonComponent title={<><FaPlus /> Add Organization</>} className="h-8 flex items-center gap-1 text-white" />
          </div>
        </div>
        <div className="overflow-x-auto py-5">
          <table className="w-full border-collapse overflow-auto">
            <thead className="bg-gray-100 leading-normal">
              <th className="py-2 px-6 text-left text-sm w-full ">SNo.</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Type</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Name</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Compliment (%)</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Username</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Contact No.</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Login Access</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Clear Due</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Financial Analysis</th>
              <th className="py-2 px-6 text-left text-sm w-full ">Action</th>
            </thead>
            <hr />
            <tbody className="text-gray-600 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-6 text-left">1</td>
                <td className="py-2 px-6 text-left">The Sliding</td>
                <td className="py-2 px-6 text-left">Mr. Bones</td>
                <td className="py-2 px-6 text-left">42</td>
                <td className="py-2 px-6 text-left">bones</td>
                <td className="py-2 px-6 text-left">+91-775757566</td>
                <td className="py-2 px-6 text-left">No</td>
                <td className="py-2 px-6 text-left">Yes</td>
                <td className="py-2 px-6 text-left">No</td>
                <td className="py-2 px-6 text-left flex justify-center items-center gap-2">
                  <ButtonComponent title="Edit" className="h-8 flex justify-center items-center text-sm text-white font-medium py-0 px-0  hover:bg-transparent hover:border hover:border-btn-color hover:text-btn-color" />
                  <ButtonComponent title="Doctor&nbsp;Login" className="h-8 flex justify-center text-sm items-center text-btn-color font-medium border border-btn-color bg-transparent py-0 px-0 hover:bg-btn-color hover:text-white" />
                  <ButtonComponent title="Delete" className="h-8 flex justify-center text-sm items-center text-red-600 font-medium border border-red-600 bg-transparent py-0 px-0 hover:bg-red-600 hover:text-white" />
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-6 text-left">2</td>
                <td className="py-2 px-6 text-left">The Sliding</td>
                <td className="py-2 px-6 text-left">Mr. Bones</td>
                <td className="py-2 px-6 text-left">42</td>
                <td className="py-2 px-6 text-left">bones</td>
                <td className="py-2 px-6 text-left">+91-775757566</td>
                <td className="py-2 px-6 text-left">No</td>
                <td className="py-2 px-6 text-left">Yes</td>
                <td className="py-2 px-6 text-left">No</td>
                <td className="py-2 px-6 text-left flex justify-center items-center gap-2">
                  <ButtonComponent title="Edit" className="h-8 flex justify-center items-center text-sm text-white font-medium py-0 px-0  hover:bg-transparent hover:border hover:border-btn-color hover:text-btn-color" />
                  <ButtonComponent title="Doctor&nbsp;Login" className="h-8 flex justify-center text-sm items-center text-btn-color font-medium border border-btn-color bg-transparent py-0 px-0 hover:bg-btn-color hover:text-white" />
                  <ButtonComponent title="Delete" className="h-8 flex justify-center text-sm items-center text-red-600 font-medium border border-red-600 bg-transparent py-0 px-0 hover:bg-red-600 hover:text-white" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrganizationList;
