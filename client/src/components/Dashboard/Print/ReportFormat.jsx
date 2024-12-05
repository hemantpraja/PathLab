import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { useGetOnePatientMutation } from "../../../redux/services/adminApi.service";
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service";
import { ButtonComponent } from "../..";
import { useGetDocterDetailsMutation } from '../../../redux/services/labApi.service';
import phone from '../../../assets/phoneIcon.svg'
import phoneIconWhite from '../../../assets/phoneIconWhite.svg'
import addressIcon from '../../../assets/addressIcon.svg'
import email from '../../../assets/emailIcon.svg'
import './PrintStyle.css';

function ReportFormate({ userId, handleBillpdfOpen }) {

  const admin = useSelector(state => state.admin);
  const navigate = useNavigate();
  const [getOnePatient] = useGetOnePatientMutation();
  const [getAdminDetails] = useGetAdminDetailsMutation();
  const [getDocterDetails] = useGetDocterDetailsMutation();
  const [docterData, setDocterData] = useState([]);
  const conponentPDF = useRef();
  const [adminDetails, setAdminDetails] = useState({});
  const [patientDetails, setPatientDetails] = useState({});
  const [patient, setPatient] = useState({});
  // const [breakPage, setBreakPage] = useState(false);

  const fetchData = async () => {

    const response = await getOnePatient({ id: admin.admin.id, _id: userId });

    setPatientDetails(response.data.data);
    const patientData = response.data.data?.patient;

    const data = patientData?.testDetails.length > 0 && patientData?.testDetails.map(testDetail => {
      const addedObservedValue = testDetail?.test.map(test => {
        const updatedTest = { ...test, subTest: [...test.subTest] };

        testDetail?.testObserved.forEach(observed => {
          if (observed.subTestId) {
            const subTestIndex = updatedTest.subTest.findIndex(sub => sub._id === observed.subTestId);
            if (subTestIndex !== -1) {
              updatedTest.subTest[subTestIndex] = { ...updatedTest.subTest[subTestIndex], subTestObservedValue: observed.testObservedValue };
            }
          } else if (test._id === observed.testObservedId) {
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

  }

  const fetchDocterData = async () => {
    const response = await getDocterDetails({ id: admin.admin.id })
    if (response.data.success) {
      setDocterData(response.data.data)
    }
  }

  const fetchAdminDetails = async () => {

    const response = await getAdminDetails({ email: admin.admin.email });
    if (response.data.success) {
      console.log("response data", response.data.data)

      setAdminDetails(response.data.data);
    }
  }

  useEffect(() => {
    fetchDocterData();
    fetchData();
    fetchAdminDetails();
  }, [admin.admin.id]);

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
  },);

  const handlePrint = () => {
    // document.getElementById("report").classList.remove("hidden");
    generatePDF();
    handleBillpdfOpen(null)
  }

  // const divconst = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  //  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  // console.log("first : ", patientDetails)

  // let heightValue = 0;
  // let breakPagevalue = false;

  // const handlePageBreak = (height) => {
  //   heightValue += height;
  //   if (heightValue > 1000) {
  //     // breakPagevalue = true
  //   }
  //   else {
  //     breakPagevalue = false
  //   }

  // }

  return (
    <React.Fragment>
      {
        adminDetails ?
          <div className="container overflow-auto">
            <div className="row">
              <div className="col-md-12">
                <div ref={conponentPDF} className="w-full">
                  <div className={`${patient.footerStatus ? "block " : "hidden"}`}>
                    {adminDetails?.reportheader ? <div className="py-3 w-full h-40">
                      <img src={adminDetails?.reportheader} className="w-full h-full" alt="image" />
                    </div> :
                        <header class="bg-white px-10 my-4">
                          <div class="container mx-auto flex justify-between items-center mb-0 ">
                            <div class="flex items-start justify-start space-x-4">
                              <img src="https://imgs.search.brave.com/1HuDgPYVLW1QNtDw1B1tc50fEsX08EkddQ0vHxd28DQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzA2LzI0Lzkw/LzM2MF9GXzgwNjI0/OTAyMl92bllla3kx/WU56UWl6YlNXYVBD/eTc4UTVJRnBrTVo3/VS5qcGc" alt="Logo" class="h-16 w-16" />
                              <div >
                                <h1 class="text-2xl font-regular font-bold text-btn-color mb-0">{adminDetails?.labName}</h1>
                                <p class="text-gray-600 font-medium font-regular mb-0">Accurate | Caring | Instant</p>
                              </div>
                            </div>
                            <div class="text-right ">
                              <div class="flex items-center space-x-2 justify-end  ">
                                <img src={phone} className="h-5 w-5" alt="" />
                                {/* <svg fill="#336cc7"  class="h-4 w-4" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 473.81 473.81" xml:space="preserve" transform="rotate(45)" stroke="#336cc7" stroke-width="0.0047380600000000005"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.947612"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4 c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8 c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6 c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5 c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26 c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9 c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806 C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20 c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6 c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1 c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3 c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5 c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8 c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9 l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1 C420.456,377.706,420.456,388.206,410.256,398.806z"></path> <path d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2 c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11 S248.656,111.506,256.056,112.706z"></path> <path d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11 c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2 c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"></path> </g> </g> </g></svg> */}
                                <p class="text-gray-700 font-medium font-regular mb-0">+91 {adminDetails?.phone}</p>
                              </div>
                              <div class="flex items-center space-x-2 justify-end">
                                <img src={email} className="h-5 w-5" alt="" />
                                {/* <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M2 5c0-1.104.896-2 2-2h16c1.104 0 2 .896 2 2v14c0 1.104-.896 2-2 2H4c-1.104 0-2-.896-2-2V5zm6 0h2v2H8V5zm0 4h2v2H8V9zm0 4h2v2H8v-2zm4 0h6v6h-6v-6zm-4 4h2v2H8v-2zm0-4h2v2H8v-2zm0-4h2v2H8V9zm4-4h6v6h-6V5z" /></svg> */}
                                <p class="text-gray-700 font-medium font-regular mb-0">{adminDetails?.email}</p>
                              </div>
                            </div>
                          </div>
                          <div class="container mx-auto  flex justify-between items-center text-gray-700 font-medium font-regular mb-0">
                            <p className="mb-0">{adminDetails?.address}</p>
                            <p class="text-btn-color font-medium font-regular mb-0"><a href="http://www.drlogy.com">{adminDetails?.website}</a></p>
                          </div>
                          <div className="h-[1px] w-full bg-gray-500 my-2"></div>
                        </header>
                    }
                  </div>

                  <div className="px-10 mx-auto ">
                    {/* <div className={`${patient.footerStatus ? "block " : "hidden"}`}> */}
                    <div className="border border-gray-400 p-3 mb-4 flex justify-between">
                      <div className="space-y-0 mb-0">
                        <p className="mb-0"><span className="font-medium w-24 inline-block text-sm ">Name</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.firstName} {patientDetails?.patient?.lastName}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Age/Gender</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.age} Years/{patientDetails?.patient?.gender}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Referred&nbsp;By </span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.organisation?.referralName}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Phone&nbsp;No.</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.phone}</span></p>
                      </div>

                      <div className="space-y-0 mb-0">
                        <p className="mb-0"><span className="font-medium w-24 inline-block text-sm ">Patient&nbsp;ID </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?._id}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Report&nbsp;ID </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">RE5</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Collection&nbsp;Date </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.registrationDate}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Report&nbsp;Date</span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.registrationDate}</span></p>
                      </div>

                      <div className="bg-gray-50 w-24"></div>
                    </div>
                    {patient && patient?.testDetails?.map(test => {
                      return <div className="mt-3">
                        <div>
                          <p className="text-md font-semibold font-regular mb-0 text-center">{test?.testName}</p>
                        </div>
                        <table className="min-w-full border-collapse mb-3">
                          <thead className="bg-slate-100">
                            <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-medium font-regular">Test Description</th>
                            <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-medium font-regular">Result</th>
                            <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-medium font-regular">Flag</th>
                            <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-medium font-regular">Ref. Range</th>
                            <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-medium font-regular">Unit</th>
                          </thead>
                          <tbody>
                            {test?.test?.map(subtest => {
                              return (
                                <>
                                  <tr className="w-full">
                                    <td className="px-2 py-[1px] text-start font-regular font-normal text-sm w-4/10">{subtest?.observedValue || subtest.testFieldType == "multiple field" ? subtest?.name : ' '}</td>
                                    <td className={`font-regular ${subtest?.observedValue < subtest?.min ? 'font-bold' : subtest?.observedValue > subtest?.max ? 'font-bold' : 'font-normal'} px-2 py-[1px] text-start text-sm w-1/10 `}>{subtest?.observedValue == 0 ? '' : subtest?.observedValue}</td>
                                    <td className={`px-2 py-[1px] text-start font-regular font-normal text-sm w-1/10 ${subtest?.observedValue == 0 ? '' : subtest?.observedValue && subtest?.observedValue < subtest?.min ? 'text-red-500' : subtest?.observedValue > subtest?.max ? 'text-red-500' : ''}`}>
                                      {subtest?.observedValue == 0 ? '' : subtest?.observedValue && subtest?.observedValue < subtest?.min ? <span className="font-bold">L</span> : subtest?.observedValue && subtest?.observedValue > subtest?.max ? <span className="font-bold">H</span> : ''}
                                    </td>
                                    <td className="px-2 py-[1px] text-start font-regular font-normal text-sm w-2/10">
                                      {subtest?.observedValue ? subtest.field == "numeric" ? `${subtest?.min} - ${subtest?.max}`
                                        : subtest.field == "numeric unbound" ? `${subtest?.numericUnboundType} - ${subtest?.numericUnboundValue}`
                                          : subtest.field == "multiple ranges" ? `${subtest?.textrange}` :
                                            subtest.field == "text" ? `${subtest?.textrange ? subtest?.textrange : ''}` : subtest?.field == "custom" ? ''
                                              // `${subtest?.options.map((option) => option.value).join(" , ")}`
                                              : '' : ''}
                                    </td>
                                    <td className="px-2 py-[1px] text-start font-regular font-normal text-sm w-2/10">{subtest?.observedValue ? subtest?.unit : ''}</td>
                                  </tr>
                                  {subtest?.subTest?.map(subtesttest => {
                                    return (
                                      <tr className="w-full">
                                        <td className=" ps-6 py-[2px] text-start font-regular font-normal text-sm w-4/10">{subtesttest?.subTestObservedValue ? subtesttest?.name : ""}</td>
                                        <td className={`px-2 py-[2px] font-regular ${subtesttest?.subTestObservedValue < subtesttest?.min ? 'font-bold' : subtesttest?.subTestObservedValue > subtesttest?.max ? 'font-bold' : 'font-normal'} px-2 text-start  text-sm w-1/10 `}>{subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue}</td>
                                        <td className={`px-2 py-[2px] text-start font-regular font-normal text-sm w-1/10 ${subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue && subtesttest?.subTestObservedValue < subtesttest?.min ? 'text-red-500' : subtesttest?.subTestObservedValue > subtesttest?.max ? 'text-red-500' : ''}`}>
                                          {subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue && subtesttest?.subTestObservedValue < subtesttest?.min ? <span className="font-bold">L</span> : subtesttest?.subTestObservedValue > subtesttest?.max ? <span className="font-bold">H</span> : ''}
                                        </td>
                                        <td className="px-2 py-[2px] text-start font-regular font-normal text-sm w-2/10">{subtesttest?.subTestObservedValue ?
                                          subtesttest.field == "numeric" ? `${subtesttest?.min} - ${subtesttest?.max}` :
                                            subtesttest.field == "numeric unbound" ? `${subtesttest?.numericUnboundType} - ${subtesttest?.numericUnboundValue}` :
                                              subtesttest.field == "multiple ranges" ? `${subtesttest?.textrange}` :
                                                subtesttest.field == "text" ? `${subtesttest?.textrange ? subtesttest?.textrange : ''}` : subtesttest?.field == "custom" ? ''
                                                  //  `${subtesttest?.options.map((option) => option.value).join(" , ")}`
                                                  : '' : ''}</td>
                                        <td className="px-2 text-start font-regular font-normal text-sm w-2/10">{subtesttest?.field == "custom" ? '' : subtesttest?.subTestObservedValue ? subtesttest?.unit : ''}</td>
                                      </tr>
                                    );
                                  })}
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                        <div>
                          <p className="text-sm ">{patient?.test?.map(Comment => {
                            return <p className="font-regular font-normal text-sm text-gray-500 ">{Comment?.testId === test?.testId ? Comment?.comment : ""}</p>
                          })}</p>
                        </div>
                        <hr />
                      </div>
                    })}
                    <div>
                      <p className={`text-sm font-semibold text-btn-color font-regular ${patient?.note ? "block" : "hidden"}`}>Note : <span className="text-xs font-normal">{patient?.note}</span></p>
                      <p className={`text-sm text-red-600 font-semibold font-regular ${patient?.note ? "block" : "hidden"}`}>Issue : <span className="text-xs font-normal">{patient?.issue}</span></p>
                    </div>
                  </div>
                  <div className={`${patient.footerStatus ? "block " : "hidden"}`}>
                    <div className={`flex items-end ${docterData.length > 1 ? "justify-between" : "justify-end"} pt-32 px-8 `}>
                      {
                        docterData.map((doctor, index) => (
                          <div className="flex flex-col justify-center items-center py-3 space-y-3" key={index}>
                            <div className="h-6 w-20 flex justify-center items-center">
                              <img src={doctor?.signature} alt="" />
                            </div>
                            <div className="py-1">
                              <p className="mb-0 py-0 text-sm font-medium text-center">{doctor?.docterName}</p>
                              <p className="mb-0 text-sm font-medium text-center">{doctor?.degree} </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="" >
                      {adminDetails?.reportfooter ?
                        <img src={adminDetails?.reportfooter} className="h-16 w-full " alt="image" />
                        : <footer class="text-white bg-btn-color py-2 h-10">
                          <div class="px-5 flex justify-between items-end">
                            <div class="text-left text-sm flex items-center gap-1">
                              <img src={addressIcon} className="h-5 w-5" alt="Phone Icon" />
                              <span className="text-white text-xs font-regular font-normal ">{adminDetails?.address}</span>
                            </div>
                            <div class="flex items-center gap-1">
                              <img src={phoneIconWhite} className="h-5 w-5" alt="Phone Icon" />
                              <span class="text-xs text-white font-regular font-normal">+91 {adminDetails?.phone}</span>
                            </div>
                          </div>
                        </footer>
                      }
                    </div>
                  </div>
                </div>

                {/* ----------Print report Start--------- */}
                {/* <div ref={conponentPDF} className="w-full hidden" style={{ 'width': '794px', 'height': '1100px' }} id="report"> */}
                {/* <div className="w-full hidden" style={{ 'width': '794px', 'height': '1100px' }} id="report"> */}
                {/* Header section */}
                {/* <div className={`${patient.footerStatus ? "block py-2" : "hidden"}`}>
                    {adminDetails?.reportheader ?
                      <div className="py-3 w-full h-40 print:fixed print:top-0">
                        <img src={adminDetails?.reportheader} className="w-full h-full" alt="image" />
                      </div> :
                      <header class="bg-white px-10 my-4 header print:fixed print:top-0">
                        <div class="container mx-auto flex justify-between items-center mb-0 ">
                          <div class="flex items-start justify-start space-x-4">
                            <img src="https://imgs.search.brave.com/1HuDgPYVLW1QNtDw1B1tc50fEsX08EkddQ0vHxd28DQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzA2LzI0Lzkw/LzM2MF9GXzgwNjI0/OTAyMl92bllla3kx/WU56UWl6YlNXYVBD/eTc4UTVJRnBrTVo3/VS5qcGc" alt="Logo" class="h-16 w-16" />
                            <div >
                              <h1 class="text-2xl font-regular font-bold text-btn-color mb-0">PATHOLOGY LAB</h1>
                              <p class="text-gray-600 font-medium font-regular mb-0">Accurate | Caring | Instant</p>
                            </div>
                          </div>
                          <div class="text-right ">
                            <div class="flex items-center space-x-2 justify-end  ">
                              <img src={phone} className="h-5 w-5" alt="" />
                              <p class="text-gray-700 font-medium font-regular mb-0">0912345678</p>
                            </div>
                            <div class="flex items-center space-x-2 justify-end">
                              <img src={email} className="h-5 w-5" alt="" />
                              <p class="text-gray-700 font-medium font-regular mb-0">drlogypathlab@drlogy.com</p>
                            </div>
                          </div>
                        </div>
                        <div class="container mx-auto  flex justify-between items-center text-gray-700 font-medium font-regular mb-0">
                          <p className="mb-0">105-108, Healthcare Road, Mumbai - 689578</p>
                          <p class="text-btn-color font-medium font-regular mb-0"><a href="http://www.drlogy.com">www.drlogy.com</a></p>
                        </div>
                        <div className="h-[1px] w-full bg-gray-500 my-2"></div>
                      </header>
                    }
                  </div> */}
                {/* Header section */}

                {/* content section */}
                {/* <div className="px-10 mx-auto content pt-96 pb-28 print:h-[500px`]"> */}
                {/* <div className="px-10 mx-auto content pt-96 pb-28 print:h-[500px]">
                    <div className="border border-gray-400 p-3 mb-4 flex justify-between">
                      <div className="space-y-0 mb-0">
                        <p className="mb-0"><span className="font-medium w-24 inline-block text-sm ">Name</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.firstName} {patientDetails?.patient?.lastName}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Age/Gender</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.age} Years/{patientDetails?.patient?.gender}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Referred&nbsp;By </span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.organisation?.referralName}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Phone&nbsp;No.</span><span className="">:
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.phone}</span></p>
                      </div>

                      <div className="space-y-0 mb-0">
                        <p className="mb-0"><span className="font-medium w-24 inline-block text-sm ">Patient&nbsp;ID </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?._id}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Report&nbsp;ID </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">RE5</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Collection&nbsp;Date </span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.registrationDate}</span></p>
                        <p className=""><span className="font-medium w-24 inline-block text-sm ">Report&nbsp;Date</span><span className=""> :
                        </span><span className="px-2 text-sm font-medium">{patientDetails?.patient?.registrationDate}</span></p>
                      </div>

                      <div className="bg-gray-50 w-24"></div>
                    </div>

                    {patient && patient?.testDetails?.map((test, indexvalue) => {



                      return (
                        <>
                          <div className={`${breakPagevalue ? "page-break mt-[160px]" : "py-4"}`}>
                            <span className="hidden">{handlePageBreak(20)}</span>
                            <p className="text-sm uppercase font-bold text-center ">{test?.testName}</p>
                          </div>
                          <table className="min-w-full border-collapse mb-3">
                            <span className="hidden">{handlePageBreak(30)}</span>:
                            <thead className={`bg-gray-100 ${breakPagevalue ? "page-break mt-[160px]" : "py-4"}`}>
                              <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-semibold font-sans">TEST DESCRIPTION</th>
                              <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-semibold font-sans">RESULT</th>
                              <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-semibold font-sans">FLAG</th>
                              <th className="border-t border-b border-gray-300 px-2 py-1 text-sm text-start font-semibold font-sans">REF. RANGE</th>
                              <th className="border-t border-b border-gray-300 px-2 py-1 te xt-sm text-start font-semibold font-sans">UNIT</th>
                            </thead>
                            <tbody>
                              {test?.test?.map(subtest => {
                                return (
                                  <>
                                    <>
                                      <span className="hidden">{handlePageBreak(50)}</span>
                                      <tr className={`${breakPagevalue ? "page-break mt-[160px]" : "py-4"}`}>
                                        <td className="px-2 py-1 text-start font-semibold text-xs w-4/10">{subtest?.observedValue ? subtest?.name : ' '}</td>
                                        <td className={`${subtest?.observedValue < subtest?.min ? 'font-bold' : subtest?.observedValue > subtest?.max ? 'font-bold' : 'font-semibold'} px-2 py-1 text-start text-xs w-1/10 `}>{subtest?.observedValue == 0 ? '' : subtest?.observedValue}</td>
                                        <td className={`px-2 py-1 text-start font-semibold text-xs w-1/10 ${subtest?.observedValue == 0 ? '' : subtest?.observedValue && subtest?.observedValue < subtest?.min ? 'text-red-500' : subtest?.observedValue > subtest?.max ? 'text-red-500' : ''}`}>
                                          {subtest?.observedValue == 0 ? '' : subtest?.observedValue && subtest?.observedValue < subtest?.min ? <span className="font-bold">L</span> : subtest?.observedValue && subtest?.observedValue > subtest?.max ? <span className="font-bold">H</span> : ''}
                                        </td>
                                        <td className="px-2 py-1 text-start font-semibold text-xs w-2/10">
                                          {subtest?.observedValue ? subtest.field == "numeric" ? `${subtest?.min} - ${subtest?.max}`
                                            : subtest.field == "numeric unbound" ? `${subtest?.numericUnboundType} - ${subtest?.numericUnboundValue}`
                                              : subtest.field == "multiple ranges" ? `${subtest?.textrange}` :
                                                subtest.field == "text" ? `${subtest?.textrange ? subtest?.textrange : ''}` : subtest?.field == "custom" ? ''
                                                  : '' : ''}
                                        </td>
                                        <td className="px-2 py-1 text-start font-semibold text-xs w-2/10">{subtest?.observedValue ? subtest?.unit : ''}</td>
                                      </tr>
                                    </>
                                    {subtest?.subTest?.map(subtesttest => {
                                      return (
                                        <>
                                          <tr className={`w-full ${breakPagevalue ? "page-break mt-[160px]" : "py-4"}`}>
                                            <span className="hidden">{handlePageBreak(50)}</span>:
                                            <td className="px-2 py-1 text-start font-semibold text-xs w-4/10">{subtesttest?.subTestObservedValue ? subtesttest?.name : ""}</td>
                                            <td className={`${subtesttest?.subTestObservedValue < subtesttest?.min ? 'font-bold' : subtesttest?.subTestObservedValue > subtesttest?.max ? 'font-bold' : 'font-semibold'} px-2 py-1 text-start text-xs w-1/10 `}>{subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue}</td>
                                            <td className={`px-2 py-1 text-start font-semibold text-xs w-1/10 ${subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue && subtesttest?.subTestObservedValue < subtesttest?.min ? 'text-red-500' : subtesttest?.subTestObservedValue > subtesttest?.max ? 'text-red-500' : ''}`}>
                                              {subtesttest?.subTestObservedValue == 0 ? '' : subtesttest?.subTestObservedValue && subtesttest?.subTestObservedValue < subtesttest?.min ? <span className="font-bold">L</span> : subtesttest?.subTestObservedValue && subtesttest?.subTestObservedValue > subtesttest?.max ? <span className="font-bold">H</span> : ''}
                                            </td>
                                            <td className="px-2 py-1 text-start font-semibold text-xs w-2/10">{subtesttest?.subTestObservedValue ?
                                              subtesttest.field == "numeric" ? `${subtesttest?.min} - ${subtesttest?.max}` :
                                                subtesttest.field == "numeric unbound" ? `${subtesttest?.numericUnboundType} - ${subtesttest?.numericUnboundValue}` :
                                                  subtesttest.field == "multiple ranges" ? `${subtesttest?.textrange}` :
                                                    subtesttest.field == "text" ? `${subtesttest?.textrange ? subtesttest?.textrange : ''}` : subtesttest?.field == "custom" ? ''
                                                      : '' : ''}</td>
                                            <td className="px-2 py-1 text-start font-semibold text-xs w-2/10">{subtesttest?.field == "custom" ? '' : subtesttest?.subTestObservedValue ? subtesttest?.unit : ''}</td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              })}
                            </tbody>
                          </table>
                          <div>
                            <p className="text-sm ">{patient?.test?.map(Comment => {
                              return <p>{Comment?.testId === test?.testId ? Comment?.comment : ""}</p>
                            })}</p>
                          </div>
                          <hr />
                        </>
                      );
                    })}

                    <div className={`flex items-end   ${docterData.length > 1 ? "justify-between" : "justify-end"} pt-32 px-8 `}>
                      {
                        docterData.map((doctor, index) => (
                          <div className="flex flex-col justify-center items-center py-3 space-y-3" key={index}>
                            <div className="h-6 w-20 flex justify-center items-center">
                              <img src={doctor?.signature} alt="" />
                            </div>
                            <div>
                              <p className="mb-[3px] text-sm font-medium text-center">{doctor?.docterName}</p>
                              <p className="mb-0 text-sm font-medium text-center">{doctor?.degree} </p>
                            </div>
                          </div>

                        ))
                      }
                    </div>
                  </div> */}
                {/* content section */}

                {/* Footer section */}
                {/* <div className={`footer print:fixed print:bottom-0 ${patient.footerStatus ? "block " : "hidden"}`}>
                    {adminDetails?.reportfooter ?
                      <img src={adminDetails?.reportfooter} className="h-16 w-full " alt="image" />
                      : <footer class="text-white bg-btn-color py-2">
                        <div class="px-5 flex justify-between items-end">
                          <div class="text-left text-sm flex items-center gap-1">
                            <img src={addressIcon} className="h-5 w-5" alt="Phone Icon" />
                            <span className="text-white text-xs font-regular font-normal ">Address: 123 Lab Pathology Street, City, Country</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <img src={phoneIconWhite} className="h-5 w-5" alt="Phone Icon" />
                            <span class="text-xs text-white font-regular font-normal">0123456789</span>
                          </div>
                        </div>
                      </footer>
                    }
                  </div> */}
                {/* Footer section */}
                {/* </div> */}
                {/* ----------Print report End--------- */}

                <div className="flex justify-end px-8 py-5">
                  <div className="flex gap-2">
                    <ButtonComponent title="Send" className="bg-transparent border border-gray-300 text-gray-600 font-medium h-8 flex items-center" />
                    <ButtonComponent title="Print" className="bg-btn-color text-gray-100 font-medium h-8 flex items-center" onClick={handlePrint} />
                  </div>
                </div>
                <div className="d-grid d-md-flex justify-content-md-end mb-3">
                  {/* <button className="p-2 rounded-lg bg-blue-500 text-white px-5 mt-3 hover:bg-blue-600" onClick={generatePDF}>PDF</button> */}
                </div>
              </div>
            </div>
          </div>
          : ""
      }
    </React.Fragment >
  );
}

export default ReportFormate;