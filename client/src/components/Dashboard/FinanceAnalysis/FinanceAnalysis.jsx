import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, Dialog } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { financeAnalysisLinks } from '../../../constants/constants';
import { useEffect, useState } from 'react';
import { useGetPatientMutation } from '../../../redux/services/adminApi.service';
import { useSelector } from 'react-redux';
import { ButtonComponent } from '../..';
import { IoMdDownload } from "react-icons/io";
import { DialogBody, DialogHeader } from '@material-tailwind/react';
import { FaXmark } from 'react-icons/fa6';


const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    size: 40,
  }),
  columnHelper.accessor('billId', {
    header: 'Bill ID',
    size: 40,
  }),
  columnHelper.accessor('patientName', {
    header: 'Patient Name',
    size: 40,
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
    size: 40,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 40,
  }),
  columnHelper.accessor('paymentType', {
    header: 'Payment Type',
    size: 40,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount(₹)',
    size: 40,
  }),
  columnHelper.accessor('discount', {
    header: 'Discount(₹)',
    size: 40,
  }),
  columnHelper.accessor('paid', {
    header: 'Paid(₹)',
    size: 40,
  }),
  columnHelper.accessor('due', {
    header: 'Due(₹)',
    size: 40,
  }),
  columnHelper.accessor('netAmount', {
    header: 'Net Amount(₹)',
    size: 40,
  }),
];

const referralColumns = [
  columnHelper.accessor('date', {
    header: 'Date',
    size: 100,
  }),
  columnHelper.accessor('patientName', {
    header: 'Patient Name',
    size: 100,
  }),
  columnHelper.accessor('contact', {
    header: 'Patient Contact',
    size: 40,
  }),
  columnHelper.accessor('tests', {
    header: 'Tests',
    size: 200,
  }),
  columnHelper.accessor('organization', {
    header: 'Organization',
    size: 40,
  }),
  columnHelper.accessor('netAmount', {
    header: 'Net Amount(₹)',
    size: 40,
  }),
  columnHelper.accessor('cocession', {
    header: 'Cocession',
    size: 40,
  }),
  columnHelper.accessor('toLab', {
    header: 'To Lab',
    size: 40,
  }),
  columnHelper.accessor('toOrganization', {
    header: 'To Organization',
    size: 100,
  }),

];

const FinanceAnalysis = () => {

  const [links, setNavlinks] = useState(financeAnalysisLinks);
  const [link, setLink] = useState("billingwise");
  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };

  const [getPatient] = useGetPatientMutation();
  const [patients, setPatients] = useState([]);
  const [referalData, setReferralData] = useState([]);
  const admin = useSelector((state) => state.admin);

  const handleLinkClick = (slug, isSublink = false) => {
    const updatedNavlinks = links.map((link) => {

      if (link.slug === slug && !isSublink) {
        return {
          ...link,
          active: true,
          sublink: link.sublink
            ? link.sublink.map((sublink) => ({ ...sublink, active: false }))
            : [],
        };

      } else if (link.sublink) {
        const updatedSublinks = link.sublink.map((sublink) => ({
          ...sublink,
          active: sublink.slug === slug && isSublink,
        }));
        return { ...link, sublink: updatedSublinks, active: false };
      } else {
        return { ...link, active: false };
      }
    });
    setNavlinks(updatedNavlinks);
    setLink(slug);
  };
  const [openModal, setOpenModal] = useState(null);
  const handleCloseModal = () => setOpenModal(null);
  const [modalTest, setModalTest] = useState([]);
  const testModal = (newtest) => {
    setModalTest(newtest)
    setOpenModal("test")
  }
  const getPatientData = () => {
    getPatient({ id: admin.admin.id }).then((response) => {
      const patientData = response?.data?.data?.patient?.map((patient) => (
        {
          date: patient?.patient?.registrationDate,
          billId: patient?.patient?._id,
          patientName: `${patient?.patient?.firstName} ${patient?.patient?.lastName}`,
          gender: patient?.patient?.gender,
          age: patient?.patient?.age,
          paymentType: patient?.patient?.paymentMethod || "Cash",
          amount: patient?.patient?.totalPayment,
          discount: patient?.patient?.discountAmount,
          paid: patient?.patient?.paidPayment,
          due: patient?.patient?.duePayment || "0",
          netAmount: patient?.patient?.totalPayment,
        }
      ))
      const patientReferalData = response?.data?.data?.patient?.map((patient) => (
        {
          date: patient?.patient?.registrationDate,
          patientName: `${patient?.patient?.firstName}  ${patient?.patient?.lastName}`,
          contact: patient?.patient?.phone,
          tests: patient?.patient?.testDetails ? <div>
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
          organization: patient?.organisation?.referralName || "Self",
          netAmount: patient?.patient?.totalPayment,
          cocession: patient?.patient?.discountAmount || "0",
          toLab: patient?.collector?.name,
          toOrganization: patient?.collected?.address,
        }
      ))

      if (response.data?.data?.patient?.length > 0 && response.data?.data?.patient[0]?.patient?._id) {
        setPatients(patientData);
        setReferralData(patientReferalData)
      } else {
        setPatients([]);
        setReferralData([])
      }

    }).catch((error) => {
      console.log("Error fetching patient data:", error);
    });
  }

  useEffect(() => {
    getPatientData();
  }, []);

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
    filterFromLeafRows: true,
    getSubRows: (row) => row.subRows,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
          width: '100%',
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
          className={`text-white h-8 text-sm font-normal flex gap-1 justify-center items-center w-full ${(!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) ? "bg-gray-400" : "bg-btn-color  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"} `}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        />
      </Box>
    ),
  });

  const referralTable = useMaterialReactTable({
    columns: referralColumns,
    data: referalData,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableColumnActions: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableExpandAll: false,
    filterFromLeafRows: true,
    getSubRows: (row) => row.subRows,
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
          className={`text-white h-8 text-sm font-normal flex gap-1 justify-center items-center hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 ${(!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) ? "bg-gray-400" : "bg-btn-color"} `}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        />
      </Box>
    ),
  });

  return (
    <>
      <div className='bg-background  pt-5 sm:pt-0'>
        <div className="px-4 pt-5 flex justify-between items-center">
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
        {
          link && link === "billingwise" ?
            <MaterialReactTable table={table} />
            : ""
        }
        {
          link && link === "referralwise" ?
            <MaterialReactTable table={referralTable} />
            : ""
        }
      </div>
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
};

export default FinanceAnalysis;
