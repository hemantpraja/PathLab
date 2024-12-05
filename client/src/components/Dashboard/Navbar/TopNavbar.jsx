import React, { useEffect, useState } from "react";
import { InputField, ButtonComponent, SelectBox } from '../../index'
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service";
import { useGetUserDetailsMutation } from "../../../redux/services/labApi.service"
import { setAdmin } from "../../../redux/reducer/adminSlice.js";
import { useSelector } from "react-redux";
import cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useGetPatientMutation } from "../../../redux/services/adminApi.service.js";
import { Select } from 'antd';

function TopNavbar() {

  const [getAdminDetails] = useGetAdminDetailsMutation();
  const [getUserDetails] = useGetUserDetailsMutation();
  const [getPatient] = useGetPatientMutation();
  const [isOpen, setIsOpen] = useState(false);
  const admin = useSelector((state) => state.admin);
  const [auth, setAuth] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [patient, setPatient] = useState([]);
  const [searchPatient, setSearchPatient] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const fetchPatient = async () => {
    try {
      const response = await getPatient({ id: admin.admin.id })
      setPatient(response.data.data.patient)
    }
    catch (error) {

    }
  }

  const fetchAdminDetails = async () => {
    try {
      const response = await getAdminDetails({ email: admin.admin.email });
      if (response.data.success) {
        setAuth(response.data.data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchPatient()
  }, [admin.admin.id])

  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetails({ id: admin.admin.id, userId: admin.admin.manageUser[0]._id });
      if (response.data.success) {
        setAuth(response.data.data);
      }
    } catch (error) {
    }
  }

  function filterPatient(input) {
    if (input) {
      if (patient) {
        const filteredPatient = patient.map(patient =>
          patient.patient
        );
        const filteredPatient1 = filteredPatient.filter(onepatient =>
          onepatient.firstName.toLowerCase().includes(input.toLowerCase())
        );

        setSearchPatient(filteredPatient1)
      }
    }
    if (!input) {
      setSearchPatient([])
    }
  }


  useEffect(() => {
    if (admin?.admin?.manageUser) {
      fetchUserDetails();
    }
    fetchAdminDetails();
  }, []);

  const editProfile = () => {
    navigate("profile")
  }
  
  const signOut = () => {
    cookies.remove("admin");
    toast.success("Sign Out Successfully");
    dispatch(setAdmin({}));
    navigate("/")
  }

  return (
    <>
      <div className="md:flex justify-between items-center lg:bg-white bg-background p-1  ">
        <div className="md:px-3 p-1 md:p-0 w-2/3">
          <Select
            showSearch
            value={null}
            placeholder="input search text"
            className=" w-full"
            style={{
              borderRadius: "0px",
            }}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(event) => { console.log("==========>  ", event); filterPatient(event) }}
            notFoundContent={null}
            options={(searchPatient || []).map((patient, index) => ({
              value: patient.value,
              label: (
                <li key={index} className="hover:bg-gray-100 w-full z-50 font-medium flex justify-between"
                  onClick={() => navigate('/dashboard/patientlist/patientdetails', { state: patient?._id })}>
                  <p className="mb-0 font-sans">{patient?.firstName + " " + patient?.lastName}</p>
                  <p className="font-normal font-sans"><span>Date - </span>{patient?.registrationDate}/-</p>
                </li>
              ),
            }))}
          />
        </div>
        <div className="flex md:justify-end gap-2 sm:gap-5 items-center p-1 lg:p-0 w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div
              className="cursor-pointer flex items-center pt-3 font-medium "
              onClick={toggleDropdown}
            >
              <p>{auth && auth?.name ? auth.name : auth?.userName}</p>
            </div>
          </div>

          {isOpen && (
            <div className="absolute top-40 md:right-5 sm:top-36 z-10 lg:top-16 md:top-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-3 px-4">
                <div className="flex items-center">
                  <img
                    alt="User"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {auth && auth?.name ? auth.name : auth?.userName}
                    </p>
                    <p className="text-sm text-gray-500">{auth && auth?.phone ? auth.phone : auth?.userPhone}</p>
                  </div>
                </div>
              </div>
              <div className="py-1 bg-white">
                <hr />
                <ButtonComponent
                  title={<><AiOutlineEdit /> Edit Profile</>}
                  className={`w-full px-4 py-2 text-sm text-left bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium ${auth?.userName ? "hidden" : ""}`}
                  onClick={editProfile}
                />
                {/* <hr />
                <ButtonComponent
                  title={<><MdOutlineVerifiedUser /> Browse Code</>}
                  className="w-full px-4 py-2 text-sm text-left bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium"
                  onClick={() => alert("Browse Code Clicked")}
                /> */}
                <hr />
                <ButtonComponent
                  title={<><IoMdLogOut />Sign Out</>}
                  className="w-full text-black px-4 py-2 text-sm text-left bg-white hover:bg-gray-100 flex items-center gap-2 font-medium"
                  onClick={signOut}
                />

              </div>
            </div>
          )}

          <div className="flex items-center  w-[1px] h-8 bg-gray-500"></div>
          <div className="flex justify-center items-center gap-3 sm:gap-5 ">
            <ButtonComponent
              title="?Help"
              className=" bg-gradient-to-r from-[#decde9] to-[#d8caef] text-[#531dab] font-bold text-[12px] rounded-lg border border-purple-600"
            />
            <ButtonComponent
              title={<IoSettingsOutline />}
              className="bg-transparent text-black text-xl border-2 rounded-md font-semibold py-0"
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0" onClick={toggleDropdown}></div>
      )}
    </>
  );
}

export default TopNavbar;



