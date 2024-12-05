import React, { useState, useMemo, useEffect } from "react";
import { ButtonComponent, InputField, SelectBox } from "../../index";
import { role } from "../../../constants/constants";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useManageUserMutation, useGetUserDetailsMutation, useManageUserLoginMutation } from "../../../redux/services/labApi.service.js";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { IoMdDownload as DownloadIcon } from "react-icons/io";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import { download, generateCsv, mkConfig } from 'export-to-csv';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const ManageUsers = () => {

  const [manageUser] = useManageUserMutation();
  const [getUserDetails] = useGetUserDetailsMutation();
  const [manageUserLogin] = useManageUserLoginMutation();
  const [size, setSize] = useState(null);
  const [roleChange, setRoleChange] = useState("all")
  const [showRoles, setUserRoles] = useState({
    reception: false,
    technician: false,
    doctor: false
  });
  const [editUser, setEditUser] = useState({});
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userGender: '',
    email: '',
    loginStatus: false,
    role: {
      reception: {
        isActive: false, tabs: {
          newRegistration: false,
          patientList: false
        }, permissions: {
          editBill: false,
          editTestPrice: false,
          deleteBill: false,
          deleteTestPrice: false,
          clearDue: false
        }
      },
      technician: {
        isActive: false, tabs: {

        }
      },
      doctor: { isActive: false, tabs: {}, permissions: {} },
    }
  });


  useEffect(() => {
    setUserRoles({
      reception: editUser.role?.reception?.isActive,
      technician: editUser.role?.technician?.isActive,
      doctor: editUser.role?.doctor?.isActive
    });
    setFormData({
      ...formData,
      userName: editUser?.userName,
      userPhone: editUser?.userPhone,
      userGender: editUser?.userGender,
      email: editUser?.email,
      loginStatus: editUser?.loginStatus,
      role: {
        reception: {
          isActive: editUser.role?.reception?.isActive,
          tabs: editUser.role?.reception?.tabs,
          permissions: editUser.role?.reception?.permissions
        },
        technician: {
          isActive: editUser.role?.technician?.isActive,
          tabs: editUser.role?.technician?.tabs,
        },
        doctor: {
          isActive: editUser.role?.doctor?.isActive,
          tabs: editUser.role?.doctor?.tabs,
          permissions: editUser.role?.doctor?.permissions
        }
      }

    })
  }, [editUser])


  const handleLogin = async (id, status) => {
    const response = await manageUserLogin({ id: admin.admin.id, manageUserId: id, loginStatus: status });
    if (response.data.success) {
      toast.success(response.data.message);
      setFormData({
        ...formData,
        loginStatus: response.data.data
      })
    }
  }

  const admin = useSelector((state) => state.admin);
  const handleOpen = (value) => setSize(value);

  const fetchData = async () => {
    const response = await getUserDetails({ id: admin.admin.id });

    if (response.data.success) {

      const manageUser = response.data.data
        .filter(item => roleChange === 'all' || roleChange === '' || item.role[roleChange]?.isActive)
        .map((item, index) => (
          {
            ...item,
            sno: index + 1,
            role: Object.keys(item.role).filter(key => item.role[key].isActive).join(','),
            action: (
              <ButtonComponent
                onClick={() => { setEditUser(item); handleOpen("lg") }}
                key={`action-${index}`}
                title={<FaEdit className="text-xl flex items-center text-gray-700" />}
                className="bg-transparent"
              />
            ),
            userAccess: (
              <div className="inline-flex items-center" key={`userAccess-${index}`}>
                <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
                  <input
                    onChange={(e) => handleLogin(item._id, e.target.checked)}
                    id={`switch-component-${index}`}
                    type="checkbox"
                    className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-100 checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                    defaultChecked={item?.loginStatus}
                  />
                  <label
                    htmlFor={`switch-component-${index}`}
                    className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                  >
                    <div
                      className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                      data-ripple-dark="true"
                    ></div>
                  </label>
                </div>
              </div>
            )
          }
        ));
      setUserData(manageUser);
    }
  };

  useEffect(() => {
    fetchData();
  }, [admin.admin.id, roleChange]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (role, key, value) => {
    setFormData(prevState => ({
      ...prevState,
      role: {
        ...prevState.role,
        [role]: {
          ...prevState.role[role],
          [key]: value
        }
      }
    }));
  };

  const handleTabChange = (role, tab, value) => {
    setFormData(prevState => ({
      ...prevState,
      role: {
        ...prevState.role,
        [role]: {
          ...prevState.role[role],
          tabs: {
            ...prevState.role[role].tabs,
            [tab]: value
          }
        }
      }
    }));
  };

  const handlePermissionChange = (role, permission, value) => {
    setFormData(prevState => ({
      ...prevState,
      role: {
        ...prevState.role,
        [role]: {
          ...prevState.role[role],
          permissions: {
            ...prevState.role[role].permissions,
            [permission]: value
          }
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const newData = { ...formData, adminId: admin.admin.id }

      if (newData.role.reception.isActive === false) {
        newData.role.reception.tabs = {
          newRegistration: false,
          patientList: false
        };
        newData.role.reception.permissions = {
          editBill: false,
          editTestPrice: false,
          deleteBill: false,
          editPatient: false,
          clearDue: false
        };
      }

      if (newData.role.technician.isActive === false) {
        newData.role.technician.tabs = {
          reportsEntry: false,
          testList: false
        };
      }

      if (newData.role.doctor.isActive === false) {
        newData.role.doctor.tabs = {
          enterVerify: false,
          patientList: false
        };
        newData.role.doctor.permissions = {
          editTestPrice: false,
          editTest: false,
          addNewTest: false,
          editPackage: false,
          addNewPackage: false,
          deletePackage: false
        };
      }

      if (editUser._id) {

        newData.id = editUser._id

        const response = await manageUser(newData);
        if (response.data.success) {
          fetchData();
          toast.success(response.data.message);
          handleOpen(null);
        }
        else {
          toast.error(response.data.message);
          handleOpen(null);
        }
      }
      else {
        const response = await manageUser(newData);
        if (response.data.success) {
          fetchData();
          toast.success(response.data.message);
          handleOpen(null);
        }
        else {
          toast.error(response.data.message);
          handleOpen(null);
        }
      }

    } catch (error) {
      console.error("Error : ManageUsers > handleSubmit : ", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "sno",
        header: "Sr. No.",
        size: 150
      },
      {
        accessorKey: "userName",
        header: "Name",
        size: 150
      },
      {
        accessorKey: "userGender",
        header: "Gender",
        size: 200
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150
      },
      {
        accessorKey: "userPhone",
        header: "Contact No.",
        size: 150
      },
      {
        accessorKey: "userAccess",
        header: "Login Access",
        size: 150
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 150
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const dataForExport = mapDataForExport(rowData);
    const csv = generateCsv(csvConfig)(dataForExport);
    download(csvConfig)(csv);
  };

  const mapDataForExport = (data) => {
    console.log("data : ", data);
    return data.map(item => {
      const { action, userAccess, sno, verify, loginStatus, logoutStatus, blockStatus, ...rest } = item;
      return {
        ...rest,
        LoginAccess: item.loginStatus ? "Yes" : "No",
        Status: item.blockStatus ? "Block" : "Unblock"
      };
    });
  };

  const handleExportData = () => {
    const dataForExport = mapDataForExport(userData);
    const csv = generateCsv(csvConfig)(dataForExport);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: userData,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',

    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex flex-col md:flex-row  gap-6 overflow sm:pb-5 sm:py-2 w-full" >
        <ButtonComponent
          title={<><DownloadIcon className='text-sm' /> Selected Rows</>}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          className={`text-white h-10 sm:h-8 text-sm font-normal flex gap-1 rounded-sm w-32 sm:w-48 justify-center items-center ${(!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) ? "bg-gray-400" : "bg-theme-color"} `}          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}

        />
        <ButtonComponent
          onClick={handleExportData}
          title={<><DownloadIcon className='text-sm' /> Export All Rows</>}
          className={`text-white h-10 sm:h-8 text-sm font-normal rounded-sm flex gap-1 w-32 sm:w-40 justify-center items-center ${(table.getPrePaginationRowModel().rows.length === 0) ? "bg-gray-400" : "bg-theme-color"} `}
        />

        <ButtonComponent
          title={<><DownloadIcon className='text-sm' /> Export Page Rows</>}
          disabled={table.getRowModel().rows.length === 0}
          className={`text-white h-10 sm:h-8 text-sm font-normal flex gap-1 rounded-sm w-32 sm:w-40 justify-center items-center ${(table.getRowModel().rows.length === 0) ? "bg-gray-400" : "bg-theme-color"} `}          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
        />
      </div>
    ),
  });

  return (
    <div className="p-5 bg-background">
      <div className="bg-white p-4">

        {/* row 1 */}
        <div className="flex justify-between">
          <div className="text-xl">
            <p className="font-semibold">User List</p>
          </div>
          <div className="flex items-center justify-center gap-5">
            <SelectBox options={role} className="w-60" mainStyle="flex-col" onChange={(e) => setRoleChange(e.target.value)} />

            <div onClick={() => {
              setEditUser({}); handleOpen("lg")
            }}>
              <ButtonComponent
                title={
                  <>
                    <FaPlus /> Add User
                  </>
                }
                className="flex items-center text-white gap-1  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="py-2 w-full">
        {/* <MaterialReactTable
          columns={columns}
          data={userData}
          enableColumnActions={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableColumnVisibility={false}
          getRowId={(row) => row.sno}
        /> */}
        <MaterialReactTable table={table} sx={{
          boxShadow: 'none',
        }} />
      </div>

      <Dialog open={size === "lg"} size={size || "lg"} handler={handleOpen} className="rounded-none">
        <DialogHeader className="flex justify-between py-1">
          <div>
            <p className="text-[20px] font-regular">Add User</p>
          </div>
          <div onClick={() => handleOpen(null)}>
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="md:flex justify-between gap-5 h-96 p-4 max-h-[90vh] overflow-y-auto">
          <div className="w-full">
            <div>
              <p className="text-md font-normal py-2 "> <span className="text-red-500">* </span>Role </p>
              <input type="checkbox" id="reception"
                checked={showRoles?.reception}
                onChange={() => {
                  setUserRoles({ ...showRoles, reception: !showRoles?.reception });
                  handleRoleChange('reception', 'isActive', !showRoles?.reception);
                }}
              />
              <label htmlFor="reception" className="px-2"> Reception </label>
              <input type="checkbox" id="technician"
                checked={showRoles?.technician}
                onChange={() => {
                  setUserRoles({ ...showRoles, technician: !showRoles?.technician });
                  handleRoleChange('technician', 'isActive', !showRoles?.technician);
                }}
              />
              <label htmlFor="technician" className="px-2"> Technician </label>
              <input type="checkbox" id="doctor"
                checked={showRoles?.doctor}
                onChange={() => {
                  setUserRoles({ ...showRoles, doctor: !showRoles?.doctor });
                  handleRoleChange('doctor', 'isActive', !showRoles?.doctor);
                }}
              />
              <label htmlFor="doctor" className="px-2"> Doctor </label>
            </div>

            <div className="py-4 font-normal">
              <InputField name="userName" placeholder="Name" label="* Name" isSearch={false}
                onChange={handleChange} defaultValue={editUser?.userName} />
            </div>
            <div className="py-4 font-normal">
              <InputField name="userPhone" placeholder="Contact" label="* Contact" isSearch={false}
                onChange={handleChange} defaultValue={editUser?.userPhone}

              />
            </div>
            <div className="py-4 px-2">
              <input type="radio" id="male" name="userGender" value="Male"
                onChange={handleChange} defaultChecked={editUser?.userGender === "Male"}
              />
              <label htmlFor="male" className="px-2"> Male </label>

              <input type="radio" id="female" name="userGender" value="Female"
                onChange={handleChange} defaultChecked={editUser?.userGender === "Female"}
              />
              <label htmlFor="female" className="px-2"> Female </label>

              <input type="radio" id="other" name="userGender" value="Other"
                onChange={handleChange} defaultChecked={editUser?.userGender === "Other"}
              />
              <label htmlFor="other" className="px-2"> Others </label>
            </div>
            <div className="py-4 font-normal">
              <InputField type="email" name="email" placeholder="Email" label="Email"
                defaultValue={editUser?.email}
                // disabled={editUser?.email ? true : false}
                isSearch={false} onChange={handleChange} />
            </div>
          </div>

          <div className="bg-gray-300 w-[1px]"></div>

          <div className="w-full overflow-y-scroll">
            {showRoles.reception && (
              <div className="text-start py-5">
                <p className="bg-gray-50 px-5 py-2 border-2 font-medium">Reception</p>
                <div className="flex justify-between border-2 p-3">
                  <div className="text-sm">
                    <p className="font-medium py-1">Tabs</p>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="newregistration" checked={formData?.role?.reception?.tabs?.newRegistration} onChange={(e) => handleTabChange('reception', 'newRegistration', e.target.checked)} />
                      <label htmlFor="newregistration" className="px-2"> New Registration </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="patientlist" checked={formData?.role?.reception?.tabs?.patientList} onChange={(e) => handleTabChange('reception', 'patientList', e.target.checked)} />
                      <label htmlFor="patientlist" className="px-2"> Patient List </label>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium py-1">Permissions</p>
                    <div className="font-normal py-1">
                      <input type="checkbox" id="edit" checked={formData?.role?.reception?.permissions?.editBill} onChange={(e) => handlePermissionChange('reception', 'editBill', e.target.checked)} />
                      <label htmlFor="edit" className="px-2"> Edit Bill </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="testprice" checked={formData?.role?.reception?.permissions?.editTestPrice} onChange={(e) => handlePermissionChange('reception', 'editTestPrice', e.target.checked)} />
                      <label htmlFor="testprice" className="px-2"> Edit Test Price </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="deletebill" checked={formData?.role?.reception?.permissions?.deleteBill} onChange={(e) => handlePermissionChange('reception', 'deleteBill', e.target.checked)} />
                      <label htmlFor="deletebill" className="px-2"> Delete Bill </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="patient" checked={formData?.role?.reception?.permissions?.editPatient} onChange={(e) => handlePermissionChange('reception', 'editPatient', e.target.checked)} />
                      <label htmlFor="patient" className="px-2"> Edit Patient </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="due" checked={formData?.role?.reception?.permissions?.clearDue} onChange={(e) => handlePermissionChange('reception', 'clearDue', e.target.checked)} />
                      <label htmlFor="due" className="px-2"> Clear Due </label>
                    </div>

                  </div>
                </div>
              </div>
            )}
            {showRoles.technician && (
              <div className="text-start py-5">
                <p className="bg-gray-50 px-5 py-2 border-2 font-medium">Technician</p>
                <div className="flex justify-between border-2 p-3">
                  <div className="text-sm">
                    <p className="font-medium py-1">Tabs</p>
                    <div className="font-normal py-1">
                      <input type="checkbox" id="reportentry" checked={formData?.role?.technician?.tabs?.reportsEntry} onChange={(e) => handleTabChange('technician', 'reportsEntry', e.target.checked)} />
                      <label htmlFor="reportentry" className="px-2"> Report Entry </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="testpackagelist" checked={formData?.role?.technician?.tabs?.testList} onChange={(e) => handleTabChange('technician', 'testList', e.target.checked)} />
                      <label htmlFor="testpackagelist" className="px-2"> Test / Package List </label>
                    </div>

                  </div>
                </div>
              </div>
            )}
            {showRoles.doctor && (
              <div className="text-start py-5">
                <p className="bg-gray-50 px-5 py-2 border-2 font-medium">Doctor</p>
                <div className="flex justify-between border-2 p-3">
                  <div className="text-sm">
                    <p className="font-medium py-1">Tabs</p>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="entryverify" checked={formData?.role?.doctor?.tabs?.enterVerify} onChange={(e) => handleTabChange('doctor', 'enterVerify', e.target.checked)} />
                      <label htmlFor="entryverify" className="px-2"> Entry & Verify </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="testpackagelist" checked={formData?.role?.doctor?.tabs?.patientList} onChange={(e) => handleTabChange('doctor', 'patientList', e.target.checked)} />
                      <label htmlFor="testpackagelist" className="px-2"> Test / Package List </label>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium py-1">Permissions</p>
                    <div className="font-normal py-1">
                      <input type="checkbox" id="edittestprice" checked={formData?.role?.doctor?.permissions?.editTestPrice} onChange={(e) => handlePermissionChange('doctor', 'editTestPrice', e.target.checked)} />
                      <label htmlFor="edittestprice" className="px-2"> Edit Test Price </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="edittest" checked={formData?.role?.doctor?.permissions?.editTest} onChange={(e) => handlePermissionChange('doctor', 'editTest', e.target.checked)} />
                      <label htmlFor="edittest" className="px-2"> Edit Test </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="newtest" checked={formData?.role?.doctor?.permissions?.addNewTest} onChange={(e) => handlePermissionChange('doctor', 'addNewTest', e.target.checked)} />
                      <label htmlFor="newtest" className="px-2"> Add New Test </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="editpackage" checked={formData?.role?.doctor?.permissions?.editPackage} onChange={(e) => handlePermissionChange('doctor', 'editPackage', e.target.checked)} />
                      <label htmlFor="editpackage" className="px-2"> Edit Package </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="newpackage" checked={formData?.role?.doctor?.permissions?.addNewPackage} onChange={(e) => handlePermissionChange('doctor', 'addNewPackage', e.target.checked)} />
                      <label htmlFor="newpackage" className="px-2"> Add New Package </label>
                    </div>

                    <div className="font-normal py-1">
                      <input type="checkbox" id="deletepackage" checked={formData?.role?.doctor?.permissions?.deletePackage} onChange={(e) => handlePermissionChange('doctor', 'deletePackage', e.target.checked)} />
                      <label htmlFor="deletepackage" className="px-2"> Delete Package </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonComponent title="Save" className="text-white w-28 flex items-center justify-center h-8 font-medium  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" onClick={handleSubmit} />
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageUsers;
