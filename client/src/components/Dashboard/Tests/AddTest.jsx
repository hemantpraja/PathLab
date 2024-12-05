import React, { useEffect, useState, useRef } from "react";
import { InputField, ButtonComponent, SelectBox } from "../../index";
import { CiEdit } from "react-icons/ci";
import { labTestDepartments, gender as genderArray, labTestTypes, testFieldType, testField, numericUnboundType, formulaOperator } from '../../../constants/constants'
import { FaPlus, FaXmark } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddTestListMutation } from "../../../redux/services/labApi.service.js";
import Intrepretation from "./Intrepretation.jsx";

import {
  useGetOneTestMutation, useUpdateOneTestMutation, useAddFormulaMutation, useDeleteOneTestMutation,
  useAddTestMethodMutation, useGetTestMethodMutation, useAddCommentMutation, useGetTestOptionMutation
} from "../../../redux/services/labApi.service.js";

import { Table } from 'antd';
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { PlusOutlined } from '@ant-design/icons';

import { Button, Divider, Input, Select, Space } from 'antd';
let index = 0
const columns = [
  {
    title: ' ',
    dataIndex: 'check',
    // key: 'name',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    // key: 'name',
  },
  {
    title: 'Field',
    dataIndex: 'field',
    // key: 'field',
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    // key: 'unit',
  },
  {
    title: 'Range',
    dataIndex: 'range',
    // key: 'range',
    // render: () => <a>Delete</a>,
  },
  {
    title: 'Formula',
    dataIndex: 'formula',
    // key: 'formula',
    // render: () => <a>Delete</a>,
  },
  {
    title: 'Delete',
    dataIndex: 'delete',
    // key: 'delete',
  },
];

const columns1 = [
  {
    title: ' ',
    dataIndex: 'check',
    // key: 'name',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    // key: 'name',
  },
  {
    title: 'Field',
    dataIndex: 'field',
    // key: 'field',
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    // key: 'unit',
  },
  {
    title: 'Range',
    dataIndex: 'range',
    // key: 'range',
    // render: () => <a>Delete</a>,
  },
  {
    title: 'Formula',
    dataIndex: 'formula',
    // key: 'formula',
    // render: () => <a>Delete</a>,
  },
  {
    title: 'Delete',
    dataIndex: 'delete',
    // key: 'delete',
  },
];

