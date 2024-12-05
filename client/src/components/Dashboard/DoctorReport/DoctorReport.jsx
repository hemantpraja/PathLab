import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetOnePatientMutation } from "../../../redux/services/adminApi.service";
import { useAddIssueMutation, useAddNoteMutation, useEditReportMutation } from "../../../redux/services/adminApi.service.js";
import { useAddCommentMutation } from "../../../redux/services/labApi.service.js";
import { ButtonComponent, InputField, ReportFormate, SelectBox } from "../../index";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiMiniXMark } from "react-icons/hi2";

function DoctorReport() {

  const [open, setOpen] = React.useState(null);
  const [size, setSize] = React.useState(null);
  const [patient, setPatient] = useState({});
  const handleOpen = (modal) => setOpen(modal);
  const handleCloseModal = () => setOpen(null);
  const admin = useSelector((state) => state.admin);

  const [footerStatus, setFooterStatus] = useState(false);
  const [roleManageData, setRoleManageData] = useState({});
  const [comment, setComment] = useState({});
  const [getOnePatient] = useGetOnePatientMutation();
  const [editReport] = useEditReportMutation();
  const [addIssue] = useAddIssueMutation();
  const [addNote] = useAddNoteMutation();
  const [addComment] = useAddCommentMutation();
  const [formulaParameters, setFormulaParameters] = useState({});
  const [formula, setFormula] = useState({});
  const { register: registerIssue, handleSubmit: handleSubmitIssue, formState: { errors: errorsIssue }, reset: resetIssueForm } = useForm();
  const { register: registerNote, handleSubmit: handleSubmitNote, formState: { errors: errorsNote }, reset: resetNoteForm } = useForm();
  const { register: registerComment, handleSubmit: handleSubmitComment, formState: { errors: errorsComment }, reset: resetCommentForm } = useForm();

  const handleBillpdfOpen = (value) => setSize(value);

  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatient();
    handleBillpdfOpen(null);
  }, [admin.admin.id, id]);

  const fetchPatient = async () => {
    try {
      const response = await getOnePatient({ id: admin.admin.id, _id: id });
      const patientData = response.data.data?.patient;
      const data = patientData.testDetails?.length > 0 && patientData?.testDetails.map((testDetail, index) => {
        const addedObservedValue = testDetail?.test.map(test => {
          const updatedTest = { ...test, subTest: [...test.subTest] };

          if (test?.subTest?.length <= 0) {
            setFormulaParameters(prevState => ({ ...prevState, [test._id]: 0 }));
          }
          if (test.formula) {
            setFormula(prevState => ({ ...prevState, [test._id]: test.formula }));
          }

          test?.subTest.forEach(subTest => {
            setFormulaParameters(prevState => ({ ...prevState, [subTest._id]: 0 }));
            if (subTest.formula) {
              setFormula(prevState => ({ ...prevState, [subTest._id]: subTest.formula }));
            }
          })

          testDetail?.testObserved.forEach(observed => {
            if (observed.subTestId) {
              const subTestIndex = updatedTest.subTest.findIndex(sub => sub._id === observed.subTestId);
              if (subTestIndex !== -1) {
                testDetail?.test?.forEach((test) => {
                  const subtest = test?.subTest?.find(subtest => subtest._id === observed.subTestId && subtest?.field === "custom");
                  if (subtest) {
                    setFormulaParameters(prevState => ({ ...prevState, [observed.subTestId]: (observed.testObservedValue) }));
                  }
                  setFormulaParameters(prevState => ({ ...prevState, [observed.subTestId]: parseInt(observed.testObservedValue) }));
                });
                updatedTest.subTest[subTestIndex] = { ...updatedTest.subTest[subTestIndex], subTestObservedValue: observed.testObservedValue };
              }
            } else if (test._id === observed.testObservedId) {
              if (test?.field == "custom") {
                setFormulaParameters(prevState => ({ ...prevState, [test._id]: (observed.testObservedValue) }));
              }
              setFormulaParameters(prevState => ({ ...prevState, [test._id]: parseInt(observed.testObservedValue) }));
              updatedTest.observedValue = observed.testObservedValue;
            }
          });
          return updatedTest;
        });
        const testdata = { ...testDetail, test: addedObservedValue }
        return testdata;
      }).flat();

      if (data) {
        const finalData = { ...patientData, testDetails: data }
        setPatient(finalData);
      }
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };
  // save report data
  useEffect(() => {
    if (admin && admin.admin.manageUser) {
      const roleData = admin.admin.manageUser[0].role;
      const roleAccessData = { enterVerify: !roleData?.doctor?.tabs?.enterVerify, }
      setRoleManageData(roleAccessData);
    }
    else {
      setRoleManageData({});
    }
  }, [admin]);


  const handleSubmit = async () => {
    try {
      var reportData = [];
      patient?.testDetails?.forEach(patient => {
        patient?.test?.forEach(test => {
          if (test.subTest.length <= 0) {
            reportData.push({ patientTestId: patient._id, testId: test._id, observedValue: formulaParameters[test._id], subTestId: "" });
          } else {
            test?.subTest?.forEach(subTest => {
              reportData.push({ patientTestId: patient._id, testId: test._id, observedValue: formulaParameters[subTest._id], subTestId: subTest._id, });
            })
          }
        })
      })
      const data = {
        adminId: admin.admin.id,
        patientId: id.id,
        allvalue: reportData
      }
      const response = await editReport(data);
      if (response.data.success) {
        toast.success("Report updated successfully");
        fetchPatient();
        return true;
      }
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  }

  const onSubmitIssue = async (data) => {
    const response = await addIssue({ adminId: admin.admin.id, patientId: id.id, data });
    if (response.data.success) {
      toast.success("Issue added successfully");
      fetchPatient();
      resetIssueForm();
      handleCloseModal(null)

    }
  }

  const onSubmitNote = async (data) => {
    const response = await addNote({ adminId: admin.admin.id, patientId: id.id, data });
    if (response.data.success) {
      toast.success("Note added successfully");
      fetchPatient();
      resetNoteForm();
      handleCloseModal(null)
    }
  }
  const onchangeFooter = async (value) => {
    const response = await addNote({ adminId: admin.admin.id, patientId: id.id, footerStatus: value });
    if (response.data.success) {
      toast.success("Footer Status Update successfully");
      fetchPatient();
    }
  }


  const handleAddComment = (testid, comment) => {
    setComment({ testid, comment })
  }

  const onSubmitComment = async (data) => {
    const response = await addComment({ adminId: admin.admin.id, patientId: id.id, parentTestId: comment.testid, data });
    if (response.data.success) {
      toast.success("Comment added successfully");
      setComment({});
      fetchPatient();
      resetCommentForm();
      handleCloseModal(null);
    }
  }

  const handleSetValue = (event, testId, subTestId) => {
    setFormulaParameters(prevState => ({ ...prevState, [testId]: event.target.value }));

    Object.keys(formula).forEach(key => {
      const parts = formula[key].split('#').map(part => part.split('@'));
      const formulaParts = parts.map(part => {
        if (['+', '-', '*', '/'].includes(part[0])) {
          return { operator: part[0] };
        } else {
          const [testId, subTestId] = part;
          return { testId, subTestId };
        }
      });

      let res = 0;

      for (let i = 0; i < formulaParts.length; i++) {
        const part = formulaParts[i];
        if (i % 2 == 0) {
          if (testId == part.testId) {
            res = parseInt(event.target.value);
          }
          else {
            res = parseInt(formulaParameters[part.testId]);
          }
        }
        else {
          if (testId == Object.keys(formulaParameters).find(key => key === formulaParts[i + 1].testId)) {
            res = eval(`${res}${part.operator}${parseInt(event.target.value)}`);
          }
          else {
            res = eval(`${res}${part.operator}${parseInt(formulaParameters[formulaParts[i + 1].testId])}`);
          }
          i++;
        }
      }
      setFormulaParameters(prevState => ({ ...prevState, [key]: res }));
    })

  }

  const approvePatient = async () => {

    const test = await handleSubmit();
    if (test) {
      const response = await addIssue({ adminId: admin.admin.id, patientId: id.id, status: true });
      if (response.data.success) {
        toast.success("Aprroved");
        fetchPatient();
        handleBillpdfOpen("lg");
      }
    }

  }
  return (
    <>
      <div className="bg-background p-2 sm:p-5 py-8">
        <div className="bg-white  lg:flex justify-between gap-5 lg:gap-0 space-y-4 lg:space-y-0 items-center px-4 py-2 w-full rounded-sm ">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:flex gap-8 w-full ">

            <p className="mb-0">
              <span className="font-normal">Name :</span>{" "}
              <span className="font-medium">{patient?.firstName}</span>
            </p>

            <p className="mb-0">
              <span className="font-normal">Gender :</span>{" "}
              <span className="font-medium">{patient?.gender}</span>
            </p>

            <p className="mb-0">
              <span className="font-normal">Age :</span>{" "}
              <span className="font-medium">{`${patient?.age} ${patient?.ageType}`}</span>
            </p>

            <p className="mb-0">
              <span className="font-normal">Status :</span>{" "}
              <span className="font-medium text-btn-color">{patient?.status ? "Completed" : "Ongoing"}</span>
            </p>
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:flex space-y-3 sm:space-y-0 lg:justify-end gap-2 sm:gap-4">
            <div className={`${roleManageData?.enterVerify ? "hidden" : ""} flex items-center gap-4`}>
              <p className="font-medium mb-0">Show Header & Footer</p>
              <div className="inline-flex items-center" key={1}>
                <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
                  <input
                    onChange={(event) => onchangeFooter(event.target.checked)}
                    checked={patient?.footerStatus ? true : false}
                    id={`footerPrintStatus`}
                    type="checkbox"
                    name="footerStatus"
                    className={`absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-100 checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500`}
                  />
                  <label htmlFor={`footerPrintStatus`}
                    className={` before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500`}
                  >
                    <div
                      className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                      data-ripple-dark="true" >
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <ButtonComponent
              title="Report&nbsp;Preview"
              type="button"
              onClick={() =>
                handleBillpdfOpen("lg")}
              className={`${roleManageData?.enterVerify ? "lg:hidden" : ""} h-8 flex items-center justify-center border border-btn-color bg-transparent text-btn-color hover:bg-btn-color hover:text-white`}
            />

            <ButtonComponent
              title="Save"
              className="border border-btn-color bg-btn-color text-white h-8 flex items-center justify-center"
              onClick={handleSubmit}
            />
            <ButtonComponent
              title="View&nbsp;More"
              type="button"
              onClick={() => navigate('/dashboard/patientlist/patientdetails', { state: id })}
              className={`${roleManageData?.enterVerify ? "lg:hidden" : ""} h-8 flex items-center justify-center border border-btn-color bg-transparent text-btn-color hover:bg-btn-color hover:text-white`}
            />

          </div>
        </div>

        <div className="bg-white px-2 sm:px-4 py-4 mt-3 space-y-4 w-full overflow-auto">
          <div className="flex gap-2 justify-between font-medium px-2 sm:px-5 w-full ">
            <p className="border-r sm:border-none px-2">Test</p>
            <p className="border-r sm:border-none px-2">Observed Value</p>
            <p className="border-r sm:border-none px-2">Units</p>
            <p className=" px-2">Normal Range</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {
              patient && (
                patient?.testDetails?.map((test, parentindex) => {
                  return test?.test?.length > 0 ? (
                    <div className="border rounded-md py-2 w-full" key={parentindex}>
                      <div className="sm:flex justify-between px-2 sm:px-5 bg-gray-50 py-2">
                        <div> <p className="font-medium">{test?.testName}</p> </div>
                        <div className="flex justify-between sm:justify-end items-center gap-6">

                          <div className="flex gap-1">
                            <input type="checkbox" id="interpretation" />
                            <label htmlFor="interpretation">Show Interpretation</label>
                          </div>

                          <div onClick={() => { handleOpen("comment"); handleAddComment(test._id, test.comments) }}>
                            <ButtonComponent
                              type="button"
                              title={<> <FaPlus className="hidden sm:block" /> <span >Comments</span> </>}
                              className="flex items-center justify-center gap-3 py-0 h-8 text-btn-color bg-transparent border border-btn-color"
                            />
                          </div>
                        </div>
                      </div>

                      {test && test?.test?.map((value, index) => (
                        <>
                          <hr />
                          <div className={`${value?.testFieldType === "single field" ? 'flex justify-between items-center' : ""} px-4 py-2 space-y-2 `} key={index}>
                            {
                              value && value?.testFieldType === "single field" ? <p className="font-normal sm:w-1/3 text-md">{value?.name}</p> :
                                (
                                  value && value?.testFieldType === "multiple field" && value?.subTest?.length > 0 ? (
                                    <p className="  font-normal w-1/3 text-md">{value?.name}</p>
                                  ) : ""
                                )
                            }
                            {
                              value && value?.subTest?.length > 0 ?
                                (
                                  value?.subTest?.map((subtest, indexvalue) => (
                                    <>
                                      <hr />
                                      <div className="flex justify-center items-center gap-2" key={indexvalue}>
                                        <div className="w-full px-2">
                                          <p className="font-normal text-sm">{subtest?.name}</p>
                                        </div>
                                        {subtest?.field == "custom" ?
                                          <div className="flex w-full gap-3 px-5">
                                            <input type="checkbox" id="observedvalue" />
                                            <SelectBox
                                              disabled={subtest?.formula ? true : false}
                                              placeholder={subtest?.formula ? "calculated value" : "Enter Value"}
                                              // title={subtest.subTestObservedValue}
                                              value={formulaParameters[subtest._id] == 0 ? subtest.observedValue : formulaParameters[subtest._id]}
                                              options={subtest?.options.map((option) => option)}
                                              name="name"
                                              id={subtest._id}
                                              onChange={(e) => { handleSetValue(e, subtest?._id); }}
                                            />
                                          </div>
                                          : <div className="flex gap-3 w-full px-5">
                                            <input type="checkbox" id="observedvalue" />
                                            <InputField
                                              disabled={subtest?.formula ? true : false}
                                              placeholder={subtest?.formula ? "calculated " : "Enter Value"}
                                              type="number"
                                              name="name"
                                              className="h-6"
                                              isSearch={false}
                                              defaultValue={formulaParameters[subtest?._id] == 0 ? subtest.observedValue : formulaParameters[subtest?._id]}
                                              onChange={(e) => { handleSetValue(e, subtest?._id); }}
                                            />
                                          </div>
                                        }
                                        <div className="w-full flex justify-center items-center">
                                          <p className="font-normal">{subtest?.field == "custom" ? '' : subtest?.unit}</p>
                                        </div>

                                        <div className="flex justify-end items-center px-5 w-full">
                                          <p className="font-normal">{subtest?.field == "custom" ? '' : `${subtest?.max ? subtest?.max : ''} - ${subtest?.min ? subtest?.min : ''}`}</p>
                                        </div>
                                      </div>
                                    </>
                                  ))
                                )
                                :
                                (
                                  value && value.testFieldType == "single field" ? (
                                    <div className="flex justify-center items-center gap-2 w-full">
                                      {value?.field == "custom" ?
                                        <div className="flex w-full gap-3 px-5">
                                          <input type="checkbox" id="observedvalue" />
                                          <SelectBox
                                            disabled={value?.formula ? true : false}
                                            placeholder={value?.formula ? "calculated value" : "Enter Value"}
                                            value={formulaParameters[value._id] == 0 ? value.observedValue : formulaParameters[value._id]}
                                            options={value?.options.map((option) => option)}
                                            name="observedvalue"
                                            // title={value?.observedValue}
                                            id={value._id}
                                            onChange={(e) => { handleSetValue(e, value?._id); }}
                                          />
                                        </div>
                                        :


                                        <div className="flex w-full gap-3 px-5">
                                          <input type="checkbox" id="observedvalue" />
                                          <InputField
                                            disabled={value?.formula ? true : false}
                                            placeholder={value?.formula ? "calculated value" : "Enter Value"}
                                            type="number"
                                            className="h-6"
                                            id={value._id}
                                            isSearch={false}
                                            name="observedvalue"
                                            defaultValue={formulaParameters[value._id] == 0 ? value.observedValue : formulaParameters[value._id]}
                                            onChange={(e) => { handleSetValue(e, value?._id); }}
                                          />
                                        </div>
                                      }

                                      <div className="w-full flex justify-center">
                                        <p className="font-normal">{value?.field == "custom" ? '' : value?.unit ? value?.unit : "-"}</p>
                                      </div>
                                      <div className="w-full flex justify-end px-4">
                                        <p className="font-normal">{value?.field == "custom" ? '' : `${value?.max ? value?.max : ''} - ${value?.min ? value?.min : ''}`}</p>
                                      </div>

                                    </div>
                                  ) : ""
                                )
                            }
                          </div>
                        </>
                      ))}

                    </div>
                  ) : "";
                })
              )
            }
          </form>
        </div>

        <div className={`${roleManageData?.enterVerify ? "lg:hidden" : "hidden"} sm:flex justify-between py-4 space-y-3 sm:space-y-0`}>
          <div className="sm:flex gap-4 space-y-3 sm:space-y-0 ">
            <div onClick={() => handleOpen("reportnote")}>
              <ButtonComponent
                title={<> <FaPlus /> Note on Report </>}
                className="text-white flex items-center gap-2 w-32"
              />
            </div>

            <div onClick={() => handleOpen("issueTechnician")}>
              <ButtonComponent
                title={<> <FaPlus /> Add Issue for technician</>}
                className="flex items-center gap-2 w-32 border border-btn-color bg-transparent text-btn-color hover:bg-btn-color hover:text-white"
              />
            </div>
          </div>

          <div onClick={() => { approvePatient(); }}>
            <ButtonComponent
              title={<><FaPlus /> Approve & Print</>}
              className="text-white flex items-center gap-2 w-32"
            />

          </div>
        </div>
      </div >

      {/* Report pdf  modal */}

      <Dialog
        open={size === "lg"}
        size={size || "lg"}
        handler={handleBillpdfOpen}
        className="rounded-none font-regular"
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
          {id && <ReportFormate userId={id.id} handleBillpdfOpen={handleBillpdfOpen} className="overflow-y-scroll" />}
        </DialogBody>
      </Dialog>


      {comment && (
        <div>
          <Dialog
            open={open === "comment"}
            handler={handleOpen}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
            className="rounded-none font-regular"
          >
            <DialogHeader className="flex justify-between py-1 items-center">
              <div className="">
                <p className="text-[18px]">Comment</p>
              </div>
              <div className='mb-0 flex justify-center items-center '>
                <HiMiniXMark
                  onClick={() => handleOpen(null)}
                  className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
                />
              </div>
            </DialogHeader>
            <hr />
            <form onSubmit={handleSubmitComment(onSubmitComment)}>
              <DialogBody>
                <div className="sm:flex justify-between space-y-4 sm:space-y-0">
                  <div>
                    <SelectBox options={comment && comment?.comment?.map((comment) => {
                      return { value: comment.comment, label: comment.comment };
                    })}
                      className="w-36 font-regular font-normal text-sm"
                      {...registerComment("comment")}
                    />
                  </div>

                  <div>
                    <ButtonComponent
                      type="button"
                      title={<><FaPlus /> Add Comments</>}
                      className="flex items-center gap-2 py-0 text-white font-medium font-regular bg-btn-color h-8"
                      onClick={() => { navigate('/dashboard/test/list/addtest', { state: comment?.testid }) }}
                    />
                  </div>
                </div>
                <div className="flex justify-between py-5 font-medium bg-gray-100 mt-4 px-4">
                  <div className="w-full font-regular">Comment</div>
                  <div className="w-[1px] bg-gray-300 "></div>
                  <div className="mx-5 w-full font-regular">Action</div>
                </div>
              </DialogBody>
              <DialogFooter>
                <div >
                  <ButtonComponent
                    type="submit"
                    title={<>Confirm</>}
                    className="flex items-center gap-2 py-0 text-white font-medium bg-btn-color h-8"
                  />
                </div>
              </DialogFooter>
            </form>
          </Dialog>

        </div>

      )}


      <Dialog
        open={open === "reportnote"}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none font-regular"
      >
        <DialogHeader className="flex justify-between py-1">
          <div>
            <p className="text-[18px]">Note On Report</p>
          </div>
          <div className='mb-0 flex justify-center items-center '>
            <HiMiniXMark
              onClick={handleCloseModal}
              className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
            />
          </div>
        </DialogHeader>
        <hr />
        <form onSubmit={handleSubmitNote(onSubmitNote)}>
          <DialogBody>
            <div className="flex">
              <label htmlFor="Note" className="font-normal flex items-center px-2"><span className="text-red-500">*</span> Note: </label>
              <textarea placeholder="Note" name="Note" id="Note" rows="2" className="border-2 border-gray-200 px-2 w-full" {...registerNote("note")}></textarea>
            </div>

          </DialogBody>
          <DialogFooter>
            <ButtonComponent
              title="Save"
              className="flex items-center gap-2 py-0 text-white font-medium bg-btn-color h-8"
            />
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog
        open={open === "issueTechnician"}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="rounded-none font-regular"
      >
        <DialogHeader className="flex justify-between py-1">
          <div> <p className="text-[18px]">Issue for technician</p> </div>
          <div className='mb-0 flex justify-center items-center '>
            <HiMiniXMark
              onClick={handleCloseModal}
              className="mr-1 text-md text-gray-400 mb-0 hover:bg-gray-100 hover:text-black hover:rounded"
            />
          </div>
        </DialogHeader>
        <hr />

        <form onSubmit={handleSubmitIssue(onSubmitIssue)}>
          <DialogBody>
            <div className="flex">
              <label htmlFor="Issue" className="font-normal flex items-center px-2"><span className="text-red-500">*</span> Issue: </label>
              <textarea placeholder="Enter Issue" name="issue" id="Issue" rows="2" className="border border-gray-300 px-2 w-full"
                {...registerIssue("issue", { required: "Issue is required" })}
              ></textarea>
            </div>
            {errorsIssue.issue && <p className="text-red-500">{errorsIssue.issue.message}</p>}
          </DialogBody>
          <DialogFooter>
            <ButtonComponent
              title="Save"
              type="submit"
              className="flex items-center gap-2 py-0 text-white font-medium bg-btn-color h-8"
            />
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}

export default DoctorReport;