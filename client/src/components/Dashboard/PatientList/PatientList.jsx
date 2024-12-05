import React, { useEffect, useState } from 'react';
import {
  Button as ModalButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useMemo } from 'react';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, alertTitleClasses } from '@mui/material';
import { useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  useGetPatientMutation,
  useGetOnePatientMutation,
  useGetSampleCollectorMutation,
  useGetOrganisationMutation,
  useGetAddressMutation
} from "../../../redux/services/adminApi.service.js";
import { BillFormate, ButtonComponent, InputField, ReportFormate, SelectBox } from '../../index.js'
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { agetype, contact, designation } from '../../../constants/constants.js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAddPatientMutation } from '../../../redux/services/adminApi.service.js';
import { useDeleteOnePatientMutation } from '../../../redux/services/adminApi.service.js';
import toast from 'react-hot-toast';
import { IoMdDownload } from 'react-icons/io';
import { HiMiniXMark } from "react-icons/hi2";


const PatientList = () => {

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [getPatient] = useGetPatientMutation();
  const [getOnePatient] = useGetOnePatientMutation();
  const [getSampleCollector] = useGetSampleCollectorMutation();
  const [getOrganisation] = useGetOrganisationMutation();
  const [getAddress] = useGetAddressMutation();
  const admin = useSelector((state) => state.admin);
  const [roleManageData, setRoleManageData] = useState({});
  const [modal, setModal] = React.useState(null);
  const [onePatientDetails, setOnePatinetDetails] = useState({})
  const handleOpen = (value) => setSize(value);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [allsampleCollector, setSampleCollector] = useState([]);
  const [organisation, setOrganisation] = useState([]);
  const [address, setAddress] = useState([]);
  const [addPatient, { isLoading }] = useAddPatientMutation();
  const [deleteOnePatient, { isLoading: deleteOnePatientLoading }] = useDeleteOnePatientMutation();
  const readingStatus = true;
  const navigate = useNavigate();

  const handleBillpdfOpen = (value) => setModal(value);
  const [openModal, setOpenModal] = useState(null);
  const handleCloseModal = () => setOpenModal(null);
  const [modalTest, setModalTest] = useState([]);

  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;
      const roleAccessData = {
        editPatient: !roleData?.reception?.permissions?.editPatient,
      }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);

  const billPrint = (id) => {
    setPatientId(id)
    handleBillpdfOpen("bill")
  }

  const reportPrint = (id) => {
    setPatientId(id)
    handleBillpdfOpen("report")
  }

  const editPatient = (id) => {
    setPatientId(id)
    handleBillpdfOpen("editpatient")
  }

  const testModal = (newtest) => {
    setModalTest(newtest)
    setOpenModal("test")
  }

  const getPatientData = () => {
    getPatient({ id: admin?.admin?.id }).then((response) => {
      const fetchedData = response.data?.data?.patient?.map(patient => ({
        viewdetails: '',
        patientId: patient?.patient?._id,
        name: `${patient?.patient?.firstName} ${patient?.patient?.lastName} , ${patient?.patient?.age} ${patient?.patient?.ageType}, ${patient?.patient?.gender ? patient?.patient?.gender : 'NA'}`,
        referencedoctor: patient.collector?.name ? patient.collector?.name : "Self",
        test: patient?.patient?.testDetails ? <div>
          {
            patient?.patient?.testDetails?.length > 2
              ? <div>
                <p>{patient.patient.testDetails.slice(0, 2).map(test => test.testName).join(', ')}
                  <h4 onClick={() => testModal(patient.patient.testDetails?.map(test => test.testName))}
                    className=" text-blue-500"
                  >....View More</h4>
                </p>
              </div>

              : <p>{patient?.patient?.testDetails?.map(test => test.testName).join(', ')}</p>
          }
        </div> : '',
        totalPayment: patient?.totalPayment ? patient?.totalPayment : 0,
        date: patient?.patient?.registrationDate ? patient?.patient?.registrationDate : "-",
        status: patient?.patient?.approveStatus ? (
          <button type="button" className="flex items-center py-1 px-2 text-[#52c41a] border bg-[#f6ffed] border-[#52c41a]" disabled>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#52c41a">
              <path d="M10 15.172l-3.586-3.586-1.414 1.414L10 18 20 8l-1.414-1.414z" />
            </svg>
            Completed
          </button>
        ) :
          <button type="button" className="flex items-center py-1 px-2 text-blue-400 border border-blue-100 bg-blue-50 " disabled>
            <svg className="animate-spin h-4 w-4 mr-3 text-blue-400" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path fill="currentColor" d="M4 10a8 8 0 018-8"></path>
            </svg>
            Ongoing
          </button>,

        action: <div className='flex gap-4'><ButtonComponent title="Bill" className="text-white py-0 h-8  hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500" onClick={() => { billPrint(patient?.patient?._id) }} />
          <ButtonComponent title="Print&nbsp;Report" onClick={() => { reportPrint(patient?.patient?._id) }} className={` py-0 h-8 ${patient?.patient?.approveStatus === true ? "bg-btn-color text-white" : "bg-gray-200 text-gray-500 border border-gray-400"}`}
            disabled={patient?.patient?.approveStatus === true ? false : true}
          /> </div>,

        subRows: [{
          patientId: <div>Contact :  <br />Created By :</div>,
          name: <div className='font-semibold'>
            {patient?.patient?.phone} <br />
            {patient?.organisation?.referralName} <br />
          </div>,

          referencedoctor: <div>Sample&nbsp;Collector&nbsp;:- <br />Collected&nbsp;at&nbsp;:-</div>,

          test: <div className='font-semibold'>
            {patient?.collector?.name ? patient?.collector?.name : "Self"} <br />
            {patient?.collected?.address ? patient?.collected?.address : "Self"}
          </div>,

          totalPayment: patient?.totalPayment,
          action:
            <div className='space-y-2 py-2'>
              <ButtonComponent title="View Details" onClick={() => navigate('patientdetails', { state: patient?.patient?._id })} className="bg-white text-btn-color border border-btn-color" />
              <ButtonComponent onClick={() => { editPatient(patient?.patient?._id), patientDetails(patient?.patient?._id) }} variant="gradient" title="Edit Patient" className={`${roleManageData?.editPatient ? "hidden" : ""}  bg-white text-btn-color border border-btn-color`} />
              <ButtonComponent onClick={() => deleteOnepatientDetails(patient?.patient?._id)} title="Delete" className="bg-red-500 text-white border" />
            </div>
        }],
      }));
      if (response.data?.data?.patient?.length > 0 && response.data?.data?.patient[0]?.patient?._id) {
        setPatients(fetchedData);
      }
      else {
        setPatients([]);
      }

    }).catch((error) => {
    });
  }

  const deleteOnepatientDetails = async (id) => {
    try {
      const response = await deleteOnePatient({ id: admin.admin.id, _id: id })
      if (response.data.success) {
        getPatientData();
        toast.success(response.data.message)
      }
    } catch (error) {
    }
  }

  const onSubmit = async (data) => {
    try {
      const response = await addPatient({ ...data, id: admin.admin.id, })
      if (response.data.success) {
        getPatientData();
        toast.success(response.data.message)
        handleBillpdfOpen(null)
      }
    }
    catch (error) {
      handleBillpdfOpen(null)
    }
  }

  const patientDetails = async (id) => {
    try {
      let response = await getOnePatient({ id: admin.admin.id, _id: id });
      if (response.data?.success) {
        setOnePatinetDetails(response?.data?.data)
      }
    }
    catch (error) {
    }
  }

  useEffect(() => {
    if (onePatientDetails) {
      setValue('_id', onePatientDetails.patient?._id || '');
      setValue('namePrefix', onePatientDetails.patient?.namePrefix || '');
      setValue('firstName', onePatientDetails.patient?.firstName || '');
      setValue('lastName', onePatientDetails.patient?.lastName || '');
      setValue('prefixcontact', onePatientDetails.patient?.prefixcontact || '');
      setValue('phone', onePatientDetails.patient?.phone || '');
      setValue('gender', onePatientDetails.patient?.gender || 'male');
      setValue('age', onePatientDetails.patient?.age || '');
      setValue('email', onePatientDetails.patient?.email || '');
      setValue('ageType', onePatientDetails.patient?.ageType || '');
      setValue('address', onePatientDetails.patient?.address || '');
      setValue('sampleCollector', onePatientDetails.collector?._id || '');
      setValue('referral', onePatientDetails.organisation?._id || '');
      setValue('collectedAt', onePatientDetails.collected?._id || '');
    }
  }, [onePatientDetails, setValue]);

  useEffect(() => {
    const fetchSampleCollector = async () => {
      try {
        const responseSampleCollector = await getSampleCollector({ id: admin.admin.id });
        setSampleCollector(responseSampleCollector.data.data);

        const responseAddress = await getAddress({ id: admin.admin.id });
        setAddress(responseAddress.data.data);

        const responseOrganisation = await getOrganisation({ id: admin.admin.id });
        setOrganisation(responseOrganisation.data.data);

      } catch (error) {
      }
    };
    fetchSampleCollector();

    getPatientData();
  }, [admin.admin.id]);


  const mapDataForExport = (data) => {
    return data.map(item => {
      const { viewdetails, action, ...rest } = item;

      return {
        ...rest,
        status: typeof rest.status === 'object' ? rest?.status?.props?.children[1] : rest?.status,
      };
    });
  };

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => {
      const { action, ...rest } = row.original; // Exclude 'action' column
      return Object.values(mapDataForExport([rest])[0]);
    });

    const tableHeaders = columns
      .filter(column => column.accessorKey !== 'action') // Exclude 'action' column
      .map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'patientId',
        header: 'Patient ID',

      },
      {
        accessorKey: 'name',
        header: 'Patient Name',
      },
      {
        accessorKey: 'referencedoctor',
        header: 'RF Doctor',
      },
      {
        accessorKey: 'test',
        header: 'Tests',
      },
      {
        accessorKey: 'totalPayment',
        header: 'Amount (In Rs)',
        size: 100,
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'status',
        header: 'Status',

      },
      {
        accessorKey: 'action',
        header: 'Action',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: patients,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableColumnActions: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableExpandAll: false,
    enableExpanding: true,
    filterFromLeafRows: true,
    getSubRows: (row) => row.subRows,
    paginateExpandedRows: true,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',

        }}
      >
        <ButtonComponent
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          title={<><IoMdDownload className='text-sm' /> Export All Rows</>}
          className={`text-white h-8 text-sm font-normal flex gap-1 justify-center items-center hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 ${(table.getPrePaginationRowModel().rows.length === 0) ? "bg-gray-400" : "bg-btn-color"} `}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
        />
        <ButtonComponent
          title={<><IoMdDownload className='text-sm' /> Export Page Rows</>}
          disabled={table.getRowModel().rows.length === 0}
          className={`text-white h-8 text-sm font-normal flex gap-1 justify-center items-center hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 ${(table.getRowModel().rows.length === 0) ? "bg-gray-400" : "bg-btn-color"} `}
          onClick={() => handleExportRows(table.getRowModel().rows)}
        />
        <ButtonComponent
          title={<><IoMdDownload className='text-sm' /> Export&nbsp;Selected&nbsp;Rows</>}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          className={`text-white h-8 text-sm font-normal flex gap-1 justify-center items-center ${(!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) ? "bg-gray-400" : "bg-btn-color  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"} `}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        />
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} className="" />

      {/*  Edit Patient Modal */}
      {onePatientDetails.patient?._id && (
        <Dialog
          open={
            modal === "editpatient"
          }
          size={"xl"}
          handler={handleBillpdfOpen}
          className='rounded-none '
        >
          {/* <DialogHeader> */}
          <DialogHeader className="flex justify-between py-2">
            <div className="mb-0 font-regular">
              <p className="text-[18px] mb-0 text-gray-600 font-medium">Edit Patient</p>
            </div>
            <div>
              <FaXmark
                onClick={() => handleBillpdfOpen(null)}
                className="mr-1 text-md text-gray-500 mb-0 hover:bg-gray-200 rounded hover:text-gray-800 hover:animate-pulse"
              />
            </div>
            {/* </DialogHeader> */}
          </DialogHeader>
          <hr />

          <DialogBody className="sm:flex gap-2 rounded-none overflow-y-auto lg:overflow-hidden max-h-[70vh] font-regular">
            <div className="w-full sm:px-5 overflow-x-scroll">
              <div className="bg-white font-normal p-5 overflow-scroll">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* 1st row */}
                  <div className="lg:flex lg:gap-5">
                    <div className="flex justify-between w-full ">
                      <div className="">
                        <p className="">Patient ID </p>
                        <input type="hidden" name="_id" defaultValue={onePatientDetails?.patient?._id || ''}
                          {...register("_id", {
                            required: true,
                          })}
                        />
                        <p className="font-semibold">240614002</p>
                      </div>
                      <div className="">
                        <SelectBox
                          options={designation}
                          className="w-24"
                          label="Designation"
                          name="namePrefix"
                          mainStyle="flex-col"
                          defaultValue={onePatientDetails?.patient?.namePrefix || ''}
                          {...register("namePrefix")}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <InputField
                        type="text"
                        label={<><span className='text-red-600'>*</span> First Name</>}
                        placeholder="First Name"
                        labelclass="text-sm"
                        name="firstName"
                        className="text-sm placeholder:text-sm"
                        defaultValue={onePatientDetails?.patient?.firstName || ''}
                        isSearch={false}
                        {...register("firstName", {
                          required: "firstName is required",
                          pattern: {
                            value: /^[A-Z a-z]+((['-][A-Z a-z])?[A-Z a-z]*)*( [A-Z a-z]+((['-][A-Z a-z])?[A-Z a-z]*)*)*$/,
                            message: "firstName must be a valid name"
                          }
                        })}
                      />
                      {errors.firstName && <p className="text-red-600">{errors.firstName?.message}</p>}

                    </div>
                    <div className="w-full">
                      <InputField
                        type="text"
                        label="Last Name"
                        placeholder="Last Name"
                        labelclass="text-sm"
                        className="text-sm placeholder:text-sm"
                        name="lastName"
                        defaultValue={onePatientDetails?.patient?.lastName || ''}
                        isSearch={false}
                        {...register("lastName")}
                      />
                    </div>

                    <div className="flex items-end w-full ">
                      <SelectBox
                        options={contact}
                        className="w-24 "
                        label=" "
                        name="prefixcontact"
                        mainStyle="flex-col"
                        defaultValue={onePatientDetails?.patient?.prefixcontact || ''}
                        {...register("designation", { required: true })}
                      />
                      <InputField
                        type="text"
                        label="Phone Number"
                        placeholder="Contact Number"
                        labelclass="text-sm"
                        className="text-sm placeholder:text-sm"
                        name="phone"
                        defaultValue={onePatientDetails?.patient?.phone || ''}
                        isSearch={false}
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  {/* 2nd row */}
                  <div className="md:flex gap-5 py-5 items-center ">
                    <div className="w-full space-y-2">
                      <div>
                        <p className='text-sm mb-0'><span className='text-red-600'>*</span> Gender</p>
                        {errors.gender && <p className="text-red-600">{errors.gender.message}</p>}
                        <input
                          className="px-2"
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          {...register("gender", { required: true })}
                          defaultChecked={onePatientDetails?.patient?.gender === "male"}
                        />
                        <label className="px-2 text-sm" htmlFor="male">
                          Male
                        </label>
                        <input
                          className="px-2"
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          {...register("gender", { required: "Gender is required" })}
                          defaultChecked={onePatientDetails?.patient?.gender === "female"}
                        />
                        <label className="px-2 text-sm" htmlFor="female">
                          Female
                        </label>
                        <input
                          className="px-2"
                          type="radio"
                          id="other"
                          name="gender"
                          value="other"
                          {...register("gender", { required: true })}
                          defaultChecked={onePatientDetails?.patient?.gender === "other"}
                        />
                        <label className="px-2 text-sm" htmlFor="other">
                          Other
                        </label>
                      </div>
                      <div className="">
                        <InputField
                          type="number"
                          label="Age"
                          placeholder="Age"
                          labelclass="text-sm"
                          className="text-sm placeholder:text-sm"
                          name="age"
                          isSearch={false}
                          defaultValue={onePatientDetails?.patient?.age || ''}
                          {...register("age", { required: "Age is required" })}
                        />
                        {errors.age && <p className="text-red-600">{errors.age.message}</p>}
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="w-full">
                        <InputField
                          type="email"
                          label="Email ID"
                          placeholder="Email "
                          labelclass="text-sm"
                          className="text-sm placeholder:text-sm"
                          name="email"
                          defaultValue={onePatientDetails?.patient?.email || ''}
                          isSearch={false}
                          {...register("email")}
                        />
                      </div>
                      <div className="w-full">
                        <SelectBox
                          options={agetype}
                          labelclass="text-sm"
                          className="text-sm"
                          label="Age Type"
                          mainStyle="flex-col"
                          name="ageType"
                          defaultValue={onePatientDetails?.patient?.ageType || ''}
                          {...register("ageType", {
                            required: "AgeType is required"
                          })}
                        />
                        {errors.ageType && <p className="text-red-600">{errors.ageType.message}</p>}
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="text-gray-600 text-sm" htmlFor="address">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows="4"
                        cols="50"
                        placeholder=""
                        defaultValue={onePatientDetails?.patient?.address || ''}
                        className="border border-gray-300 px-3 py-1  outline-none focus:bg-gray-50 duration-200 border-r w-full"
                        {...register("address")}
                      ></textarea>
                    </div>
                  </div>
                  <hr />

                  {/* 3rd row */}
                  <div className="lg:flex gap-5 py-4">
                    <div className="flex items-end gap-4 w-full">
                      <div className="w-full">
                        <SelectBox
                          options={allsampleCollector.map((allsampleCollector) => {
                            return { value: allsampleCollector?._id, label: allsampleCollector?.name };
                          })}
                          labelclass="text-sm"
                          mainStyle="flex-col"
                          className="text-sm"
                          name="sampleCollector"
                          defaultValue={onePatientDetails?.collector?._id || ''}
                          label={<>Select SampleCollector <span className='text-xs'>(optional)</span></>}
                          {...register("sampleCollector")}
                        />
                      </div>

                    </div>
                    <div className="flex items-end gap-4 w-full">
                      <div className="w-full">
                        <SelectBox
                          options={organisation.map((organisation) => {
                            return { value: organisation?._id, label: organisation?.referralName };
                          })}
                          labelclass="text-sm"
                          name="referral"
                          mainStyle="flex-col"
                          defaultValue={onePatientDetails.organisation?._id || ''}
                          label={<>Select Organisation <span className='text-xs'>(optional)</span></>}
                          {...register("referral")}
                        />
                      </div>

                    </div>
                    <div className="flex items-end gap-4 w-full">
                      <div className="w-full">
                        <SelectBox
                          options={address.map((address) => {
                            return { value: address?._id, label: address?.address };
                          })}
                          className="text-sm"
                          labelclass="text-sm"
                          mainStyle="flex-col"
                          name="collectedAt"
                          defaultValue={onePatientDetails.collected?._id || ''}
                          label={<>Collected at <span className='text-xs'>(optional)</span></>}

                        />
                      </div>

                    </div>
                  </div>
                  <div className='flex justify-end items-center '>
                    <ButtonComponent type="submit" title="Save Details" className="text-white h-9 font-medium flex items-center" />
                  </div>
                </form>

              </div>
            </div>
          </DialogBody>

        </Dialog>
      )}

      {/* Bill Modal */}
      <Dialog
        open={
          modal === "bill"
        }
        size={"md"}
        handler={handleBillpdfOpen}
        className='rounded-none'
      >
        <DialogHeader className='w-full mb-0 py-2'>
          <div className="flex justify-between items-center w-full mb-0">
            <div className='mb-0'>
              <span className="text-[18px] font-medium">Bill</span>
            </div>
            <div className='mb-0 flex justify-center items-center '>
              <HiMiniXMark
                onClick={() => handleBillpdfOpen(null)}
                className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
              />
            </div>
          </div>
          {/* <hr /> */}
        </DialogHeader>
        {/* <hr className='' /> */}
        <DialogBody>
          {patientId && <BillFormate userId={{ patientId: patientId, readingStatus: readingStatus }} />}
        </DialogBody>
      </Dialog>


      {/* Report pdf  modal */}
      <Dialog
        open={modal === "report"}
        size={"lg"}
        handler={handleBillpdfOpen}
      >
        <DialogBody className="max-h-[90vh] overflow-y-auto">
          {patientId && <ReportFormate userId={patientId} />}
        </DialogBody>
      </Dialog>

      <Dialog
        open={openModal === 'test'}
        size={"xs"}
        handler={handleCloseModal}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none"
      >
        <DialogHeader className="flex justify-between py-2">
          <div className="mb-0">
            <p className="text-[18px] mb-0">Test Names </p>
          </div>
          <div onClick={handleCloseModal}>
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="px-2 w-full">
          <div className="">

              {modalTest &&
                modalTest.map((test, index) => (
                  <p className=' text-sm font-regular font-normal mb-0' key={index}>
                    {test}
                  </p>
                ))}

          </div>
        </DialogBody>

      </Dialog>

    </>
  );
};

export default PatientList;