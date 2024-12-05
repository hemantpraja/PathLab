import React, { useState, useEffect } from "react";
import { ButtonComponent, InputField } from "../../index.js";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { useGetTestMutation } from "../../../redux/services/labApi.service.js"
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useAddPackageMutation, useGetPackageMutation, useDeletePackageMutation } from "../../../redux/services/labApi.service.js";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import toaster from "react-hot-toast";
import { Select } from 'antd';

function Packages() {

  const [getTest] = useGetTestMutation();
  const [getPackage] = useGetPackageMutation();
  const [addPackage] = useAddPackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const admin = useSelector((state) => state.admin);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const [size, setSize] = useState(null);
  const [test, setTest] = React.useState([]);
  const [packageList, setPackageList] = useState([]);
  const [onePackageDetails, setOnePackageDetails] = useState([]);
  const [errorMessgae, setErrorMessage] = useState("");
  const [roleManageData, setRoleManageData] = useState({});
  const [searchTest, setSearchTest] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);

  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;
      const roleAccessData = {
        addPackage: !roleData?.doctor?.permissions?.addNewPackage,
        editPackage: !roleData?.doctor?.permissions?.editPackage,
        deletePackage: !roleData?.doctor?.permissions?.deletePackage,
        editReceptionTestPrice: !roleData?.reception?.permissions?.editTestPrice,
        editDoctorTestPrice: !roleData?.doctor?.permissions?.editTestPrice,
      }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);


  const fetchgetPackage = async () => {
    try {
      const response = await getPackage({ id: admin.admin.id });
      if (response.data.success) {

        const packageList = response.data.data.package;
        if (packageList.length > 0 && packageList[0]?.package?._id) {
          setPackageList(packageList)
        }
        else {
          setPackageList([])
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchgetTest = async () => {
      try {
        const response = await getTest({ id: admin.admin.id });
        if (response.data.success) {
          setTest(response.data.data.test);
        }
      } catch (error) {
      }
    };
    fetchgetTest();

    fetchgetPackage();
  }, [admin.admin.id]);

  useEffect(() => {
    if (onePackageDetails) {
      setValue("packageName", onePackageDetails?.packageData?.packageName);
      setValue("packagePrice", onePackageDetails?.packageData?.totalAmount);
    }
    else {
      setValue("packageName", "");
      setValue("packagePrice", "");
    }
  }, [onePackageDetails, setValue])

  function filterTests(input) {
    if (input) {

      const filteredTests = test.filter(test =>
        test.testName.toLowerCase().includes(input.toLowerCase()) ||
        test.testCode.toLowerCase().includes(input.toLowerCase())
      );
      setSearchTest(filteredTests);
    }

    if (!input) {
      setSearchTest([]);
    }
  }

  const handleSelectedTest = (data) => {
    if (selectedTest?.some(test => test._id === data._id)) {
      toaster.error("Test already selected");
      setErrorMessage("Test already selected")
      return;
    }
    else if (onePackageDetails?.testData?.some(test => test._id === data._id)) {
      toaster.error("Test already selected");
      setErrorMessage("Test already selected")
      return;
    }
    else {
      setSelectedTest([...selectedTest, data])
      setSearchTest([])
    }

    setErrorMessage("")
  }

  const handlePriceChange = (index, value) => {
    const newSelectedTest = selectedTest.map((testItem, i) => i === index ? { ...testItem, testPrice: value } : testItem);
    setSelectedTest(newSelectedTest);
  };

  const onSubmit = async (data) => {
    try {
      if (onePackageDetails && onePackageDetails?.packageData) {
        const newSelectedTest = [...selectedTest, ...onePackageDetails?.testData];
        if (newSelectedTest.length > 0) {
          const response = await addPackage({ ...data, test: newSelectedTest, id: admin.admin.id, _id: onePackageDetails?.packageData?._id });

          if (response.data.success) {
            toaster.success(response.data.message)
            fetchgetPackage();
            setErrorMessage("")
            reset()
            handleOpen(null)
          }
        }
        else {
          setErrorMessage("Please select at least one test")
          toaster.error("Please select at least one test")
        }
      }
      else {
        if (selectedTest.length > 0) {
          const response = await addPackage({ ...data, test: selectedTest, id: admin.admin.id });
          if (response.data.success) {
            toaster.success(response.data.message)
            fetchgetPackage();
            reset()
            handleOpen(null)
            setErrorMessage("")
          }
        }
        else {
          setErrorMessage("Please select at least one test");
          toaster.error("Please select at least one test")
        }
      }
    } catch (error) {
    }
  }

  const handleOpen = (value) => { setSize(value) };

  const handleEditPackage = (packageData, testData, test, index) => {
    if (packageData && testData) {
      setOnePackageDetails({ packageData: packageData, testData: testData, test: test, index: index })
      setErrorMessage("")
      setSelectedTest([])
      setSearchTest([])
    }
    else {
      setOnePackageDetails({})
      setErrorMessage("")
      setSelectedTest([])
      setSearchTest([])
    }
  }

  const deleteOnePackage = async (id) => {
    const response = await deletePackage({ id: admin.admin.id, _id: id })
    if (response.data.success) {
      toaster.success(response.data.message)
      fetchgetPackage();
      reset()
    }
  }

  return (
    <>
      <div className="w-full h-auto bg-background">
        <div className="flex justify-between p-5">
          <div><p className="font-semibold text-lg ">Packages</p></div>
          <div onClick={() => { handleEditPackage(); handleOpen("lg") }}>
            <ButtonComponent
              title={<><FaPlus className={` text-[10px] font-bold`} /> New Package</>}
              className={`${roleManageData?.addPackage ? "hidden" : ""} w-32 h-8 flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-btn-color border border-blue-700 rounded-sm shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            />

          </div>
        </div>
        <div className="sm:p-8 p-5 flex flex-wrap justify-start gap-3">
          {
            packageList.length > 0 ? packageList?.map((item, index) => (
              <div className="bg-white md:w-96 lg:w-96 w-full px-5 py-2">
                <p className="font-semibold py-2">{item?.package?.packageName}</p>
                <p className="font-semibold py-2">&#x20b9; {item?.package?.totalAmount} /-</p> <hr />
                <p className="py-2">Tests</p>
                <p className="py-2">{item?.package?.testsDetails.map((test) => test.testName).join(', ')}</p> <hr />

                <div className="flex justify-between items-center pt-2">
                  <div className="flex justify-center w-full items-center"
                    onClick={() => { handleEditPackage(item?.package, item?.package?.testsDetails, item?.package?.test, index), handleOpen("lg") }}
                  >
                    <ButtonComponent title={<CiEdit />} className={`${roleManageData?.editPackage ? "hidden" : ""} text-black text-md font-medium  className="text-2xl border bg-gray-100 hover:bg-gray-200 hover:ring-1 hover:ring-gray-600 rounded hover:text-gray-700" `} />
                  </div>
                  <div className="flex justify-center w-full items-center" onClick={() => { deleteOnePackage(item?.package?._id) }} >
                    <ButtonComponent title={<AiOutlineDelete />} className={`${roleManageData?.deletePackage ? "hidden" : ""}  className="text-2xl text-red-600 bg-transparent hover:bg-red-100 hover:ring-1 focus:animate-ping hover:ring-red-600 rounded hover:text-red-700" "`} />
                  </div>
                </div>
              </div>
            )) : <p className="flex h-full w-full justify-center items-center italic text-4xl font-regular font-normal">No Package Available.</p>
          }
        </div>
      </div>

      <Dialog
        open={size === "lg"}
        size={size || "lg"}
        handler={handleOpen}
        className="rounded-none"
        style={{ zIndex: 1300 }}
      >
        <DialogHeader className="flex justify-between py-2">
          <div>
            <p className="text-[18px]">New Package </p>
          </div>
          <div onClick={() => handleOpen(null)} >
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className=" max-h-[90vh] overflow-y-auto">
          {errorMessgae && <p className="text-red-500">{errorMessgae}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:w-2/3 w-full">
              <InputField placeholder="Package Name" label="Package Name" labelclass="text-sm font-regular font-normal" className="placeholder:text-gray-400 font-normal" isSearch={false}
                {...register("packageName", { required: "Please enter package name" })}
                defaultValue={onePackageDetails?.package?.packageName}
              />
              {errors.packageName && <p className="text-red-500 font-regular text-xs">{errors?.packageName?.message}</p>}
            </div>
            <div className="overflow-x-auto py-5">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                  <tr>
                    <th className="py-2 px-6 text-left w-2/12 font-semibold font-regular">Sr. No.</th>
                    <th className="py-2 px-6 text-left w-4/12 font-semibold font-regular">Test / Package</th>
                    <th className="py-2 px-6 text-left w-2/12 font-semibold font-regular">Price</th>
                    <th className="py-2 px-6 text-left w-2/12 font-semibold font-regular">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                  {
                    selectedTest && (
                      selectedTest?.map((testItem, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          {/* <td className="py-2 px-6 text-left font-regular font-normal text-sm">{index + 1}</td> */}
                          <td className="py-2 px-6 text-left font-regular font-normal text-sm">{testItem.testName}</td>
                          <td className="py-2 px-6 text-left font-regular font-normal text-sm">
                            <InputField
                              disabled={roleManageData?.editReceptionTestPrice || roleManageData?.editDoctorTestPrice}
                              type="text"
                              placeholder="0"
                              readOnly
                              value={testItem.testPrice}
                              isSearch={false}
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                            />
                          </td>
                          <td className="py-2 px-6 font-regular font-normal text-left">
                            <div onClick={() => {
                              const newSelectedTest = selectedTest.filter((testItem, i) => i !== index)
                              setSelectedTest(newSelectedTest)
                            }
                            }>
                              <AiOutlineDelete className="text-2xl text-red-600 bg-transparent hover:bg-red-100 hover:ring-1 focus:animate-ping hover:ring-red-600 rounded hover:text-red-700" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  }
                  {
                    onePackageDetails?.testData && (
                      onePackageDetails?.testData.map((testItem, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          {/* <td className="py-2 px-6 font-regular font-normal text-left">{index + 1}</td> */}
                          <td className="py-2 px-6 font-regular font-normal text-left">{testItem.testName}</td>
                          <td className="py-2 px-6 font-regular font-normal text-left">
                            <InputField
                              disabled={roleManageData?.editReceptionTestPrice || roleManageData?.editDoctorTestPrice || roleManageData?.editTechnicianTestPrice}
                              type="text"
                              placeholder="0"
                              readOnly
                              defaultValue={onePackageDetails?.test[index]?.testPrice}
                              isSearch={false}
                              onChange={(e) => {
                                const newSelectedTest = onePackageDetails?.testData.map((testItem, i) => i === index ? { ...testItem, testPrice: e.target.value } : testItem)
                                setOnePackageDetails({ ...onePackageDetails, testData: newSelectedTest })
                              }}
                            />
                          </td>
                          <td className="py-2 px-6 font-regular font-normal text-left">
                            <div onClick={() => {
                              const newSelectedTest = onePackageDetails?.testData.filter((testItem, i) => i !== index)
                              setOnePackageDetails({ ...onePackageDetails, testData: newSelectedTest })
                            }
                            }>
                              <AiOutlineDelete className="text-2xl text-red-600 bg-transparent hover:bg-red-100 hover:ring-1 focus:animate-ping hover:ring-red-600 rounded hover:text-red-700" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  }
                </tbody>
              </table>
            </div>
            <div className="md:w-2/3 w-full">
              <Select
                showSearch
                value={null}
                placeholder="search by test name or test code"
                className="font-regular w-full placeholder:font-bold font-medium placeholder:text-gray-300 placeholder:font-regular placeholder:black"
                defaultActiveFirstOption={false}
                style={{
                  zIndex: 9999,
                }}
                suffixIcon={null}
                filterOption={false}
                onSearch={(event) => {
                  filterTests(event);
                }}
                notFoundContent={null}
                getPopupContainer={(trigger) => trigger.parentNode} // This ensures the dropdown renders within the modal
                options={(searchTest || []).map((test, index) => ({
                  value: test.value,
                  label: (
                    <li
                      key={index}
                      className="border-t-2 w-full p-1 z-50 font-medium flex justify-between "
                      onClick={() => handleSelectedTest(test)}
                    >
                      <p>{test.testName}</p>
                      <p>{test.testPrice}</p>
                    </li>
                  ),
                }))}
              />
            </div>
            <div className="md:w-2/3 w-full font-medium pt-5">
              <InputField placeholder="Enter total amount" label="Total Amount" labelclass="text-sm font-regular" className="placeholder:font-normal text-sm font-regular " isSearch={false}
                {...register("packagePrice", { required: "Please enter Total Amount" })}
                defaultValue={onePackageDetails?.package?.totalAmount}
              />
              {errors.packagePrice && <p className="text-red-500 font-normal font-regular text-xs">{errors?.packagePrice?.message}</p>}
            </div>
            <div className="py-3 flex justify-end">
              <ButtonComponent title="Save" className="w-32 h-8 flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-btn-color border border-blue-700 rounded-sm shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="submit" />
            </div>
          </form>
        </DialogBody>

      </Dialog>

    </>
  );
}

export default Packages;