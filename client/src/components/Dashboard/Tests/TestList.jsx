import {
  MaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAddTestListFileMutation, useGetTestMutation } from '../../../redux/services/labApi.service.js';
import { ButtonComponent, InputField } from '../../index.js';
import { GoUpload } from 'react-icons/go';

import toast from 'react-hot-toast';
const TestList = () => {

  const admin = useSelector((state) => state.admin);
  const [getTest] = useGetTestMutation();
  const [test, setTest] = useState([]);
  const [roleManageData, setRoleManageData] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [addTestListFile] = useAddTestListFileMutation();
  const { register, handleSubmit } = useForm()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'testName',
        header: 'Tests',
        size: 150,
      },
      {
        accessorKey: 'testCode',
        header: 'Test Code',
        size: 150,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 200,
      },
      {
        accessorKey: 'sampleType',
        header: 'Sample Type',
        size: 150,
      },
      {
        accessorKey: 'testPrice',
        header: 'Cost',
        size: 150,
      },

      {
        accessorKey: 'action',
        header: 'Action',
        size: 150,
      },
    ], []);

  const handleEditTest = (id) => {
    navigate('addtest', { state: id })
  }

  const handleUploadFile = async (data) => {
    const formData = new FormData();
    formData.append('id', admin.admin.id);
    formData.append('file', data.file[0]);
    const response = await addTestListFile(formData);
    if (response.data.success) {
      toast.success(response.data.message);
      fetchgetTest();

    }

  }

  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;
      const roleAccessData = { addNewTest: !roleData?.doctor?.permissions?.addNewTest, }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);

  const fetchgetTest = async () => {
    try {
      const response = await getTest({ id: admin.admin.id });
      const testData = response.data.data.test;

      if (admin && admin.admin.manageUser) {
        const roleData = admin.admin.manageUser[0].role;
        const roleAccessData = {
          editTest: !roleData?.doctor?.permissions?.editTest,
        }

        const newTestData = testData.map((item) => {
          return {
            ...item,
            action: <> <ButtonComponent title="Edit" disabled={roleAccessData?.editTest} className={`${roleAccessData?.editTest ? "bg-gray-300 hover:bg-gray-300" : ""} text-white w-20 font-medium  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 `} onClick={() => handleEditTest(item._id)} /> </>
          }
        })
        setTest(newTestData);
      }
      else {
        const newTestData = testData.map((item) => {
          return {
            ...item,
            action: <> <ButtonComponent title="Edit" className={` text-white w-20 font-medium  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500`} onClick={() => handleEditTest(item._id)} /> </>
          }
        })
        setTest(newTestData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {

    fetchgetTest();
  }, [admin.admin.id]);

  return (
    <div className="container mx-auto p-4 font-regular">
      <div className='sm:flex justify-between space-y-5 sm:space-y-0 py-5 sm:py-0'>
        <h2 className="text-xl  mb-4 font-regular">Test List</h2>

        <div className='w-30 '>
          <form onSubmit={handleSubmit(handleUploadFile)} encType="multipart/form-data" className='flex gap-4'>
            <InputField
              type="file"
              placeholder="Upload Test File"
              label={<><GoUpload />Import Tests </>}
              id="upload"
              mainstyle={`border border-gray-300 px-2 flex justify-center items-center w-[55%] py-1`}
              labelclass={`text-sm  font-normal w-full flex items-center gap-2`}
              outerClass="border-none hidden "
              name="reportheader"
              isSearch={false}
              accept=".xlsx" {...register("file")}
            />

            <ButtonComponent title="Submit" className={`h-8 flex items-center justify-center text-sm font-normal font-sans  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 ${roleManageData?.addNewTest ? "hidden" : ""} text-white flex items-center`}
              type="submit"
            />
          </form>
        </div>
        <div>
          <Link to="addtest" className=''>
            <ButtonComponent title={<><FaPlus className={`${roleManageData?.addNewTest ? "hidden" : ""} text-white bg-btn-color  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500`} /> New Test</>} className={`h-8 flex gap-1 items-center justify-center text-sm font-normal font-sans ${roleManageData?.addNewTest ? "hidden" : ""} text-white flex items-center  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500`} />
          </Link>
        </div>
      </div>

      <MaterialReactTable
        columns={columns}
        data={test}
        enableColumnActions={true}
        enableDensityToggle={true}
        enableFullScreenToggle={true}
        enableColumnVisibility={true}
         defaultDensity="compact"
      />
    </div>
  );
};

export default TestList;


/*
[
  {
    "department" : "Hematology",
    "testName" : "Complete Blood Count",
    "testPrice" : "1000",
    "testCode" : "CBC",
    "gender" : "Male",
    "sampleType" : "Whole Blood",
    testDetails : [
      {
        "testFieldType" : "Single Type",
        "name" : "Hemoglobin",
        "testMethod" : "HEAM",
        "field" : "numeric",
        "unit" : "g/dl",
        "min" : "10",
        "max" : "50",
      },
      {
        "testFieldType" : "Multiple Type",
        "name" : "Hemoglobin",
        "subTest" : [
          {
            "name" : "Hemoglobin",
            "testMethod" : "HEAM",
            "field" : "numeric",
            "unit" : "g/dl",
            "min" : "10",
            "max" : "50",
          },
          {
            "name" : "Direa",
            "testMethod" : "HEAMOGLOBIN",
            "field" : "text",
            "unit" : "g/dl",
            "range" : "2000-3000",
          },
        ]
      }
    ]
  }
]

*/
