import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { agetype, contact, designation, searchBy, payementMethod } from "../../../constants/constants.js";
import {
  useAddAddressMutation, useAddOrganisationMutation, useAddPatientMutation,
  useAddSampleCollectorMutation, useGetOrganisationMutation,
  useGetSampleCollectorMutation, useGetAddressMutation, useAddPatientByUserMutation,
  useGetPatientMutation,
} from "../../../redux/services/adminApi.service.js";
import { useGetTestMutation, useGetPackageMutation } from "../../../redux/services/labApi.service.js"
import { ButtonComponent, InputField, SelectBox } from "../../index.js";
import toast from "react-hot-toast";
import { BillFormate } from "../../index.js";
import { useNavigate } from "react-router-dom";
import { HiMiniXMark } from "react-icons/hi2";
import { Select } from 'antd';
import generateSlug from "../../../services/generateSlug.js";

const PatientRegistration = () => {

  const [size, setSize] = React.useState(null);
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { register: registerBilling, handleSubmit: handleBillingSubmit, setValue: setBillingValue, formState: { errors: billingErrors }, reset: resetBilling } = useForm();
  const { register: registerCollector, handleSubmit: handleSubmitCollector, formState: { errors: collectorErrors }, reset: resetCollector } = useForm();
  const { register: registerOrganisation, handleSubmit: handleSubmitOrganisation, formState: { errors: organisationErrors }, reset: resetOrganisation } = useForm();
  const { register: registerAddress, handleSubmit: handleSubmitAddress, formState: { errors: addressErrors }, reset: resetAddress } = useForm();
  const [addPatient] = useAddPatientMutation();
  const [addPatientByUser] = useAddPatientByUserMutation();
  const [addSampleCollector] = useAddSampleCollectorMutation();
  const [getPatient] = useGetPatientMutation();
  const [addOrganisation] = useAddOrganisationMutation();
  const [getPackage] = useGetPackageMutation();
  const [addAddress] = useAddAddressMutation();
  const [getSampleCollector] = useGetSampleCollectorMutation();
  const [getOrganisation] = useGetOrganisationMutation();
  const [getAddress] = useGetAddressMutation();
  const [getTest] = useGetTestMutation();
  const admin = useSelector((state) => state.admin);

  if (!admin || !admin.admin.id) {
    return <div>Loading...</div>; // or handle the loading state as needed
  }

  const [user, setUser] = useState({});
  const [sampleCollectorName, setSampleCollectorName] = useState({
    sampleCollector: "",
    referral: "",
    collectedAt: ""
  })

  const [paidamount, setPaidAmount] = useState(true);
  const [paidAmountPrice, setPaidAmountPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0)
  const [amount, setAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [checkReferaltype, setReferaltype] = useState(false);
  const [sampleCollector, setSampleCollector] = useState([]);
  const [organisation, setOrganisation] = useState([]);
  const [address, setAddress] = useState([]);
  const [test, setTest] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [searchTest, setSearchTest] = useState([]);
  const [searchPatient, setSearchPatient] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);
  const [userId, setUserId] = useState('');
  const [percentageValue, setPercentageValue] = useState(0);
  const [roleManageData, setRoleManageData] = useState({});
  const [paymentMethodData, setPaymentMethodData] = useState(payementMethod);
  const [patient, setPatient] = useState([]);
  const [testType, setTestType] = useState('Tests')
  const [testError, setTestError] = useState('');
  const [slug, setSlug] = useState('')
  const navigate = useNavigate();

  const fetchPatient = async () => {
    try {
      const slug = await generateSlug(admin.admin.email, admin.admin.id);
      if (slug) {
        setSlug(slug)
      }
      const response = await getPatient({ id: admin.admin.id })
      setPatient(response.data.data.patient)
    }
    catch (error) {

    }
  }

  useEffect(() => {
    const fetchSampleCollector = async () => {
      try {
        const response = await getSampleCollector({ id: admin.admin.id });
        setSampleCollector(response.data.data);
      } catch (error) { }
    };
    fetchSampleCollector();

    const fetchgetTest = async () => {
      try {
        const response = await getTest({ id: admin.admin.id, });
        setTest(response.data.data.test);
      } catch (error) { }
    };
    fetchgetTest();
    
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
    fetchgetPackage();
    fetchPatient();

    const fetchAddress = async () => {
      try {
        const response = await getAddress({ id: admin.admin.id });
        setAddress(response.data.data);
      } catch (error) { }
    };
    fetchAddress();


    const fetchOrganisation = async () => {
      try {
        const response = await getOrganisation({ id: admin.admin.id });
        setOrganisation(response.data.data);
      } catch (error) { }
    };
    fetchOrganisation();

  }, [admin.admin.id]);

  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;
      const roleAccessData = {
        editReceptionTestPrice: !roleData?.reception?.permissions?.editTestPrice,
        editDoctorTestPrice: !roleData?.doctor?.permissions?.editTestPrice,
      }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);

  const handleOpen = (value) => setSize(value);
  const handleCloseModal = () => setOpenModal(null);

  const onSubmit = async (data) => {
    try {
      setUser({ ...data, patientId: slug, id: admin.admin.id });
      handleOpen("xl");
      reset();
    } catch (error) {
      setMessage(error?.message);
      toast.error(error?.message);
    }
  };

  const handleBillpdfOpen = (value) => setSize(value);

  const bllingSubmit = async (data) => {
    try {

      if (selectedTest.length > 0) {

        if (admin?.admin?.manageUser && admin?.admin?.manageUser._id && admin?.admin?.manageUser._id !== "") {
          const newData = { ...user, ...data, test: selectedTest, userId: admin.admin.manageUser[0]._id }
          const response = await addPatientByUser(newData);

          if (response.data.success) {
            await setUserId(response.data.data);
            toast.success(response.data.message)
            handleOpen(null);
            resetBilling();

            handleBillpdfOpen("lg")
          }
          else {
            toast.error(response.data.message)
          }
        }
        else {

          const newData = { ...user, ...data, test: selectedTest }
          const response = await addPatient(newData);

          if (response.data.success) {
            await setUserId(response.data.data);
            toast.success(response.data.message)
            handleOpen(null);
            resetBilling();
            setSelectedTest([])
            const newSelectedTest = []
            const total = Number(
              newSelectedTest?.reduce((acc, test) => {
                const price = test?.testPrice || test?.totalAmount;
                return acc + price;
              }, 0));

            setBillingValue("totalPayment", total);
            setBillingValue("paidPayment", total);
            setPaidAmountPrice(total)
            setAmount(total)
            setDiscountAmount(0);
            setSearchTest([])
            handleBillpdfOpen("lg")
          }
          else {
            setTestError("Please Select Test")
            toast.error("Please Select Test")
          }
        }
      }
      else {
        setTestError("Please Select Test")
        toast.error("Please Select Test")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitCollector = async (data) => {
    try {
      const collector = { ...data, id: admin.admin.id };
      const response = await addSampleCollector(collector);
      setSampleCollector(response.data.data);

      if (response.data.success) {
        toast.success(response.data.message)
        resetCollector();
        setOpenModal(null);

      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitOrganization = async (data) => {
    try {
      const organization = { ...data, id: admin.admin.id };
      const response = await addOrganisation(organization);
      setOrganisation(response.data.data);

      if (response.data.success) {
        toast.success(response.data.message)
        resetOrganisation();
        setOpenModal(null);
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitAddress = async (data) => {
    try {
      const address = { ...data, id: admin.admin.id };
      const response = await addAddress(address);
      setAddress(response.data.data);

      if (response.data.success) {
        toast.success(response.data.message)
        resetAddress();
        handleCloseModal(null);

      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  function filterTests(input) {
    setTestError("");
    if (input) {
      if (testType === 'Tests') {
        if (test) {
          const filteredTests = test.filter(test =>
            test.testName.toLowerCase().includes(input.toLowerCase()) ||
            test.testCode.toLowerCase().includes(input.toLowerCase())
          );
          setSearchTest(filteredTests);
        }

      }
      else {
        if (packageList) {
          const filteredPackage = packageList.map(packages =>
            packages.package
          );
          const filteredTests = filteredPackage.filter(test =>
            test.packageName.toLowerCase().includes(input.toLowerCase()));

          setSearchTest(filteredTests);

        }
      }
    }

    if (!input) {
      setTestError("");
      setSearchTest([]);
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

  const handleSelectedTest = (data) => {
    if (
      selectedTest.some(test => test._id === data._id) ||
      selectedTest.some(pkg => pkg.test.some(test => test.testId === data._id)) ||
      selectedTest.some(test =>
        data.test.map(testDetail => testDetail.testId).includes(test._id)
      )
    ) {
      setTestError("Test already selected")
      toast.error("Test already selected");
      return;
    }
    const newSelectedTest = [...selectedTest, data]
    setTestError("")
    setSelectedTest([...selectedTest, data])

    const total = Number(Math.round(
      newSelectedTest.reduce((acc, test) => {
        const price = test?.testPrice || test?.totalAmount;
        return acc + price;
      }, 0)
    ));

    setBillingValue("totalPayment", total);
    setBillingValue("paidPayment", total);
    setDiscountAmount(0);
    setPaidAmountPrice(total)
    setAmount(total)
    setSearchTest([])
  }

  const sampleCollectorModalData = (value) => {
    setSampleCollectorName(prevState => ({ ...prevState, ...value }))
  }

  const deleteTest = (index) => {
    const newSelectedTest = selectedTest?.filter((testItem, i) => i !== index)
    setSelectedTest(newSelectedTest)
    setTestError("");
    const total = Number(Math.round(
      newSelectedTest.reduce((acc, test) => {
        const price = test?.testPrice || test?.totalAmount;
        return acc + price;
      }, 0)
    ));

    setBillingValue("totalPayment", total);
    setBillingValue("paidPayment", total);
    setPaidAmountPrice(total)
    setDiscountAmount(0);
    setAmount(total)
    setSearchTest([])

  }

  const handlePriceChange = (index, value) => {

    const newSelectedTest = selectedTest.map((testItem, i) =>
      i === index ? { ...testItem, testPrice: parseInt(value) } : testItem
    );

    const total = Number(newSelectedTest.reduce((acc, test) => acc + test.testPrice, 0));
    setAmount(total)
    const discountPercentage = parseFloat(percentageValue);
    const discountAmount = isNaN(discountPercentage) ? 0 : Number((total * discountPercentage) / 100);

    setBillingValue("discountAmount", discountAmount);
    setBillingValue("paidPayment", total - discountAmount);
    setBillingValue("duePayment", "");
    setBillingValue("totalPayment", total - discountAmount);
    setDiscountAmount(discountAmount);
    setDueAmount(0);
    setPaidAmountPrice(total - discountAmount);
    setSelectedTest(newSelectedTest);

  };

  const calculatePercentage = (value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const discountPercentage = parseFloat(sanitizedValue);
    const discountAmount = isNaN(discountPercentage) ? 0 : Number(Math.round((amount * discountPercentage) / 100));
    setBillingValue("discountAmount", discountAmount);
    setBillingValue("paidPayment", amount - discountAmount);
    setBillingValue("duePayment", "");
    setBillingValue("totalPayment", amount - discountAmount);
    setDiscountAmount(discountAmount);
    setDueAmount(0);
    setPaidAmountPrice(amount - discountAmount);
    setPercentageValue(sanitizedValue);

  }

  const setPaidAmountValue = (value) => {
    const dueamount = Number(Math.round((amount - discountAmount) - value));
    setBillingValue("duePayment", dueamount);
    setDueAmount(dueamount);
  }

  const handlePaymentMethodChange = (paymentoption) => {

    const updatedPaymentMothod = payementMethod.map((item) => {
      if (item.value === paymentoption) {
        return ({ ...item, active: true })
      }
      else {
        return ({ ...item, active: false })
      }
    })
    setPaymentMethodData(updatedPaymentMothod);
  }



  return (
    <>
      <div className="bg-background h-auto ">
        <div className="p-3 px-5 lg:w-2/4 flex flex-col ">
          <label htmlFor="" className="font-semibold py-3 inline-block mb-1 pl-1 text-label-color text-sm font-regular"> Register New Patient</label>
          <Select
            showSearch
            value={null}
            placeholder="Search Patient By Name"
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={(event) => { filterPatient(event) }}
            notFoundContent={null}
            options={(searchPatient || []).map((patient, index) => ({
              value: patient.value,
              label: (
                <li key={index} className="hover:bg-gray-100 px-2 w-full z-50 font-medium"
                  onClick={() => navigate('/dashboard/patientlist/patientdetails', { state: patient?._id })}>
                  <p className="mb-0 font-sans">{patient?.firstName + " " + patient?.lastName}</p>
                  <p className="font-normal font-sans"><span>Date - </span>{patient?.registrationDate}/-</p>
                </li>
              ),
            }))}
          />

        </div>
        <div className="w-full sm:px-5 ">
          <div className="bg-white p-5 ">
            <p className="text-md underline decoration-gray-300 pt-3">Personal Details</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 1st row */}
              <div className="lg:flex lg:gap-5 space-y-3 lg:space-y-0">
                <div className="flex justify-between w-full ">
                  <div className="">
                    <p className="text-sm">Patient ID </p>
                    <p className="font-semibold text-sm">{slug && slug}</p>
                  </div>
                  <div className="">
                    <SelectBox
                      options={designation}
                      className="w-24 text-label-color text-sm h-8"
                      labelclass="text-sm"
                      mainStyle="flex-col"
                      label="Designation"
                      name="namePrefix"
                      {...register("namePrefix")}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <InputField
                    type="text"
                    label={<><span className="text-red-500 font-medium">*</span> First Name</>}
                    placeholder="First Name"
                    labelclass="text-sm"
                    className="placeholder:text-sm"
                    name="firstName"
                    isSearch={false}
                    {...register("firstName", {
                      required: "firstName is required",
                      pattern: {
                        value: /^[A-Z a-z]+((['-][A-Z a-z])?[A-Z a-z]*)*( [A-Z a-z]+((['-][A-Z a-z])?[A-Z a-z]*)*)*$/,
                        message: "firstName must be a valid name"
                      }
                    })}
                  />
                  {errors.firstName && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{errors.firstName.message}</p>}
                </div>

                <div className="w-full">
                  <InputField
                    type="text"
                    label="Last Name"
                    placeholder="Last Name"
                    labelclass="text-sm"
                    name="lastName"
                    className="placeholder:text-sm"
                    isSearch={false}
                    {...register("lastName")}
                  />
                </div>

                <div className="flex items-start w-full">
                  <SelectBox
                    options={contact}
                    className="w-24 h-8 border-r-0 text-sm text-label-color flex items-center "
                    label=""
                    name="prefixcontact"
                    labelclass="text-sm"
                    mainStyle="mt-6 flex-col"
                    {...register("prefixcontact")}
                  />
                  <InputField
                    type="text"
                    label="Phone Number"
                    placeholder="Contact Number"
                    labelclass="text-sm"
                    className="placeholder:text-sm"
                    name="phone"
                    isSearch={false}
                    {...register("phone",)}
                  />
                </div>
              </div>

              {/* 2nd row */}
              <div className="md:flex gap-5 py-4 items-center lg:ps-48 space-y-3 lg:space-y-0">
                <div className="w-full">
                  <div>
                    <p className="text-sm text-label-color "><span className="text-red-500 text-sm font-medium">*</span> Gender</p>
                    <input
                      className="h-3"
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      {...register("gender", { required: "Gender is required" })}
                    />
                    <label className="ps-1 text-sm text-label-color" htmlFor="male">
                      Male
                    </label>
                    <input
                      className="h-3 ms-5"
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      {...register("gender", { required: "Gender is required" })}
                    />
                    <label className="ps-1 text-sm text-label-color" htmlFor="female">
                      Female
                    </label>
                    <input
                      className="h-3 ms-5"
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      {...register("gender", { required: "Gender is required" })}
                    />
                    <label className="ps-1 text-sm text-label-color" htmlFor="other">
                      Other
                    </label>
                    {errors.gender && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{errors.gender.message}</p>}
                  </div>
                  <div className="mt-5">
                    <InputField
                      type="number"
                      label={<><span className="text-red-500 text-sm font-medium">*</span> Age</>}
                      placeholder="Age"
                      labelclass="text-label-color text-sm"
                      name="age"
                      min="0"
                      className="placeholder:text-sm"
                      isSearch={false}
                      {...register("age", { required: "Age is required" })}
                    />
                    {errors.age && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{errors.age.message}</p>}
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full">
                    <InputField
                      type="email"
                      label="Email ID"
                      placeholder="Email "
                      labelclass="text-sm"
                      name="email"
                      isSearch={false}
                      className="placeholder:text-sm"
                      {...register("email")}
                    />
                  </div>
                  <div className="w-full mt-5">
                    <SelectBox
                      options={agetype}
                      className="h-8 text-label-color text-sm"
                      labelclass="text-sm"
                      label={<><span className="text-red-500 text-sm font-medium">*</span> Age Type</>}
                      name="  "
                      mainStyle="flex-col"
                      {...register("ageType", { required: "AgeType is required" })}

                    />
                    {errors.ageType && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{errors.ageType.message}</p>}
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-label-color text-sm pl-1" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="6"
                    cols="50"
                    placeholder=""
                    className="px-1 mt-1 outline-none text-label-color focus:bg-gray-50 duration-200 border border-gray-300 w-full"
                    {...register("address")}
                  ></textarea>
                </div>
              </div>

              <hr className="py-3 mt-1" />

              {/* 3rd row */}
              <div className="lg:flex gap-5 py-4 lg:pe-16 space-y-5 lg:space-y-0">
                <div className="flex items-end gap-4 w-full">
                  <div className="w-4/5 sm:w-full">
                    <SelectBox
                      options={sampleCollector && sampleCollector?.map((sampleCollector) => {
                        return { value: sampleCollector._id, label: sampleCollector.name };
                      })}
                      className="text-label-color text-sm"
                      name="sampleCollector"
                      mainStyle="flex-col"
                      label={<>Select Sample Collector <span className="text-xs">(optional)</span></>}
                      labelclass="text-sm text-label-color"
                      {...register("sampleCollector")}
                      onChange={(event) => sampleCollectorModalData({ sampleCollector: event.target.options[event.target.selectedIndex].label })}
                    />
                  </div>
                  <div onClick={() => setOpenModal('sampleCollectorModal')}>
                    <ButtonComponent
                      type="button"
                      title={<FaPlus className="text-white bg-btn-color flex justify-center items-center text-sm  bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />}
                      className="h-7 px-4  hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                    />

                  </div>
                </div>
                <div className="flex items-end gap-4 w-full">
                  <div className="w-4/5 sm:w-full">
                    <SelectBox
                      options={organisation && organisation?.map((organisation) => {
                        return { value: organisation._id, label: organisation.referralName };
                      })}
                      mainStyle="flex-col"
                      className="text-label-color text-sm"
                      name="referral"
                      label={<>Select Organisation <span className="text-xs">(optional)</span></>}
                      labelclass="text-sm text-label-color"
                      {...register("referral")}
                      onChange={(event) => sampleCollectorModalData({ referral: event.target.options[event.target.selectedIndex].label })}
                    />
                  </div>
                  <div onClick={() => setOpenModal('organization')}>
                    <ButtonComponent
                      type="button"
                      title={<FaPlus className="text-white bg-btn-color flex justify-center items-center text-sm  bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />}
                      className="h-7 px-4  hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-4 w-full">
                  <div className="w-4/5 sm:w-full">
                    <SelectBox
                      options={address && address?.map((address) => {
                        return { value: address._id, label: address.address };
                      })}
                      mainStyle="flex-col"
                      className="text-label-color text-sm"
                      name="collectedAt"
                      label={<>Collected at <span className="text-xs">(optional)</span></>}
                      labelclass="text-sm text-label-color"
                      {...register("collectedAt")}
                      onChange={(event) => sampleCollectorModalData({ collectedAt: event.target.options[event.target.selectedIndex].label })}
                    />
                  </div>
                  <div onClick={() => setOpenModal('address')}>
                    <ButtonComponent
                      type="button"
                      title={<FaPlus className="text-white bg-btn-color flex justify-center items-center text-sm  bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />}
                      className="h-7 px-4  hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:flex justify-end md:ps-5 py-5" >
                <ButtonComponent
                  title="Go to Billing"
                  className="px-4 text-white bg-btn-color text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Billing Modal  */}
      <Dialog open={size === "xl"} size={size} handler={handleOpen} className="rounded-none">
        <DialogHeader className="flex justify-between py-2">
          <div className="mb-0">
            <p className="text-[18px] mb-0 text-gray-600">Billing</p>
          </div>
          <div>
            <FaXmark
              onClick={() => handleOpen(null)}
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />

        <form onSubmit={handleBillingSubmit(bllingSubmit)} >
          <DialogBody className="sm:flex gap-2 sm:m-5 rounded-lg overflow-y-auto lg:overflow-hidden max-h-[70vh]">
            <div className="px-1 py-5 h-full rounded-lg">
              <p className="py-5 hover:text-btn-color underline underline-offset-2 decoration-gray-500 font-normal">
                Patient Details
              </p>
              <p className="font-medium text-gray-600 text-sm">{user.firstName} {user.lastName}</p>
              <p className="font-medium text-gray-600 text-sm">240618003</p>
              <p className="font-normal text-gray-600 text-sm">
                Gender : <span className="font-medium">{user.gender}</span>
              </p>
              <p className="font-normal text-gray-600 text-sm">
                Age : <span className="font-medium">{user.age}/{user.ageType}</span>
              </p>
              <p className="font-normal text-gray-600 text-sm">
                Contact Number - <span className="font-medium">{user.phone}</span>
              </p>
              <InputField type="date" name="registrationDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full rounded-sm text-sm font-normal font-sans h-8" outerClass="rounded-sm my-2" isSearch={false}
                {...registerBilling("registrationDate")}
              />
              <p className="font-normal text-gray-600 text-sm">
                Sample Collector - <span className="font-medium">{sampleCollectorName?.sampleCollector}</span>
              </p>
              <p className="font-normal text-gray-600 text-sm">
                Collected at - <span className="font-medium">{sampleCollectorName?.collectedAt}</span>
              </p>
              <p className="font-normal text-gray-600 text-sm">
                Organization - <span className="font-medium">{sampleCollectorName?.referral}</span>{" "}
              </p>
            </div>
            <div className="py-2 h-full rounded-lg w-full shadow-sm">
              {testError && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0" >{testError}</p>}
              <div className="overflow-auto h-40">
                <table className="w-full border-collapse ">
                  <thead className="bg-gray-100 text-gray-600 text-sm leading-normal">
                    <tr>
                      <th className="py-2 px-6 text-left text-sm w-2/12">Sr. No.</th>
                      <th className="py-2 px-6 text-left text-sm w-4/12">Test / Package</th>
                      <th className="py-2 px-6 text-left text-sm w-2/12">Price</th>
                      <th className="py-2 px-6 text-left text-sm w-2/12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {
                      selectedTest && (
                        selectedTest?.map((testItem, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-2 px-6 font-normal text-left">{index + 1}</td>
                            <td className="py-2 px-6 font-normal text-left">{testItem?.testName}{testItem?.packageName}</td>
                            <td className="py-2 px-6 font-normal text-left">
                              <InputField
                                disabled={roleManageData && (roleManageData?.editReceptionTestPrice || roleManageData?.editDoctorTestPrice)}
                                type="number"
                                readOnly
                                placeholder="0"
                                value={testType === 'Tests' ? testItem.testPrice : testItem.totalAmount}
                                isSearch={false}
                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                outerClass="border-none"
                              />
                            </td>
                            <td className="py-2 px-6 text-left">
                              <div onClick={() => deleteTest(index)}>
                                <AiOutlineDelete type="button" className="text-2xl" />

                              </div>

                            </td>
                          </tr>
                        ))
                      )
                    }
                  </tbody>
                </table>
              </div>

              <div className="w-full p-3">
                <div className="space-y-3 sm:space-y-0 sm:flex gap-2 justify-center items-center md:w-2/3">
                  <Select
                    showSearch
                    value={null}
                    placeholder="search by test name or test code"
                    defaultActiveFirstOption={false}
                    style={{
                      zIndex: 9999,
                      borderRadius: 0,
                    }}
                    className="w-full border-gray-300 focus:border-gray-600"
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
                        <li key={index} className="hover:bg-gray-100 border-b  w-full z-50 font-medium" onClick={() => handleSelectedTest(test)}>
                          <p className="mb-0 font-sans">{testType === 'Tests' ? test.testName : test.packageName}</p>
                          <p className="font-normal font-sans"><span>Price - </span>&#8377;{testType === 'Tests' ? test.testPrice : test.totalAmount}/-</p>
                        </li>
                      ),
                    }))}
                  />
                  <SelectBox options={searchBy}
                    className="h-8 lg:border-l-0 text-sm text-black font-normal"
                    name="testType"
                    mainStyle="flex-col"
                    {...registerBilling("testType")}
                    onChange={(event) => { setTestType(event.target.value) }}
                  />
                </div>
                <div className="md:flex gap-4 py-5">
                  <div className="gap-5">
                    <div className="flex gap-5">
                      <InputField
                        placeholder="0"
                        type="text"
                        maxLength={2}
                        pattern="[0-9]{1,2}"
                        label={<>Discount (%) <span className="text-xs">(Optional)</span></>}
                        labelclass="text-sm font-normal"
                        isSearch={false}
                        className="py-0 px-0 text-sm placeholder:text-sm font-normal"
                        name="discountPercentage"
                        {...registerBilling("discountPercentage")}
                        onChange={(event) => {
                          calculatePercentage(event.target.value);
                          setPercentageValue(event.target.value);
                        }}
                      />
                      <InputField
                        type="number"
                        label={<>Discount (&#8377;) <span className="text-xs">(Optional)</span></>}
                        isSearch={false}
                        labelclass="text-sm font-normal"
                        className="py-0 px-0 text-sm placeholder:text-sm font-normal"
                        name="discountAmount"
                        value={discountAmount}
                        {...registerBilling("discountAmount")}
                      />
                    </div>
                    <ul>
                      <li className="flex justify-between sm:px-5 pt-3 pb-2 font-normal">
                        <span className="py-0 px-0 text-sm placeholder:text-sm font-normal">Amount : </span>
                        <input type="number" className="w-20 border-none text-black text-sm placeholder:text-sm font-normal bg-transparent" disabled readOnly value={amount} />
                      </li>
                      <hr />
                      <li className="flex justify-between sm:px-5 py-2 font-normal">
                        <span className="py-0 px-0 text-sm placeholder:text-sm font-normal">Discount : </span>
                        <input type="number" className="w-20 border-none text-black text-sm placeholder:text-sm font-normal bg-transparent" disabled readOnly value={discountAmount} />
                      </li>
                      <hr />
                      <li className="flex justify-between sm:px-5 py-2 font-normal">
                        <span className="py-0 px-0 text-sm placeholder:text-sm font-medium">Total Amount : </span>
                        <input type="number" name="totalPayment" className="w-20 border-none text-black text-sm placeholder:text-sm font-normal bg-transparent" disabled readOnly value={amount - discountAmount}
                          {...registerBilling("totalPayment")}
                        />
                      </li>
                      <hr />
                    </ul>
                  </div>
                  <div className="w-[1px] bg-gray-200 shadow-lg"></div>
                  <div className="p-3">
                    <input type="checkbox" id="duepayment" onChange={() => {
                      setPaidAmount(!paidamount); setDueAmount(0.00); setPaidAmountPrice(amount - discountAmount)
                      setBillingValue("duePayment", 0);
                      setBillingValue("paidPayment", amount - discountAmount);
                    }}
                    />
                    <label htmlFor="duepayment" className="px-2 font-normal py-0 text-sm placeholder:text-sm">
                      Due Payment
                    </label>
                    {/* <p className="font-medium">Paid Amount - (&#8377;){paidamount ? ` ${paidAmountPrice}/-` : ''}</p> */}
                    <InputField type="number" isSearch={false} disabled={paidamount} className={`py-0 px-0 text-sm placeholder:text-sm font-normal ${paidamount ? "bg-gray-100 border-gray-50" : "bg-white"}`} name="paidPayment"
                      value={paidAmountPrice}
                      min="0"
                      {...registerBilling("paidPayment")}
                      onChange={(e) => { setPaidAmountPrice(e.target.value); setPaidAmountValue(e.target.value); }}
                    />
                    <div className="flex justify-between items-center py-5 font-medium">
                      <span className="font-medium text-sm font-sans">Due Amount- (&#8377;)</span>
                      <input type="number" name="duePayment" className="w-20 border-none text-black text-sm placeholder:text-sm font-normal bg-transparent py-0 px-0 " disabled readOnly value={paidamount ? '' : dueAmount}
                        {...registerBilling("duePayment")} />
                    </div>
                    <hr />
                  </div>
                  <div className="w-[1px] bg-gray-200"></div>
                  <div>
                    <p className="font-medium"> Payment Method</p>
                    <div className="flex justify-between gap-5">
                      {
                        paymentMethodData && paymentMethodData.map((item, index) => (
                          <div onClick={() => handlePaymentMethodChange(item.value)} key={index}>
                            <InputField
                              type="radio"
                              key={index}
                              label={item.value}
                              id={item.id}
                              mainstyle={`bg-transparent border px-3 flex justify-center items-center w-20 md:w-auto ${item.active ? "border-btn-color  font-medium" : ""}`}
                              className="hidden h-full"
                              labelclass={`text-sm font-normal flex justify-center items-center ${item.active ? "text-blue-800 font-medium" : ""}`}
                              outerClass="border-none"
                              value={item.value}
                              name="paymentMethod"
                              {...registerBilling("paymentMethod")}
                              isSearch={false}
                            />
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonComponent title="Confirm" className="px-4 text-white bg-btn-color text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
              type="submit" />
          </DialogFooter>
        </form>
      </Dialog>


      {/* Add sample collector modal */}
      <Dialog
        open={openModal === 'sampleCollectorModal'}
        handler={handleCloseModal}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none"
      >
        <DialogHeader className="flex justify-between py-2">
          <div className="mb-0">
            <p className="text-[18px] mb-0">Add SampleCollector </p>
          </div>
          <div onClick={handleCloseModal}>
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="px-5">
          <div className="md:ps-10 font-medium">
            <form className="space-y-5" onSubmit={handleSubmitCollector(submitCollector)} >
              <div>

                <InputField placeholder="Name" label="Name" id="name" name="name" outerClass="mb-0 py-0" isSearch={false}
                  {...registerCollector("name", { required: "Name is required" })}
                />
                {collectorErrors.name && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0" >{collectorErrors.name.message}</p>}
              </div>
              <div>

                <input type="radio" id="male1" name="gender" value="male"
                  {...registerCollector("gender", { required: "Gender is required " })}
                />
                <label htmlFor="male1" className="px-2">Male</label>
                <input type="radio" id="female1" name="gender" value="female"
                  {...registerCollector("gender", { required: "Gender is required " })}
                />
                <label htmlFor="female1" className="px-2">Female</label>
                <input type="radio" id="other1" name="gender" value="other"
                  {...registerCollector("gender", { required: "Gender is required " })}
                />
                <label htmlFor="other1" className="px-2">Others</label>
                {collectorErrors.gender && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{collectorErrors.gender.message}</p>}
              </div>
              <div>
                <InputField type="number" placeholder="Phone Number" label="Phone" id="phone" name="phone" isSearch={false}
                  {...registerCollector("phone", {
                    required: "Phone number is required",
                    validate: {
                      matchPattern: (value) =>
                        /^[6-9]\d{9}$/.test(value) || "Phone number must be a valid number"
                    }
                  })}
                />
                {collectorErrors.phone && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{collectorErrors.phone.message}</p>}
              </div>
              <div>

                <InputField type="email" placeholder="email" label="Email" id="email" name="email" isSearch={false}
                  className="w-full py-2"
                  {...registerCollector("email", {
                    validate: {
                      matchPattern: (value) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                    }
                  })}
                />
                {collectorErrors.email && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{collectorErrors.email.message}</p>}
              </div>
              <div className="flex justify-end">
                <ButtonComponent title="Save" className="w-32 text-white font-medium h-9 flex items-center justify-center hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </DialogBody>

      </Dialog>

      {/* Add organization modal */}
      <Dialog
        open={openModal === 'organization'}
        handler={handleCloseModal}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none"
      >
        <DialogHeader className="flex justify-between py-2">
          <div className="mb-0">
            <p className="text-[18px] mb-0">Add Organization </p>
          </div>
          <div onClick={handleCloseModal}>
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="px-5">
          <div className="md:ps-10 font-medium">
            <form className="space-y-4" onSubmit={handleSubmitOrganisation(submitOrganization)}>
              <div>

                <span className="pe-5 text-sm ">Referral Type : </span>
                <input type="radio" id="doctor" name="referaltype" value="doctor" className="text-sm"
                  {...registerOrganisation("referaltype", { required: "ReferalType is required" })}
                  onChange={(e) =>
                    setReferaltype(true)
                  }
                />
                <label htmlFor="doctor" className="px-2 text-sm font-normal">Doctor</label>
                <input type="radio" id="hospital" name="referaltype" value="hospital" className="text-sm"
                  {...registerOrganisation("referaltype", { required: "ReferalType is required" })}
                  onChange={(e) => setReferaltype(false)}
                />
                <label htmlFor="hospital" className="px-2 text-sm font-normal">Hospital</label>
                {organisationErrors.referaltype && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{organisationErrors.referaltype.message}</p>}
              </div>
              <div>

                <InputField placeholder="Enter Name" label="Name" id="name" isSearch={false} className="text-sm placeholder:text-sm font-normal" labelclass="text-sm font-normal"
                  {...registerOrganisation("referralName", { required: "ReferalName is required" })}
                />
                {organisationErrors.referralName && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{organisationErrors.referralName.message}</p>}
              </div>
              <div>
                {
                  checkReferaltype && checkReferaltype ? <InputField type="text" placeholder="Degree" label="Degree" id="Degree" name="degree" isSearch={false} className="text-sm placeholder:text-sm font-normal" labelclass="text-sm font-normal"
                    {...registerOrganisation("degree", { required: " Degree Name is required" })}
                  /> : ""
                }
                {organisationErrors.degree && checkReferaltype && <p className="text-red-600 text-xs font-regular font-normal py-0 mt-0 mb-0">{organisationErrors.degree.message}</p>}
              </div>

              <InputField type="email" placeholder="Enter Email" label="Email" id="email" name="email" isSearch={false} className="text-sm placeholder:text-sm font-normal" labelclass="text-sm font-normal"
                {...registerOrganisation("email")}
              />
              <div className="flex justify-end">
                <ButtonComponent title="Save" className="w-32 text-white font-medium h-9 flex items-center justify-center hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </DialogBody>

      </Dialog>

      {/* Address modal */}
      <Dialog
        open={openModal === 'address'}
        handler={handleCloseModal}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none"
      >
        <DialogHeader className="flex justify-between py-2">
          <div className="mb-0">
            <p className="text-[18px] mb-0">Add Address </p>
          </div>
          <div onClick={handleCloseModal}>
            <FaXmark
              className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0"
            />
          </div>
        </DialogHeader>
        <hr />
        <DialogBody className="px-5">
          <div className="md:ps-10 font-medium">
            <form className="space-y-4" onSubmit={handleSubmitAddress(submitAddress)} >
              <label htmlFor="address">Address</label>
              <textarea name="address" id="address" rows="3" className="border-2 w-full"
                {...registerAddress("address")}
              ></textarea>
              <div className="flex justify-end">
                <ButtonComponent title="Add" className="w-32 text-white font-medium h-9 flex items-center justify-center hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </DialogBody>

      </Dialog>

      {/* bill pdf  modal */}
      <Dialog
        open={
          size === "lg"
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
            <div className='mb-0 flex justify-center items-center'>
              <HiMiniXMark
                onClick={() => handleBillpdfOpen(null)}
                className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
              />
            </div>
          </div>
          {/* <hr /> */}
        </DialogHeader>
        <DialogBody className="max-h-[90vh] overflow-y-auto">
          {userId && <BillFormate userId={{ patientId: userId }} className="overflow-y-auto" />}
        </DialogBody>
      </Dialog>
    </>
  );
}

export default PatientRegistration;