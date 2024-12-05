import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { useGetOnePatientMutation } from "../../../redux/services/adminApi.service";
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service";
import { ButtonComponent } from "../..";
import { useNavigate } from "react-router-dom";


function BillFormate({ userId }) {
  const admin = useSelector(state => state.admin);
  const [getOnePatient] = useGetOnePatientMutation();
  const [getAdminDetails] = useGetAdminDetailsMutation();
  const conponentPDF = useRef();
  const [adminDetails, setAdminDetails] = useState({});
  const [patientDetails, setPatientDetails] = useState({});
  const [testData, setTestData] = useState([])
  const navigate = useNavigate();

  const fetchData = async () => {

    const adminDetails = await getAdminDetails({ email: admin.admin.email });
    const response = await getOnePatient({ id: admin.admin.id, _id: userId.patientId });
    setAdminDetails(adminDetails.data.data);
    setPatientDetails(response.data.data);

    const packageDataMap = new Map(
      response?.data?.data?.patient?.packageData.flatMap(pkg =>
        pkg.test.map(test => [
          test.testId,
          { testName: pkg.packageName, testPrice: pkg.totalAmount }
        ])
      )
    );

    const combinedData = response?.data?.data?.patient?.testDetails.map(test => {
      const packageData = packageDataMap.get(test.testId);
      if (packageData) {
        return {
          testId: test.testId,
          testName: packageData.testName,
          testPrice: packageData.testPrice
        };
      } else {
        return {
          testId: test.testId,
          testName: test.testName,
          testPrice: test.testPrice
        };
      }
    });

    const uniquePackages = new Map();
    combinedData.forEach(item => {
      uniquePackages.set(item.testName, item.testPrice);
    });
    
    // Convert the map to the desired format
    const finalData = Array.from(uniquePackages, ([testName, testPrice]) => ({
      testName,
      testPrice
    }));

    console.log(finalData);

    setTestData(finalData)
  }

  useEffect(() => {
    fetchData();
  }, [admin.admin.id]);

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
  });

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div ref={conponentPDF} style={{ width: '100%' }}>
              <div className="container mx-auto px-4  mb-5">
                <div className="flex justify-between items-end mb ">
                  <div className="invoice ">
                    <h4 className="font-bold text-lg mb-0 font-regular">{adminDetails?.labName}</h4>
                    <p className="text-xs text-gray-800 font-normal font-regular w-48">{adminDetails?.address}</p>
                  </div>
                  <div className="invoice ">
                    <div className="text-[12px] text-gray-700 text-end font-normal font-regular">Mob:{adminDetails?.phone}</div>
                    <div className="text-[12px] text-gray-700 text-end font-normal font-regular pb-2">Email : {adminDetails?.email}</div>
                  </div>
                </div>

                <div className="h-[.8px] w-full bg-zinc-500 mb-1"></div>
                <div className="flex justify-between items-end mb-0">
                  <div>
                    <p className={`text-xl font-semibold font-regular text-black text-start mb-0`}><span> </span><span>{adminDetails?.billheading}</span></p>
                  </div>
                  <div className="flex justify-end items-end">
                    <p className={`text-[12px] font-normal font-regular text-gray-800 text-end  mb-0 ${adminDetails.isGstNumber ? "block " : "hidden"}`}><span> GSTIN: </span><span>{adminDetails?.gstnumber}</span></p>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 ">
                  <div className="space-y-1">
                    <p className="text-xs font-normal font-regular text-gray-700 text-start mb-0"><span>BIll ID : </span><span>RE202</span></p>
                    <p className="text-xs font-normal font-regular text-gray-700 text-start"><span>Name : </span><span>{patientDetails?.patient?.firstName} {patientDetails?.patient?.lastName}</span></p>
                    <p className="text-xs font-normal font-regular text-gray-700 text-start"><span>Age/Gender : </span><span>{patientDetails?.patient?.age} {patientDetails?.patient?.ageType}/{patientDetails?.patient?.gender}</span></p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-normal font-regular text-gray-700 text-end mb-0"><span>Bill Date : </span><span>{patientDetails?.patient?.registrationDate}</span></p>
                    <p className="text-xs font-normal font-regular text-gray-700 text-end"><span>Referred By : </span> <span>{patientDetails?.organisation?.referralName || "Self"}</span></p>
                    <p className="text-xs font-normal font-regular text-gray-700 text-end"><span>Payment Type : </span> <span>{patientDetails?.patient?.paymentMethod || "Cash"}</span></p>
                  </div>
                </div>
                <table className="min-w-full border-collapse mb-3 mt-2">
                  <thead className="bg-[#656565] text-white">
                    <th className="p-2 text-xs font-regular text-start"><span className="px-2">#</span>Test Description</th>
                    <th className="p-2 text-xs font-regular text-end">Amount</th>
                  </thead>
                  <tbody>
                    {
                      testData && testData.map((item, index) => (
                        <tr className="border-b border-gray-200">
                          <td colSpan="0" className="p-[6px] text-gray-700 font-regular text-start font-normal text-xs w-7/12"><span className="px-2">{index + 1}.</span>{item?.testName}</td>
                          <td colSpan="" className="p-[6px] text-gray-700 font-regular text-end font-normal text-xs w-4/12">{item?.testPrice}.00</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>

                <div className="flex justify-end ">
                  <div className="space-y-2">
                    <p className="font-semibold font-regular text-xs text-black pe-5 px-2 mb-0">Total </p>
                    <p className="font-semibold font-regular text-xs text-black pe-5 px-2">Discount </p>
                    <p className="font-semibold font-regular text-xs text-black pe-5 px-2">Paid Balance </p>
                    <p className="font-normal font-regular text-xs pe-5 bg-gray-200 p-2">Balance Due </p>
                    <p className="font-normal font-regular text-xs pe-5 px-2">Payment Mode </p>
                    {/* <p className="font-normal text-sm pe-5">Total In Words : </p> */}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold font-regular text-xs text-end justify-between px-2 mb-0">&#x20b9;<del className="pe-2 text-gray-400">{patientDetails?.patient?.test.reduce((acc, curr) => acc + curr.testPrice, 0)}</del>
                      <span className="text-black font-regular font-semibold">{patientDetails?.patient?.totalPayment}.00</span></p>
                    <p className="font-semibold font-regular text-black text-xs text-end px-2">&#x20b9;{patientDetails?.patient?.discountAmount}.00</p>
                    <p className="font-semibold font-regular text-black text-xs text-end px-2">&#x20b9;{patientDetails?.patient?.paidPayment}.00</p>
                    <p className="font-semibold font-regular text-black text-xs text-end bg-gray-200 p-2">&#x20b9;{patientDetails?.patient?.duePayment ? patientDetails?.patient?.duePayment : 0}.00</p>
                    <p className="font-medium font-regular text-xs text-end px-2"><span className="text-green-600">{patientDetails?.patient?.paymentMethod || "Cash"}</span></p>
                  </div>
                </div>
                <div className={`${adminDetails?.signature ? '' : 'hidden'} flex justify-end mt-2`}>
                  <div>
                    <img src={adminDetails?.signature} className="h-20 w-32 " />
                    <p className="text-xs font-normal font-regular text-gray-700 text-end py-1">{adminDetails?.billSignatureName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-8">
              <div onClick={() => navigate(`/dashboard/doctor_report`, { state: { id: userId.patientId } })} >
                <ButtonComponent title="Enter Reading" className={`${userId.readingStatus == true ? 'hidden' : 'bg-transparent border border-gray-300 text-gray-600 font-medium h-8 flex items-center'}`} onClick={() => { navigate(`/dashboard/doctor_report`, { state: { id: patientDetails?.patient?._id } }); }} />
              </div>
              <div className="flex gap-2">
                <ButtonComponent title="Send" className="bg-transparent border border-gray-300 text-gray-600 font-medium h-8 flex items-center" />
                <ButtonComponent title="Print" className="bg-btn-color text-gray-100 font-medium h-8 flex items-center" onClick={generatePDF} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment >
  );
}

export default BillFormate;

