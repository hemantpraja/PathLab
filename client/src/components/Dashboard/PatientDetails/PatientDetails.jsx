import React, { useEffect, useState } from 'react'
import { LuUser2 } from "react-icons/lu";
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ButtonComponent, ReportFormate } from '../../index.js';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetOnePatientMutation } from '../../../redux/services/adminApi.service.js';
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { HiMiniXMark } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';

function PatientDetails() {
  const location = useLocation();
  const patientId = location.state;
  const admin = useSelector(state => state.admin);
  const [getOnePatient] = useGetOnePatientMutation();
  const [size, setSize] = React.useState(null);
  const [patient, setPatient] = useState({});
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
      },
      {
        accessorKey: 'billId',
        header: 'BIll ID',
        size: 150,
      },
      {
        accessorKey: 'tests',
        header: 'Tests',
        size: 200,
      },
      {
        accessorKey: 'rfDoctor',
        header: 'RF. Doctor',
        size: 150,
      },
      {
        accessorKey: 'due',
        header: 'Due (in ₹)',
        size: 150,
      },
      {
        accessorKey: 'amount',
        header: 'Amount (in ₹)',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        size: 150,
      },
    ], []
  );

  const viewReport = () => {
    handleBillpdfOpen("lg");
  }
  const [openModal, setOpenModal] = useState(null);
  const handleCloseModal = () => setOpenModal(null);
  const [modalTest, setModalTest] = useState([]);
  const testModal = (newtest) => {
    setModalTest(newtest)
    setOpenModal("test")
  }
  const handleBillpdfOpen = (value) => setSize(value);
  console.log("Patient ", patientId)
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getOnePatient({ id: admin.admin.id, _id: patientId });
        if (response.data.data) {
          const patientData = response.data.data.patient;
          console.log("response.data.data.patient", patientData?.testDetails);
          setPatient(response.data.data);

          const userData = {
            date: patientData.registrationDate,
            billId: '1234567890',
            tests: patientData?.testDetails ? (
              <div>
                {patientData.testDetails.length > 2 ? (
                  <div>
                    <p>
                      {patientData.testDetails.slice(0, 2).map(test => test.testName).join(', ')}
                      <h6
                        onClick={() => testModal(patientData.testDetails.map(test => test.testName))}
                        className="text-blue-500 cursor-pointer"
                      >
                        ....View More
                      </h6>
                    </p>
                  </div>
                ) : (
                  <p>{patientData.testDetails.map(test => test.testName).join(', ')}</p>
                )}
              </div>
            ) : (
              <p>No tests available</p>
            ),
            rfDoctor: response.data.data.organisation?.referralName || "self",
            due: patientData.duePayment || 0,
            amount: patientData.totalPayment || 0,
            status: patientData.approveStatus ? (
              <button
                type="button"
                className="flex items-center py-1 px-2 text-[#52c41a] border bg-[#f6ffed] border-[#52c41a]"
                disabled
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#52c41a">
                  <path d="M10 15.172l-3.586-3.586-1.414 1.414L10 18 20 8l-1.414-1.414z" />
                </svg>
                Completed
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center py-1 px-2 text-blue-400 border border-blue-100 bg-blue-50"
                disabled
              >
                <svg className="animate-spin h-4 w-4 mr-3 text-blue-400" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path fill="currentColor" d="M4 10a8 8 0 018-8"></path>
                </svg>
                Ongoing
              </button>
            ),
            action: (
              <ButtonComponent
                title="View Report"
                className={`${patientData.approveStatus ? "text-white h-8 flex items-center bg-btn-color justify-center" : "bg-gray-200 text-gray-500 border border-gray-400 h-8 flex items-center"}`}
                onClick={() => { patientData.approveStatus ? viewReport() : '' }}
              />
            ),
          };

          setData([userData]);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    getData();
  }, [patientId, admin.admin.id]);


  const table = useMaterialReactTable({
    columns,
    data,
  });

  return (
    <>
      {patient && (<div className='w-full p-3 bg-background'>
        <p className='font-medium text-lg font-regular'>Patient Details</p>
        <div className='flex bg-white px-2 lg:px-5 gap-5 flex-wrap py-5 sm:py-3 lg:py-0 font-regular'>
          <div className='py-4 flex justify-center items-center'>
            <LuUser2 className='text-7xl text-white bg-gray-400 text-primary rounded-full p-2' />
          </div>
          <div className='flex flex-col justify-center px-5'>
            <p className='text-lg font-bold'>{patient?.patient?.firstName}</p>
            <p className='text-md text-gray-5000 font-normal'>{patient?.patient?._id}</p>
          </div>
          <div className='flex flex-col  justify-center px-5'>
            <p className='text-sm font-medium text-gray-600'>Gender</p>
            <p className='text-sm text-gray-500 font-medium text-start'>{patient?.patient?.gender}</p>
          </div>
          <div className='flex flex-col  justify-center px-5'>
            <p className='text-sm font-medium text-gray-600'>Age</p>
            <p className='text-sm text-gray-500 font-medium text-start'>{patient?.patient?.age}/{patient?.patient?.ageType}</p>
          </div>
          <div className='flex flex-col  justify-center px-5'>
            <p className='text-sm font-medium text-gray-600'>Contact</p>
            <p className='text-sm text-gray-500 font-medium text-start'>{patient?.patient?.phone}</p>
          </div>
          <div className='flex flex-col  justify-center px-5'>
            <p className='text-sm font-medium text-gray-600'>Email</p>
            <p className='text-sm text-gray-500 font-medium text-start'>{patient?.patient?.email}</p>
          </div>
          <div className='flex flex-col  justify-center px-5'>
            <p className='text-sm font-medium text-gray-600'>Address</p>
            <p className='text-sm text-gray-500 font-medium text-start'>{patient?.patient?.address}</p>
          </div>
        </div>

        <div className='mt-5 p-3 bg-white font-regular'>
          <p className='text-md font-medium text-gray-500'>Medical History</p>
          <MaterialReactTable table={table} className="shadow-none" />;

        </div>
      </div>)}


      {/* bill pdf  modal */}
      <Dialog
        open={size === "lg"}
        size={size || "lg"}
        handler={handleBillpdfOpen}
        className='rounded-none'
      >
        <DialogHeader className='w-full mb-0 py-2'>
          <div className="flex justify-between items-center w-full mb-0">
            <div className='mb-0'>
              <span className="text-[18px] font-medium">Report</span>
            </div>
            <div className='mb-0 flex justify-center items-center '>
              <HiMiniXMark
                onClick={() => handleBillpdfOpen(null)}
                className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
              />
            </div>
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="max-h-[90vh] overflow-y-auto">
          {patient && <ReportFormate userId={patient?.patient?._id} />}
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
  )
}

export default PatientDetails


