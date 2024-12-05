import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { useSelector } from 'react-redux';
import { useGetPatientMutation } from "../../../redux/services/adminApi.service.js";
import { ButtonComponent, ReportFormate } from '../../index.js'
import { useNavigate } from 'react-router-dom';
import {
  Button as ModalButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { HiMiniXMark } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';

const Report = () => {
  const [patients, setPatients] = useState([]);
  const [getPatient] = useGetPatientMutation();
  const [patientId, setPatientId] = useState('');
  const admin = useSelector((state) => state.admin);
  const [modal, setModal] = React.useState(null);

  const handleBillpdfOpen = (value) => setModal(value);
  const navigate = useNavigate();  // navigate to the doctor_report route
  const [openModal, setOpenModal] = useState(null);
  const handleCloseModal = () => setOpenModal(null);
  const [modalTest, setModalTest] = useState([]);

  const reportPrint = (id) => {
    setPatientId(id)
    handleBillpdfOpen("report")
  }
  const testModal = (newtest) => {
    setModalTest(newtest)
    setOpenModal("test")
  }
  useEffect(() => {

    getPatient({ id: admin.admin.id }).then((response) => {

      const fetchedData = response?.data.data?.patient?.map(patient => ({
        viewdetails: '',
        patientId: patient.patient?._id,
        name: `${patient.patient?.firstName} ${patient.patient?.lastName} , ${patient.patient?.age} ${patient.patient?.ageType}, ${patient.patient?.gender ? patient.patient?.gender : 'NA'}`,
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
        totalPayment: patient.totalPayment ? patient?.totalPayment : 0,
        date: patient?.patient?.registrationDate ? patient?.patient?.registrationDate : "-",
        status: patient.patient?.approveStatus ? (
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

        action: <div className='flex gap-4'><ButtonComponent title="View&nbsp;Report" className={` py-0 h-8 ${!patient.paymentStatus ? "bg-btn-color text-white" : "bg-gray-2000 text-gray-500 border border-gray-400"}`}
          onClick={() => {
            // patient.patient?.approveStatus ? reportPrint(patient.patient._id) :
            navigate(`/dashboard/doctor_report`, { state: { id: patient.patient?._id } });
          }} />
        </div>,

      }));
      setPatients(fetchedData);
    }).catch((error) => {
    });
  }, []);

  const columns = [
    {
      accessorKey: 'patientId',
      header: 'Patient ID',
      size: 40,
    },
    {
      accessorKey: 'name',
      header: 'Patient Details',
      size: 100,
    },
    {
      accessorKey: 'referencedoctor',
      header: 'Rf. Doctor',
      size: 100,
    },
    {
      accessorKey: 'test',
      header: 'Tests',
    },
    {
      accessorKey: 'totalPayment',
      header: 'Amount (in ₹)',
      size: 100,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 100,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: patients,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableColumnActions: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {/* bill pdf  modal */}
      <Dialog
        open={modal === "report"}
        size={"lg"}
        handler={handleBillpdfOpen}
        className="rounded-none"
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
        <DialogBody className="max-h-[90vh] overflow-y-auto font-regular">
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

export default Report;