function AddTest() {

  const [addFiled, setAddFiled] = useState([]);
  const [field, setField] = useState("numeric");
  const [formula, setFormula] = useState(false);
  const [subTestData, setSubTestData] = useState({});
  const [perentTestId, setPerentTestId] = useState('');
  const [parentTest, setParentTest] = useState({});
  const [formulaData, setFormulaData] = useState({});
  const [testFieldData, setTestFieldData] = useState("single field");
  const [openModal, setOpenModal] = React.useState(null);  // for some time demom
  const [testData, setTestData] = useState([]);
  const [selectedFormulaTest, setSelectedFormulaTest] = useState({ name: "", testId: "" });
  const [selectedFormulaOperator, setSelectedFormulaOperator] = useState("")
  const [formulaValue, setFormulaValue] = useState({ formulaName: "", formulaData: "" });
  const [isDisableInput, setDisableInput] = useState({
    min: false,
    max: false,
    unit: false,
    testField: false,
    textrange: false,
    multipleRanges: false,
    numericUnboundType: false,
    numericUnboundValue: false,

  });
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const { register: registerField, handleSubmit: handleSubmitField,
    setValue: setValueField, reset: resetField, control: controlField,
    getValues: getValuesField, formState: { errors: errorField } } = useForm();

  const { register: registerComment, handleSubmit: handleSubmitComment,
    setValue: setValueComment, reset: resetComment, formState: { errors: errorComment } } = useForm();

  const { register: registerFormula, handleSubmit: handleSubmitFormula,
    setValue: setValueFormula, reset: resetFormula, formState: { errors: errorFormula } } = useForm();

  const [getOneTest] = useGetOneTestMutation();
  const [addTestMethod] = useAddTestMethodMutation();
  const [updateOneTest] = useUpdateOneTestMutation();
  const [addFormula] = useAddFormulaMutation();
  const [deleteOneTest] = useDeleteOneTestMutation();
  const [addTestList] = useAddTestListMutation();
  const [getTestMethod] = useGetTestMethodMutation();
  const [getTestOption] = useGetTestOptionMutation();
  const [addComment] = useAddCommentMutation();

  const [defaultSelectValue, setDefaultSelectValue] = useState(undefined);
  const admin = useSelector((state) => state.admin);
  const handleOpenModal = (modal) => { setOpenModal(modal) };
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCustomOptions, setSelectedCustomOptions] = useState([]);


  useEffect(() => {
    if (subTestData) {
      setValueField('_id', subTestData?._id || "");
      setValueField('testMethod', subTestData?.testMethod || "");
      setDefaultSelectValue(subTestData?.testMethod)
      setValueField("default", subTestData?.default || "")
      setValueField('field', subTestData?.field || "");
      setValueField('testFieldType', subTestData?.testFieldType || "");
      setValueField('title', subTestData?.testTitle || "");
      if (subTestData?.testFieldType !== "multiple field") {
        setValueField('name', subTestData?.subTestName || subTestData?.testTitle || "");
      }
      else {
        setValueField('name', "");
      }

      setValueField('unit', subTestData?.unit || "");
      setValueField('min', subTestData?.min || "");
      setValueField('max', subTestData?.max || "");
      setValueField('textrange', subTestData?.textrange || "");
      setValueField('numericUnboundType', subTestData?.numericUnboundType || "");
      setValueField('numericUnboundValue', subTestData?.numericUnboundValue || "");

      setSelectedValues(subTestData?.options)
    }
    else {
      setValueField('_id', '');
      setValueField('testMethod', '');
      setValueField('field', '');
      setValueField('testFieldType', '');
      setValueField('min', '');
      setValueField('max', '');
      setValueField('textrange', '');
      setValueField('numericUnboundType', '');
      setValueField('numericUnboundValue', '');
      setSelectedCustomOptions([])
      setSelectedValues([])
    }
  }, [subTestData, setValueField]);



  const fetchData = async () => {
    if (id) {
      try {
        setTestData([]);
        const response = await getOneTest({ id: admin.admin.id, _id: id });
        setParentTest(response.data.data[0]);
        setPerentTestId(response.data.data[0].testList._id)
        setTestFieldData(response.data.data[0].testList.test[0].testFieldType)
        response.data.data[0].testList.test.map(item => {
          if (item.subTest.length == 0) {
            setTestData(prevTestData => [...prevTestData, { label: item.name, value: item._id }]);
          }
          else {
            item.subTest.map((subItem) => {
              setTestData(prevTestData => [...prevTestData, { label: subItem.name, value: subItem._id }]);
            })
          }
        })

        if (response.data.data[0].testList.test[0].testFieldType === "text") {
          setValueField("textTest", response.data.data[0].testList.test[0].textTest)
          setSubTestData({
            ...subTestData, testFieldType: response.data.data[0].testList.test[0].testFieldType,
            _id: response.data.data[0].testList.test[0]._id
          })
        }
        else {
          const subTestArray = response.data.data[0].testList.test;
          const updatedSubTable = subTestArray.map(item => {

            if (item.subTest.length != 0) {
              return {
                ...item,
                delete: <AiOutlineDelete onClick={async () => {
                  deletTest(response.data.data[0].testList._id, item._id)
                }} />,
                check: <input type="checkbox"
                  checked={selectedId === item._id}
                  onChange={(event) => {
                    setSelectedId(event.target.checked ? item._id : null);
                    event.target.checked ? (
                      item?.testFieldType == "multiple field" ? setSubTestData({ isSubTest: event.target.checked, testFieldType: item?.testFieldType, testTitle: item?.name, _id: item?._id }) :
                        (setSubTestData({
                          isSubTest: event.target.checked, testTitle: item?.name, _id: item?._id, unit: item?.unit, testMethod: item?.testMethod, testFieldType: item?.testFieldType, field: item?.field, min: item?.min, max: item?.max, textrange: item?.textrange,
                          numericUnboundType: item?.numericUnboundType, numericUnboundValue: item?.numericUnboundValue, options: item?.options, default: item?.default
                        }), setField(item?.field))
                    ) : (setSubTestData({}), setField("numeric"))
                  }} />,
                range: item.testFieldType == "multiple field" ? `` : item.field == "numeric" ? `${item?.min} - ${item?.max}`
                  : item.field == "numeric unbound" ? `${item?.numericUnboundType} - ${item?.numericUnboundValue}`
                    : item.field == "multiple ranges" ? `${item?.textrange}` : item.field == "text" ? `${item?.textrange}` : item?.field == "custom" ? `${item?.options.map((option) => option.value).join(" , ")}` : '',

                formula: <input type="checkbox"
                  defaultChecked={item?.isFormula ? item?.isFormula : formula}
                  name="formula" onChange={(event) => {
                    setFormula(event.target.checked)
                    filterFormula({ _id: item?._id, field: item?.field, testFieldType: item?.testFieldType });
                  }} />,

                subTestTable: <>
                  <Table columns={columns1} dataSource={item.subTest.map(subItem => ({
                    ...subItem,
                    delete: <AiOutlineDelete onClick={async () => {
                      deletTest(response.data.data[0].testList._id, item._id, subItem._id,)
                    }} />,

                    check: <input type="checkbox"
                      checked={selectedId === subItem._id}
                      onChange={(event) => {
                        setSelectedId(event.target.checked ? subItem._id : null);
                        event.target.checked ? (
                          setSubTestData({
                            isSubTest: event.target.checked, testTitle: item.name, subTestName: subItem.name, _id: item._id, subTestId: subItem._id, unit: subItem.unit, testMethod: subItem.testMethod, field: subItem.field, subTestSubData: true, min: subItem.min, max: subItem.max,
                            textrange: subItem.textrange, numericUnboundType: subItem.numericUnboundType, numericUnboundValue: subItem.numericUnboundValue, options: subItem?.options, default: subItem?.default
                          })
                          , setField(subItem?.field)) : (setSubTestData({}), setField("numeric"));
                      }} />,
                    range: subItem.field == "numeric" ? `${subItem?.min} - ${subItem?.max}`
                      : subItem.field == "numeric unbound" ? `${subItem?.numericUnboundType} - ${subItem?.numericUnboundValue}`
                        : subItem.field == "multiple ranges" ? `${subItem?.textrange}` : subItem?.field == "text" ? `${subItem?.textrange}` :
                          subItem?.field == "custom" ? `${subItem?.options.map((option) => option.value).join(" , ")}` : '',

                    formula: <input type="checkbox" name="formula" defaultChecked={subItem?.isFormula ? subItem?.isFormula : formula}
                      onChange={(event) => { setFormula(event.target.checked); filterFormula({ _id: item._id, subtestId: subItem._id, field: subItem?.field }); }} />
                  }))} size="small" pagination={false} />

                </>,
              }
            }
            else {
              return {
                ...item,
                delete: <AiOutlineDelete onClick={async () => {
                  deletTest(response.data.data[0].testList._id, item._id)
                }} />,

                check: <input type="checkbox"
                  checked={selectedId === item._id}
                  onChange={(event) => {
                    setSelectedId(event.target.checked ? item._id : null);
                    event.target.checked ? (
                      item.testFieldType == "multiple field" ? setSubTestData({ isSubTest: event.target.checked, testTitle: item?.name, _id: item?._id, testFieldType: item?.testFieldType, }) :
                        (setSubTestData({
                          isSubTest: event.target.checked, testTitle: item?.name, _id: item?._id, unit: item.unit, testMethod: item.testMethod, testFieldType: item?.testFieldType, field: item.field, min: item.min, max: item.max, textrange: item.textrange, numericUnboundType: item.numericUnboundType,
                          numericUnboundValue: item.numericUnboundValue, default: item?.default, options: item?.options,
                        }), setField(item?.field))
                    ) : (setSubTestData({}), setField("numeric"))
                  }} />,

                range: item?.testFieldType == "multiple field" ? `` : item.field == "numeric" ? `${item?.min} - ${item?.max}`
                  : item.field == "numeric unbound" ? `${item?.numericUnboundType} - ${item?.numericUnboundValue}`
                    : item.field == "multiple ranges" ? `${item?.textrange}` : item.field == "text" ? `${item?.textrange}` : item?.field == "custom" ? `${item?.options.map((option) => option.value).join(" , ")}` : '',
                formula: <input type="checkbox" name="formula"
                  defaultChecked={item?.isFormula ? item?.isFormula : formula}
                  onChange={(event) => { setFormula(event.target.checked); filterFormula({ _id: item._id, field: item?.field, testFieldType: item?.testFieldType, }); }} />
              };
            }
          });
          setAddFiled(updatedSubTable);
        }
      } catch (error) {

      }
    }
  };



  const filterFormula = async (data) => {
    setTestData([]);
    const response = await getOneTest({ id: admin.admin.id, _id: id });
    response.data.data[0].testList.test.map(item => {

      if (item.subTest.length == 0) {
        if (item._id !== data._id && item?.field !== "custom" && item?.testFieldType !== "multiple field") {
          setTestData(prevTestData => [...prevTestData, { label: item.name, value: item._id }]);
        }
      }
      else {
        item.subTest.map((subItem) => {
          if (subItem._id !== data?.subtestId && subItem?.field !== "custom") {
            setTestData(prevTestData => [...prevTestData, { label: subItem.name, value: subItem._id }]);
          }
        })
      }
    })
    setFormulaData({
      _id: data._id, subtestId: data.subtestId, field: data?.field,
      testFieldType: data?.testFieldType
    })

  }

  const onSubmit = async (data) => {
    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    if (selectedOption !== "Select Item" || selectedOption !== undefined) {
      data = { ...data, testMethod: selectedOption }
    }
    if (data.field == "custom") {
      const options = selectedValues.map(option => option);

      data = { ...data, options: options }
    }

    try {
      if (perentTestId && subTestData._id && subTestData.isSubTest && subTestData?.testFieldType == "single field") {

        const testList = { id: admin.admin.id, parentId: perentTestId, subtestId: subTestData._id, ...data }
        const response = await updateOneTest(testList);

        if (response.data.success) {
          fetchData();
          toast.success(response.data.message)

          setDisableInput({ ...isDisableInput, min: false, max: false, unit: false, testField: false, textrange: false, multipleRanges: false, numericUnboundType: false, numericUnboundValue: false })
          resetField();
          setSubTestData({});
        }
      }
      else if (perentTestId && subTestData.isSubTest && subTestData._id) {
        delete data?.testFieldType;
        if (subTestData.subTestId) {
          const testList = { id: admin.admin.id, parentId: perentTestId, subtestId: subTestData._id, subtestsubId: subTestData.subTestId, ...data }
          const updateTest = await updateOneTest(testList);

          if (updateTest.data.success) {
            fetchData();
            toast.success(updateTest.data.message)
          }
        }

        else {
          const testList = { id: admin.admin.id, perentTestId: perentTestId, subtestId: subTestData._id, subTest: data }
          const response = await addTestList(testList);

          if (response.data.success) {

            fetchData();
            toast.success(response.data.message)
            resetField();
            setDisableInput({ ...isDisableInput, min: false, max: false, unit: false, testField: false, textrange: false, multipleRanges: false, numericUnboundType: false, numericUnboundValue: false })
            setSubTestData({});
          }
        }
      }

      else if (perentTestId) {
        const testList = { id: admin.admin.id, perentTestId: perentTestId, test: data }
        const response = await addTestList(testList);

        if (response.data.success) {
          fetchData();
          if (response.data.data.testFieldType == "text") {
            toast.success(response.data.message)
            setValueField("textTest", response.data.data.textTest)
            setSubTestData({
              ...subTestData, testFieldType: response.data.data.testFieldType,
              _id: response.data.data._id
            })
          }

          else {

            toast.success(response.data.message)
            resetField();
            setSubTestData({});
            setDisableInput({ ...isDisableInput, min: false, max: false, unit: false, testField: false, textrange: true, multipleRanges: false, numericUnboundType: false, numericUnboundValue: false })
          }
        }
      }

      else {
        toast.error("Firts fill the Parent Data")
      }
    }

    catch (error) {
    }
  }

  useEffect(() => {
    fetchData();
    getTestMethodData();
    getTestOptionData();
  }, [admin.admin.id, selectedId]);

  const deletTest = async (parentId, subtestId, subtestsubId) => {
    if (subtestsubId) {
      const responseDelete = await deleteOneTest({ id: admin.admin.id, parentId: parentId, subtestId: subtestId, subtestsubId: subtestsubId });
      if (responseDelete.data.success) {
        fetchData();
        toast.success(responseDelete.data.message)
        setSubTestData({})
      }
    } else {
      const responseDelete = await deleteOneTest({ id: admin.admin.id, parentId: parentId, subtestId: subtestId });
      if (responseDelete.data.success) {
        fetchData();
        toast.success(responseDelete.data.message)
        setSubTestData({})
      }
    }

  }

  const onSubmitFormula = async () => {
    try {
      if (formulaValue?.formulaData) {
        console.log("Formula value :", formulaValue)
        if (perentTestId) {

          if (formulaData.subtestId) {
            const newdata = {
              id: admin.admin.id, parentTestId: perentTestId, subTestId: formulaData._id,
              subTestsubId: formulaData.subtestId, formula: formulaValue.formulaData
            }

            const response = await addFormula(newdata);
            if (response.data.success) {
              toast.success(response.data.message)
              fetchData();
              resetFormula();
              handleOpenModal(null);
            }
          }

          else {
            const newdata = {
              id: admin.admin.id, parentTestId: perentTestId, subTestId: formulaData._id, formula: formulaValue.formulaData
            }
            const response = await addFormula(newdata);
            if (response.data.success) {
              toast.success(response.data.message)
              fetchData();
              resetFormula();
              handleOpenModal(null)
            }
          }
        }
        else {
          toast.error("Firts fill the Parent Data")
        }
      }
      else {
        toast.error("Please fill the formula")
      }

    } catch (error) {
    }
  }

  const onSubmitComment = async (data) => {
    if (perentTestId) {
      const response = await addComment({ id: admin.admin.id, parentTestId: perentTestId, comment: data.comment });

      if (response.data.success) {
        toast.success(response.data.message)
        handleOpenModal(null)
        resetComment();
        fetchData();
      }
    }
    else {
      toast.error("Firts fill the Parent Data")
      handleOpenModal(null)
    }
  }
  // set data on parent form
  useEffect(() => {
    if (parentTest) {
      setValue('department', parentTest.testList?.department || '');
      setValue('testName', parentTest.testList?.testName || '');
      setValue('testPrice', parentTest.testList?.testPrice || '');
      setValue('testCode', parentTest.testList?.testCode || '');
      setValue('gender', parentTest.testList?.gender || '');
      setValue('sampleType', parentTest.testList?.sampleType || '');
    }
  }, [parentTest, setValue]);

  const testSubmit = async (data) => {
    try {
      if (perentTestId !== "") {
        const testList = { ...data, id: admin.admin.id, _id: perentTestId }
        const response = await updateOneTest(testList);
        if (response.data.success) {
          resetField();
          fetchData();
          toast.success(response.data.message)
        }
      }
      else {
        const testList = { ...data, id: admin.admin.id }
        const response = await addTestList(testList);
        if (response.data.success) {
          const id = response.data.data._id;

          toast.success(response.data.message)
          resetField();
          setPerentTestId(id)
          navigate('/dashboard/test/list/addtest', { state: id });
        }
      }
    }
    catch (error) {
    }
  }

  const handleTestType = (value) => {
    if (value == "multiple field") {
      setDisableInput({ ...isDisableInput, min: true, max: true, unit: true, testField: true, textrange: true, multipleRanges: true, numericUnboundType: true, numericUnboundValue: true })
    }
    else {
      setDisableInput({ ...isDisableInput, min: false, max: false, unit: false, testField: false, textrange: false, multipleRanges: false, numericUnboundType: false, numericUnboundValue: false })
    }
  }
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Select Item");

  const getTestMethodData = async () => {
    const response = await getTestMethod({ id: admin.admin.id })

    if (response.data.success) {
      const testMethod = response.data.data.map((item) => item.testName)
      setOptions(testMethod)
    }
  }

  const getTestOptionData = async () => {
    const response = await getTestOption({ id: admin.admin.id })
    if (response.data.success) {
      const testOption = response.data.data.map((item) => item.option)
      setCustomOptions(testOption)
    }
  }

  const handleFormulaValue = () => {

    if (formulaValue.formulaName || formulaValue.formulaData) {
      console.log("selectedFormulaTest : ", selectedFormulaOperator)
      if (selectedFormulaTest.testId && selectedFormulaOperator) {
        setFormulaValue({
          ...formulaValue,
          formulaName: formulaValue.formulaName + selectedFormulaOperator + selectedFormulaTest.name,
          formulaData: formulaValue.formulaData + "#" + selectedFormulaOperator + "#" + selectedFormulaTest.testId
        })
        console.log("Formula if : ", formulaValue)
        setSelectedFormulaTest({ name: "", testId: "" })
        setSelectedFormulaOperator("")
        resetFormula()
      }
      else {
        toast.error("Select both operator and test ", selectedFormulaTest)
        setSelectedFormulaTest({ name: "", testId: "" })
        setSelectedFormulaOperator("")
        resetFormula()
      }

    }
    else {
      setFormulaValue({
        ...formulaValue,
        formulaName: formulaValue.formulaName + selectedFormulaTest.name,
        formulaData: formulaValue.formulaData + selectedFormulaTest.testId
      })
      setSelectedFormulaTest({ name: "", testId: "" })
      setSelectedFormulaOperator("")
      resetFormula()
      console.log("Formula else : ", formulaValue)
    }
    setSelectedFormulaTest({ name: "", testId: "" })
    setSelectedFormulaOperator("")
    resetFormula()
  }

  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addNewTestMethod = async (e) => {
    e.preventDefault();
    setOptions([...options, name || `New item ${index++}`]);
    setDefaultSelectValue(name);
    const response = await addTestMethod({ id: admin.admin.id, testMethod: name })
    if (response.data.success) {
      setOptions([...options, response.data.data.testName])
      setSelectedOption(name)
      toast.success(response.data.message)
    }
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };


  const [optionName, setOptionName] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  const optionRef = useRef(null);

  const handleInputChange = (value) => {
    setOptionName(value);
  };

  const handleAddCustomItem = () => {
    if (optionName) {
      setSelectedValues((prev) => {
        if (Array.isArray(prev)) {
          return [...prev, optionName];
        } else {
          return [optionName];
        }
      });
      if (optionName && !customOptions.includes(optionName)) {
        setCustomOptions((prev) => [...prev, optionName]);
        setOptionName('');
        optionRef.current.focus();
      }
    }

  };
  const handleSelectionChange = (value1) => {
    setSelectedValues(value1);
    setSelectedCustomOptions(value1.map((item) => { return { value: item } }));
  };

  return (
    <>
      <div className="bg-background px-6 py-4 h-auto">
        <form onSubmit={handleSubmit(testSubmit)}>
          <div className="sm:flex justify-between space-y-5 sm:space-y-0">
            <div className="text-2xl font-semibold">New Test</div>
            <div className="sm:flex items-center space-y-2 sm:space-y-0 py- px-5 sm:px-0 gap-5">
              <div onClick={() => handleOpenModal("addcomment")}>
                <ButtonComponent type="button" title={<><FaPlus /> Add Comments</>} className="flex justify-center items-center gap-2 py-0 text-white font-medium bg-btn-color  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500 h-8" />
              </div>
              {/* <ButtonComponent type="button" title="Report Preview" className="h-8 border border-btn-color text-btn-color bg-transparent hover:text-white hover:bg-btn-color" /> */}
              <ButtonComponent title={<><CiEdit className="font-bold" /> Save</>} className="h-8 text-white bg-btn-color flex justify-center items-center gap-2  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"
                type="submit"
              />
            </div>
          </div>

          {/* row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex justify-between gap-5 mt-5 sm:space-y-0">
            <div className="w-full">
              <SelectBox options={labTestDepartments} label="Department" mainStyle="flex-col" className="h-8"
                defaultValue={parentTest.testList?.department}
                {...register("department", { required: "Department is required" })} />
              {errors.department && <p className="text-red-600 font-normal text-xs">{errors.department.message}</p>}
            </div>

            <div className="w-full">
              <InputField placeholder="Test Name" label="Test Name" isSearch={false}
                defaultValue={parentTest.testList?.testName}
                {...register("testName", { required: "Test Name is required", })} />
              {errors.testName && <p className="text-red-600 font-normal text-xs">{errors.testName.message}</p>}
            </div>

            <div className="w-full">
              <InputField type="number" placeholder="cost" label="Cost" isSearch={false}
                defaultValue={parentTest.testList?.testPrice}
                {...register("testPrice", { required: "Test Price is required", })} />
              {errors.testPrice && <p className="text-red-600 font-normal text-xs">{errors.testPrice.message}</p>}
            </div>

            <div className="w-full">
              <InputField placeholder="Test Code" label="Test Code" isSearch={false}
                defaultValue={parentTest.testList?.testCode}
                {...register("testCode", { required: "Test Code is required", })} />
              {errors.testCode && <p className="text-red-600 font-normal text-xs">{errors.testCode.message}</p>}
            </div>
          </div>

          {/* row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex justify-between items-center gap-5 py-4 ">
            <div className="w-full">
              {/* {
                console.log("gender : ",gender)
              } */}
              <SelectBox options={genderArray} label="Sample Type" mainStyle="flex-col" className="h-8"
                defaultValue={parentTest.testList?.gender}
                // {...register("gender", { required: "Gender is required", })}
                {...register("gender", { required: "Sample Type is required", })}
              />
              {errors.gender && <p className="text-red-600 font-normal text-xs">{errors.gender.message}</p>}
            </div>

            <div className="w-full">
              <SelectBox options={labTestTypes} label="Sample Type" mainStyle="flex-col" className="h-8"
                defaultValue={parentTest.testList?.sampleType}
                {...register("sampleType", { required: "Sample Type is required", })} />
              {errors.sampleType && <p className="text-red-600 font-normal text-xs">{errors.sampleType.message}</p>}
            </div>
            <div className="w-full">
              <SelectBox options={labTestTypes} label="Age Type" className="h-8" mainStyle="flex-col" disabled={true} {...register("ageType")} />
            </div>
            <div className="flex w-full gap-2 mt-auto items-end">
              {/* <div className="flex gap-2 items-end mt-auto"> */}
              <ButtonComponent type="button" title={<CiEdit className="font-bold" />} className="bg-transparent border-2 rounded-md" />
              <ButtonComponent type="button" title={<FaPlus className="font-bold" />} className="bg-transparent border-2 rounded-md" />
              {/* </div> */}
              <div className="flex justify-end items-end mt-auto" onClick={() => { handleOpenModal("intrepretation") }}>
                <ButtonComponent type="button" title="View&nbsp;Intrepretation" className="w-40 py-1 text-white h-9 flex items-center  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" />
              </div>
            </div>
          </div>
          <hr />
        </form>

        {/* row 3 */}
        <form onSubmit={handleSubmitField(onSubmit)}>
          <div className="lg:flex sm:flex-wrap py-4">
            <div className="w-full xl:w-2/3 xl:px-3 overflow-auto">
              {
                (testFieldData == "single field" || testFieldData == "multiple field") ? (
                  <Table
                    columns={columns}
                    rowKey={(record) => record?._id} // Ensure each row is unique by passing the objectId
                    expandable={{
                      expandedRowRender: (record) => (
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {record?.subTestTable}
                        </p>
                      ),
                      rowExpandable: (record) => record?.testFieldType === 'multiple field',
                    }}
                    dataSource={addFiled}
                  />) : <Intrepretation label="Content :" name="textTest" control={controlField} defaultValue={getValuesField("textTest")?.toString()} />
              }
            </div>

            <div className="sm:flex xl:justify-end w-full  xl:w-1/3 ">
              <div className=" sm:px-3  py-5 sm:py-0 space-y-3 font-normal"> {/* Apply flex-row to the parent div */}

                {
                  ((subTestData.isSubTest && subTestData.testTitle && !subTestData.testMethod) || (subTestData.subTestSubData)) ? (
                    <div className="space-y-3 font-normal">
                      <InputField
                        placeholder="Title"
                        label="Title:&emsp;"
                        defaultValue={subTestData?.testTitle}
                        isSearch={false}
                        mainstyle="flex items-center"
                        className="h-8 text-sm"
                        name="title"
                        {...registerField("title", testFieldData !== "text" ? { required: "Title is required" } : {})}
                      />
                      {errorField.title && <p className="text-red-600">{errorField.title.message}</p>}

                      <div className="w-full flex justify-end">
                        <ButtonComponent title="Save" className="text-white h-8 flex items-center justify-center hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" />
                      </div>
                    </div>
                  ) :
                    <SelectBox options={testFieldType} label="Type:" name="testFieldType" mainStyle="flex-row w-full gap-5" className="w-full h-8" defaultValue={subTestData?.testFieldType ? subTestData?.testFieldType : ''} {...registerField("testFieldType", { required: "Test Field Type is required", })}
                      disabled={parentTest?.testList?.test[0]?.testFieldType !== "text" ? false : true}
                      onChange={(event) => { handleTestType(event.target.value), setTestFieldData(event.target.value) }}
                    />
                }
                <div className={`${testFieldData === "text" ? "hidden" : ""}`}>
                  <InputField placeholder="Name" label="Name:&emsp;" isSearch={false} mainstyle="flex items-center" className="h-8 text-sm" name="name"
                    defaultValue={subTestData?.subTestName}

                    {...(testFieldData !== "text" ? registerField("name", { required: "Name is required" }) : {})}
                  />
                  {errorField.name && <p className="text-red-600">{errorField.name.message}</p>}
                  <div className=" text-left w-full flex gap-5 py-3">

                    <p className="font-normal text-gray-700 text-sm">Test&nbsp;Method: </p>
                    <Select
                      value={defaultSelectValue}
                      style={{
                        width: 300,
                      }}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider
                            style={{
                              margin: '8px 0',
                            }}
                          />
                          <Space
                            style={{
                              padding: '0 8px 4px',
                            }}
                          >
                            <Input
                              placeholder="Please enter item"
                              ref={inputRef}
                              value={name}
                              onChange={onNameChange}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button type="text" icon={<PlusOutlined />} onClick={addNewTestMethod}>
                              Add item
                            </Button>
                          </Space>
                        </>
                      )}
                      {...registerField('testMethod')}
                      options={options.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(value) => {
                        setDefaultSelectValue(value);
                        setSelectedOption(value)
                      }}
                    />
                  </div>

                  <SelectBox options={testField} label="Field:&emsp;" mainStyle="flex-row gap-3 w-full" labelclass="text-sm" className="h-8 text-sm w-full " name="field" defaultValue={subTestData?.testField}
                    {...registerField("field")} onChange={(event) => setField(event.target.value)} disabled={isDisableInput.testField} />
                  <InputField placeholder="Unit" label="Unit:&emsp;" isSearch={false} mainstyle="flex items-center gap-4" labelclass="text-sm" className="h-8 text-sm" outerClass="my-2" name="unit" defaultValue={subTestData?.unit}
                    {...registerField("unit")} disabled={isDisableInput.unit} />
                  {
                    (field === "numeric") ?
                      <div className="flex items-center gap-3">
                        <InputField placeholder="Minimum" label="Range:&emsp;" isSearch={false} mainstyle="flex items-center" className="h-8 text-sm" name="min" defaultValue={subTestData?.min}
                          {...registerField("min")} disabled={isDisableInput.min} />
                        <span className="flex ">to</span>
                        <InputField placeholder="Maximum" isSearch={false} className="h-8 text-sm" name="max" defaultValue={subTestData?.max}
                          {...registerField("max")} disabled={isDisableInput.max} />
                      </div> : ""
                  }

                  {
                    (field == "text") ?
                      <div className="flex items-center gap-3">
                        <label htmlFor="textrange">Range</label>
                        <textarea placeholder="Enter Range" name="textrange" id="textrange" rows={4} className="border border-1 w-full p-1" defaultValue={subTestData?.textrange}
                          {...registerField("textrange")} disabled={isDisableInput.textrange}
                        ></textarea>
                      </div>
                      : ""
                  }

                  {
                    (field == "numeric unbound") ?
                      <div className="flex items-center gap-3 justify-center">
                        <SelectBox options={numericUnboundType} label="Range" mainStyle="flex-row gap-5" className="h-8" name="numericUnboundType" defaultValue={subTestData?.numericUnboundType}
                          {...registerField("numericUnboundType")} disabled={isDisableInput.numericUnboundType}
                        />
                        <InputField placeholder="Value" isSearch={false} className="h-8 text-sm" name="numericUnboundValue" defaultValue={subTestData?.numericUnboundValue}
                          {...registerField("numericUnboundValue")} disabled={isDisableInput.numericUnboundValue} />
                      </div>
                      : ""
                  }

                  {
                    (field == "multiple ranges") ?
                      <div className="flex items-center gap-3">
                        <label htmlFor="textrange">Range</label>
                        <textarea placeholder="Enter Range" name="textrange" id="textrange" rows={4} className="border border-1 w-full p-1"
                          {...registerField("textrange")} disabled={isDisableInput.multipleRanges}
                        ></textarea>
                      </div>
                      : ""
                  }
                  {
                    (field == "custom") ?
                      <>
                        <div className="flex items-center gap-3 py-5">
                          <p className="text-sm font-normal text-gray-600">Options</p>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select one country"
                            value={selectedValues}

                            onChange={handleSelectionChange}
                            options={customOptions?.map((option) => ({ label: option, value: option }))}
                            dropdownRender={(menu) => (
                              <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                  <Input
                                    className="W-60"
                                    placeholder="Please enter item"
                                    ref={optionRef}
                                    value={optionName}
                                    onChange={(event) => handleInputChange(event.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                  />
                                  <Button type="text" icon={<PlusOutlined />} onClick={handleAddCustomItem}>
                                    Add item
                                  </Button>
                                </Space>
                              </>
                            )}
                          />
                        </div>

                        <SelectBox
                          options={selectedCustomOptions}
                          name="default"
                          mainStyle="flex-row gap-4 items-center"
                          className="w-full h-8"
                          title={subTestData?.default}
                          label="Default"
                          {...registerField("default")}
                          defaultValue={subTestData?.default ? subTestData?.default : "xyz"}
                        />
                      </>
                      : ""
                  }
                  {
                    formula && (formulaData.field !== "custom" && formulaData.testFieldType !== "multiple field") ? (
                      <div className="flex justify-end" onClick={() => handleOpenModal("formula")}>
                        <ButtonComponent
                          type="button"
                          title={<><FaPlus /> Add Formula</>}
                          className="flex items-center justify-center gap-2 text-btn-color border border-btn-color bg-transparent mt-4 w-36 h-9 text-sm hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"
                        />
                      </div>
                    ) : ''
                  }

                </div>
                {
                  testFieldData === "text" && (
                    <div className="flex justify-end" onClick={async () => { deletTest(perentTestId, subTestData._id); }}>
                      <ButtonComponent type="button" title={<><AiOutlineDelete /> Delete</>} className="flex items-center justify-center gap-2 text-red-500 border border-red-500 bg-transparent mt-4 w-36 h-9 text-sm  hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-red-500" />
                    </div>
                  )
                }
                <div className="flex justify-end">
                  <ButtonComponent title={<><FaPlus /> Add Field</>} className="flex items-center justify-center gap-2 text-white mt-2 w-36 h-9 text-sm  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" type="submit" />
                </div>

              </div>
            </div>
          </div>

        </form>
      </div >

      {/* Intrepretation Modal */}
      < Dialog
        open={openModal === "intrepretation"}
        size="sm"
        handler={handleOpenModal}
      >
        <DialogHeader>Intrepretation</DialogHeader>
        <DialogBody>
          {/* <Intrepretation /> */}
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-3xl italic">Work in progress</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <ButtonComponent
            title="Ok"
            variant="text"
            color="red"
            onClick={() => handleOpenModal(null)}
            className="mr-1 text-white font-medium px-5 rounded"
          />
        </DialogFooter>
      </ Dialog>

      {/* Formula Modal */}
      < Dialog open={openModal === "formula"} size="sm" handler={handleOpenModal} >
        <DialogHeader>Add Formula</DialogHeader>
        <form onSubmit={handleSubmitFormula(onSubmitFormula)}>
          <DialogBody>
            <div className="flex">
              <InputField placeholder="Enter Formula" label="Formula: " className="w-full" mainstyle="flex gap-3 flex-row  items-center" labelclass="text-xl font-medium " isSearch={false}
                name="formula"
                {...registerFormula("formula")}
                disabled={true}
                defaultValue={formulaValue.formulaName}
        
              />
            </div>
            

            <div className="w-full py-3 flex  items-end gap-2">
              <div className={`w-full ${!formulaValue.formulaName ? "hidden" : ""}`}>
                <SelectBox options={formulaOperator} label="Operator" mainStyle="flex-col" className="h-8 w-full font-medium" name="operator" defaultValue={selectedFormulaOperator}
                  onChange={(event) => setSelectedFormulaOperator(event.target.value)} />
                  
              </div>
              <div className="w-full">
                
                <SelectBox options={testData && testData} label="Search Test" mainStyle="flex-col" className="h-8 w-full font-medium" name="test"
                  // defaultValue={selectedFormulaTest ? console.log("TESTTTTTTT:::", selectedFormulaTest) : ''}
                  onChange={(event) => setSelectedFormulaTest({ name: event.target.options[event.target.selectedIndex].label, testId: event.target.value })
                  } />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <ButtonComponent title={<><FaPlus /> Add</>} className="bg-transparent border border-btn-color h-8 flex gap-1 justify-center items-center px-5 text-btn-color font-medium  hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" type="button" onClick={handleFormulaValue} />
            </div>
          </DialogBody>
          <DialogFooter className="gap-4">
            <ButtonComponent
              title="Cancel"
              onClick={() => handleOpenModal(null)}
              className="px-2 bg-transparent border border-red-400 text-red-500 h-8 flex items-center font-regular hover:border-red-500 hover:text-red-800 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-red-500"
              type="button"
            />
            <ButtonComponent
              title="Add Formula"
              className="text-white px-5 font-medium h-8 flex items-center font-regular  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"
              type="submit"
            />
          </DialogFooter>
        </form>
      </Dialog >

      {/*  Add comment Modal */}
      <Dialog
        open={openModal === "addcomment"}
        handler={handleOpenModal}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none"
      >
        <DialogHeader className="flex justify-between py-2">
          <div>
            <p className="text-[18px]">Add Comment</p>
          </div>
          <div>
            <FaXmark
              onClick={() => handleOpenModal(null)}
              className="mr-1 text-md hover:text-3xl"
            />
          </div>
        </DialogHeader>
        <hr />

        <form onSubmit={handleSubmitComment(onSubmitComment)}>
          <DialogBody>
            <div className="flex flex-col ">
              <div className="flex w-full">
                <label htmlFor="comment" className="font-normal flex items-center px-2"><span className="text-red-500">*</span> Comment: </label>
                <textarea placeholder="comment" name="comment" id="comment" rows="6" className="border-2 text-sm font-regular font-normal border-gray-200 w-full"
                  {...registerComment("comment", { required: "Comment is required" })}
                ></textarea>
              </div>
              <div className="flex justify-end">
                {errorComment.comment && <p className="text-red-600 font-regular font-normal text-xs">{errorComment.comment.message}</p>}
              </div>
            </div>

          </DialogBody>
          <DialogFooter>
            <ButtonComponent
              title="Save"
              className="flex items-center gap-2 py-0 text-white font-medium bg-btn-color h-8"
              type="submit"
            />
          </DialogFooter>
        </form>

      </Dialog>
    </>
  );
}

export default AddTest;