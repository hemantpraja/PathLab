
import React, { useEffect, useState } from "react";
import { ButtonComponent, SelectBox } from "../../index.js";
import { IoMdLogOut } from "react-icons/io";
import { GoXCircle } from "react-icons/go";
import CanvasJSReact from '@canvasjs/react-charts';
import { useAnalysisReportTestMutation, useAnalysisReportOrganisationMutation } from "../../../redux/services/labApi.service";
import { useGetPatientMutation } from "../../../redux/services/adminApi.service.js";
import { useGetUserDetailsMutation, useManageUserLoginMutation } from "../../../redux/services/labApi.service";
// import { SearchDate } from "../../../constants/constants.js";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
import { Table } from 'antd';
import { DatePicker, Space } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
const { RangePicker } = DatePicker;

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, set } from 'date-fns';


const topReferralColumns = [
  {
    title: 'Name',
    dataIndex: 'organization',
    key: 'organization',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'totalTestPrice',
    key: 'totalTestPrice',
  },
];

const topTestColumns = [
  {
    title: 'Name',
    dataIndex: 'testName',
    key: 'testName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Count',
    dataIndex: 'testCount',
    key: 'testCount',
  },
  {
    title: 'Price',
    dataIndex: 'totalTestPrice',
    key: 'totalTestPrice',
  },
];

const loginColumns = [
  {
    title: 'S.No.',
    dataIndex: 'sno',
    key: 'sno',
  },
  {
    title: 'User Name',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Login Status',
    dataIndex: 'loginStatus',
    key: 'loginStatus',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

function Analysis() {

  const [analysisReportTest, { data, isLoading, isSuccess, isError }] = useAnalysisReportTestMutation();
  const admin = useSelector(state => state.admin);

  const [testData, setTestData] = useState([]);
  const [totalTestData, setTotalTestData] = useState([]);

  const [referalData, setReferalData] = useState([]);
  const [totalReferalData, setTotalReferalData] = useState([]);

  const [analysisReportOrganisation] = useAnalysisReportOrganisationMutation();
  const [getUserDetails] = useGetUserDetailsMutation();
  const [manageUserLogin] = useManageUserLoginMutation();

  const [getPatient] = useGetPatientMutation();
  const [patientData, setPatientData] = useState([]);
  const [patientDataDate, setPatientDataDate] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [testDataPoints, setTestDataPoints] = useState([])
  const [loginData, setLoginData] = useState([]);
  const [activeLink, setActiveLink] = useState("income");
  const [patientDataPoint, setPatientDataPoint] = useState([]);

  const [links, setNavlinks] = useState([{
    title: "Income",
    slug: "income",
    active: true,
  },
  {
    title: "Tests",
    slug: "tests",
    active: false,
  }]);


  let testChartData = [];
  let referalChartData = [];

  const handleChange = (dates, dateStrings) => {

    const startDate = new Date(dateStrings[0]);
    startDate.setDate(startDate.getDate() - 1);

    const endDate = new Date(dateStrings[1]);
    endDate.setDate(endDate.getDate() + 1);
    testChartData = [["Test Name", "Total Test Price"]];
    referalChartData = [["Organization Name", "Total Test Price"]];

    const result = patientDataDate.patient.filter((item) => {
      const registrationDate = new Date(item.patient.registrationDate);
      return registrationDate > startDate && registrationDate < endDate;
    });

    const patient = { patient: result }
    setPatientData(patient)
    const result1 = totalTestData.filter((item) => {
      const registrationDate = new Date(item.registrationDate);
      return registrationDate > startDate && registrationDate < endDate;
    });

    const TestTotals = {};

    result1.forEach(report => {
      const uniqueTestNames = new Set();
      report.tests.forEach(test => {

        const { testName, totalTestPrice } = test;

        if (!uniqueTestNames.has(testName)) {
          uniqueTestNames.add(testName);
          if (TestTotals[testName]) {
            TestTotals[testName].totalTestPrice += totalTestPrice;
          } else {
            TestTotals[testName] = {
              testCount: 1, // Each test name is counted once
              totalTestPrice: totalTestPrice,
              testName: testName
            };
          }
        }
      });
    });

    const formattedTestData = Object.values(TestTotals);
    setTestData(formattedTestData);

    const result3 = totalReferalData.analysisReport.filter((item) => {
      const registrationDate = new Date(item.registrationDate);
      return registrationDate > startDate && registrationDate < endDate;
    });

    const organizationRefrralTotals = {};

    result3.forEach(item => {
      item.referralGroups.forEach(group => {
        const { organization, totalTestPrice } = group;
        if (organizationRefrralTotals[organization]) {
          organizationRefrralTotals[organization] += totalTestPrice;
        } else {
          organizationRefrralTotals[organization] = totalTestPrice;
        }
      });
    });

    const formattedrefrrealData = Object.entries(organizationRefrralTotals).map(([organization, totalTestPrice]) => ({
      totalTests: result3.filter(item => item?.referralGroups?.some(group => group.organization === organization)).length,
      totalTestPrice,
      organization
    }));

    formattedTestData.forEach(item => {
      testChartData.push([item.testName, item.totalTestPrice]);
    });

    formattedrefrrealData.forEach(item => {
      referalChartData.push([item.organizationName, item.totalTestPrice]);
    });

    // -----  Chart Drawing Function -----
    const registrationDateMap = {};
    const testLinechartData = [];
    const patientLineChartData = [];

    result?.forEach(entry => {
      const { registrationDate, testDetails } = entry.patient;

      if (!registrationDate) return;
      // console.log("testDetails : ", result)
      const totalTestPrice = testDetails.reduce((sum, test) => sum + (test.testPrice || 0), 0);
      const totalTest = testDetails.length;

      if (registrationDateMap[registrationDate]) {
        registrationDateMap[registrationDate] += totalTestPrice;
      } else {
        registrationDateMap[registrationDate] = totalTestPrice;
      }

      if (testLinechartData.some(data => data.x === registrationDate)) {
        testLinechartData.find(data => data.x === registrationDate).y += totalTest;
      } else {
        testLinechartData.push({ x: registrationDate, y: totalTest });
      }

      if (patientLineChartData.some(data => data.x === registrationDate)) {
        patientLineChartData.find(data => data.x === registrationDate).y += 1;
      } else {
        patientLineChartData.push({ x: registrationDate, y: 1 });
      }
    });


    const newdata = Object.entries(registrationDateMap).map(([date, totalTestPrice]) => {
      return { x: date, y: totalTestPrice };
    });

    const sortedData = newdata.sort((a, b) => new Date(a.x) - new Date(b.x));
    const sortedTestData = testLinechartData.sort((a, b) => new Date(a.x) - new Date(b.x));
    const sortedPatientData = patientLineChartData.sort((a, b) => new Date(a.x) - new Date(b.x));
    setDataPoints(sortedData)
    setTestDataPoints(sortedTestData);
    setPatientDataPoint(sortedPatientData);



    setReferalData(formattedrefrrealData)
    drawChart();
  };


  const fetchUserDetails = async () => {
    const response = await getUserDetails({ id: admin.admin.id });
    if (response.data.success) {

      const userloginData = response.data.data.map((item, index) => ({
        sno: index + 1,
        username: item.userName,
        loginStatus: item.logoutStatus ? "Logout" : "Login",
        role: [
          item.role.reception.isActive && 'reception',
          item.role.doctor.isActive && 'doctor',
          item.role.technician.isActive && 'technician'
        ].filter(Boolean).join(', ') || 'unknown',

        action: item.blockStatus === true ? <div className="flex gap-3" >
          <ButtonComponent
            title={<> <IoMdLogOut className="" />Logout</>}
            className="bg-transparent border h-8 w-20 px-0 flex items-center text-btn-color border-btn-color hover:bg-btn-color hover:text-white"
            onClick={() => logOutUser(item._id)}
          />

          <ButtonComponent
            onClick={() => unblockUser(item._id)}
            title={<><GoXCircle className="mx-1" /> Unblock</>}
            className="bg-transparent border h-8 w-20 px-0 py-0 flex items-center hover:bg-gray-600 hover:text-white"
          />
        </div> : <div className="flex gap-3" >
          <ButtonComponent
            title={<> <IoMdLogOut className="" />Logout</>}
            className="bg-transparent border h-8 w-20 px-0 flex items-center text-btn-color border-btn-color hover:bg-btn-color hover:text-white"
            onClick={() => logOutUser(item._id)}
          />
          <ButtonComponent
            onClick={() => blockUser(item._id)}
            title={<><GoXCircle className="mx-1" /> Block</>}
            className="bg-transparent border h-8 w-20 px-0 py-0 flex items-center hover:bg-gray-600 hover:text-white"
          />
        </div>,
      }));
      setLoginData(userloginData);
    }
  }

  const drawChart = () => {
    let isMounted = true;
    if (!window.google || !window.google.visualization) {
      return;
    }
    const data = window.google.visualization.arrayToDataTable(testChartData);
    const data2 = window.google.visualization.arrayToDataTable(referalChartData);

    const options = {
      // title: "Top Referal",
      pieHole: 0.6,
      slices: {
        0: { color: "#1c82e1" },
        1: { color: "gray" },
        2: { color: "#2B64A5" },
        3: { color: "#E2604C" },
      },
      legend: "none",
      pieSliceText: "none",
      tooltip: { trigger: "focus" },
    };

    if (isMounted) {
      const chart = new window.google.visualization.PieChart(document.getElementById("top-referal"));
      const toptest = new window.google.visualization.PieChart(document.getElementById("top-test"));
      chart.draw(data2, options);
      toptest.draw(data, options);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadGoogleCharts = () => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(() => {
          if (isMounted) {
            drawChart();
          }
        });
      };
      document.body.appendChild(script);
    };

    const transformedTestArray = [["Test Name", "Total Test Price"]];
    const transformedReferalArray = [["Organization Name", "Total Test Price"]];

    const fetchDataAndTransform = async () => {
      try {
        const response = await analysisReportTest({ id: admin.admin.id });
        const analysisReport = response.data.data.analysisReport;
        if (response.data.data.analysisReport.length > 0 && response.data.data.analysisReport[0]?.registrationDate) {
          setTotalTestData(analysisReport)
          const TestTotals = {};
          analysisReport.forEach((report) => {
            const uniqueTestNames = new Set();
            report.tests.forEach(test => {
              const { testName, totalTestPrice } = test;

              if (!uniqueTestNames.has(testName)) {
                uniqueTestNames.add(testName);
                if (TestTotals[testName]) {
                  TestTotals[testName].totalTestPrice += totalTestPrice;
                } else {
                  TestTotals[testName] = {
                    testCount: 1, // Each test name is counted once
                    totalTestPrice: totalTestPrice,
                    testName: testName
                  };
                }
              }
            });
          });

          const formattedTestData = Object.values(TestTotals);
          formattedTestData.sort((a, b) => b.totalTestPrice - a.totalTestPrice);

          const top10Tests = formattedTestData.slice(0, 10);
          setTestData(top10Tests);

          const response2 = await analysisReportOrganisation({ id: admin.admin.id });
          const analysisReport2 = response2.data.data.analysisReport;
          setTotalReferalData(response2.data.data)

          setReferalData(analysisReport2);
          const organizationTotals = {};

          response2.data.data.analysisReport.forEach(item => {
            item.referralGroups.forEach(group => {
              const { organization, totalTestPrice } = group;
              if (organizationTotals[organization]) {
                organizationTotals[organization] += totalTestPrice;
              } else {
                organizationTotals[organization] = totalTestPrice;
              }
            });
          });

          const formattedData = Object.entries(organizationTotals).map(([organization, totalTestPrice]) => ({
            totalTests: response2.data.data.analysisReport.filter(item => item.referralGroups.some(group => group.organization === organization)).length,
            totalTestPrice,
            organization
          }));

          formattedData.sort((a, b) => b.totalTestPrice - a.totalTestPrice);
          const top10Refrral = formattedData.slice(0, 10);
          setReferalData(top10Refrral)

          top10Tests.forEach(item => {
            transformedTestArray.push([item.testName, item.totalTestPrice]);
          });

          top10Refrral.forEach(item => {
            transformedReferalArray.push([item.organizationName, item.totalTestPrice]);
          });
        }

        testChartData = transformedTestArray;
        referalChartData = transformedReferalArray;
        if (isMounted) {
          loadGoogleCharts();
        }
      } catch (error) {
      }
    };

    fetchDataAndTransform();

    // ------------
    const fetchPatient = async () => {
      const response = await getPatient({ id: admin.admin.id });
      if (response.data.success) {
        if (response.data?.data?.patient?.length > 0 && response.data?.data?.patient[0]?.patient?._id) {
          setPatientDataDate(response.data.data)
          setPatientData(response.data.data)
          const registrationDateMap = {};
          const testLinechartData = [];
          const patientLineChartData = [];
          response.data.data?.patient?.forEach(entry => {
            const { patient } = entry;
            const { registrationDate, testDetails } = patient;

            if (!registrationDate) return;

            const totalTestPrice = testDetails.reduce((sum, test) => sum + (test.testPrice || 0), 0);
            const totalTest = testDetails.length;
            if (registrationDateMap[registrationDate]) {
              registrationDateMap[registrationDate] += totalTestPrice;
            } else {
              registrationDateMap[registrationDate] = totalTestPrice;
            }

            testLinechartData.push({ x: registrationDate, y: totalTest });

            if (patientLineChartData.some(data => data.x === registrationDate)) {
              patientLineChartData.find(data => data.x === registrationDate).y += 1;
            } else {
              patientLineChartData.push({ x: registrationDate, y: 1 });
            }

          });

          const newdata = Object.entries(registrationDateMap).map(([date, totalTestPrice]) => {
            return { x: date, y: totalTestPrice };


          });

          const sortedData = newdata.sort((a, b) => new Date(a.x) - new Date(b.x));
          const sortedTestData = testLinechartData.sort((a, b) => new Date(a.x) - new Date(b.x));
          const sortedPatientData = patientLineChartData.sort((a, b) => new Date(a.x) - new Date(b.x));
          setDataPoints(sortedData);
          setTestDataPoints(sortedTestData);
          console.log("sortedPatientData : ", sortedPatientData)
          setPatientDataPoint(sortedPatientData);

        }
      }
    }
    fetchPatient();
    // --------------
    fetchUserDetails();
    return () => {
      isMounted = false;
    };
  }, [admin.admin.id])


  const logOutUser = async (id) => {
    const response = await manageUserLogin({ id: admin.admin.id, manageUserId: id, logoutStatus: true });
    if (response.data.success) {
      fetchUserDetails();
      toast.success(response.data.message)
    }
  }

  const blockUser = async (id) => {
    const response = await manageUserLogin({ id: admin.admin.id, manageUserId: id, blockStatus: true });
    if (response.data.success) {
      fetchUserDetails();
      toast.success(response.data.message)
    }
  }

  const unblockUser = async (id) => {
    const response = await manageUserLogin({ id: admin.admin.id, manageUserId: id, blockStatus: false });
    if (response.data.success) {
      fetchUserDetails();
      toast.success(response.data.message)
    }
  }

  const handleLinkClick = (slug) => {
    const updatedNavlinks = links.map((link) => {

      if (link.slug === slug) {
        return {
          ...link,
          active: true,
        }
      } else {
        return { ...link, active: false };
      }
    });
    setNavlinks(updatedNavlinks);
    setActiveLink(slug)
  };


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const SearchDate = [
    {
      value: formatDate(new Date()),
      label: 'Today'
    },
    {
      value: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
      label: '7 Days Ago'
    },
    {
      value: formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
      label: '30 Days Ago'
    },
  ];

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const currentDate = formatDate(new Date());
    handleChange('', [selectedValue, currentDate]);
  };
  return (
    <>
      <div className="w-full p-2 md:p-5 bg-background overflow-auto">
        <div className="py-4 bg-white font-regular">
          <div className="sm:flex justify-between w-full px-3 space-y-3 sm:space-y-0">
            <div className="font-medium font-regular text-lg">Stats</div>

            <div className="sm:flex gap-2 font-medium space-y-3 sm:space-y-0">
              <SelectBox
                options={SearchDate?.map(date => ({ value: date.value, label: date.label }))}
                className="w-40 text-label-color text-sm h-8"
                labelclass="text-sm"
                title="SearchByDate"
                mainStyle="flex-col"
                name="date"
                onChange={handleSelectChange}
              />
              <Space direction="vertical" size={12} className="pb-3">
                <RangePicker onChange={handleChange} />
              </Space>
            </div>
          </div>

          <div className="flex flex-wrap justify-between mt-2 w-full">

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0 ">
              <div className="">
                <p className="font-normal">Registration</p>
                <span className="text-btn-color text-3xl font-bold">{patientData && patientData?.patient?.length ? patientData?.patient?.length : "0"}</span>
              </div>
              <div className="h-16 bg-gray-300 w-[1px] hidden lg:block"></div>
            </div>

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0">
              <div className="">
                <p className="font-normal">Tests</p>
                <span className="text-green-500 text-3xl font-bold">{testData && testData?.reduce((acc, curr) => acc + curr.testCount, 0)}</span>
              </div>
              <div className="h-16 bg-gray-300 w-[1px] hidden lg:block"></div>
            </div>

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0">
              <div className="">
                <p className="font-normal">Self</p>
                <span className="text-purple-700 text-3xl font-bold"> {referalData && referalData?.reduce((acc, curr) => {
                  if (curr.organization === "Self") {
                    return acc + curr.totalTestPrice;
                  }
                  return acc;
                }, 0)}</span>
              </div>
              <div className="h-16 bg-gray-300 w-[1px] hidden lg:block"></div>
            </div>

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0">
              <div className="">
                <p className="font-normal">Referral</p>
                <span className="text-pink-500 text-3xl font-bold">
                  {referalData && referalData?.reduce((acc, curr) => {
                    if (curr.organization !== "Self") {
                      return acc + curr.totalTestPrice;
                    }
                    return acc;
                  }, 0)}
                </span>
              </div>
              <div className="h-16 bg-gray-300 w-[1px] hidden lg:block"></div>
            </div>

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0">
              <div className="">
                <p className="font-normal">Total Income</p>
                <span className="text-orange-400 text-3xl font-bold">{testData && testData?.reduce((acc, curr) => acc + curr.totalTestPrice, 0)}</span>
              </div>
              <div className="h-16 bg-gray-300 w-[1px] hidden lg:block"></div>
            </div>

            <div className="flex justify-between px-3 w-1/2 md:w-1/3 lg:w-1/6 mb-4 lg:mb-0">
              <div className="">
                <p className="font-normal">Due Amount</p>
                <span className="text-red-600 text-3xl font-bold">
                  {patientData &&
                    patientData?.patient ? patientData?.patient?.map((item) => item.patient).reduce((acc, curr) =>
                      acc + curr.duePayment, 0
                    ) : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-2 md:p-5 bg-background md:flex justify-between gap-3 font-regular">
        <div className="bg-white p-3 w-full  rounded-md ">
          <div className="flex justify-between">
            <div className="font-medium">
              <p className="font-regular text-lg">Top Referrals Monthly</p>
            </div>
          </div>

          <div className="sm:flex justify-start w-full h-96 font-regular">
            <div
              id="donutchart-container"
              className="relative w-full font-bold overflow-hidden rounded-lg"
            >
              <div id="top-referal" className="w-full h-full"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className={`${referalData.length > 0 ? " text-black text-xl text-center" : "hidden"}`} >
                  <p className="font-regular mb-0 font-medium text-sm sm:text-xl">Total</p>
                  <p className="text-md sm:text-2xl">{referalData && referalData?.reduce((acc, curr) => acc + curr.totalTestPrice, 0)}</p>
                </div>
              </div>
            </div>

            <div className="w-full overflow-auto ">
              <Table columns={topReferralColumns} dataSource={referalData} className="font-regular" />
            </div>
          </div>
        </div>

      </div>

      <div className="w-full p-2 lg:p-5 bg-background font-regular ">
        <div className="bg-white p-3 w-full">
          <div className="flex justify-between">
            <div>
              <p className="font-medium font-regular text-sm sm:text-lg">Top 10 Tests (Monthly)</p>
            </div>

          </div>
          <div className="lg:flex justify-between w-full gap-4 h-96">
            <div id="donutchart-container" className="relative w-full font-bold overflow-hidden rounded-lg" >
              <div id="top-test" className="w-full h-full"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className={`${testData.length > 0 ? " text-black text-xl text-center" : "hidden"}`} >
                  <p className="font-medium font-regular mb-0 text-sm sm:text-xl">Total</p>
                  <p className="text-md sm:text-2xl">{testData && testData?.reduce((acc, curr) => acc + curr.totalTestPrice, 0)}</p>
                </div>
              </div>
            </div>
            <div className="w-full overflow-auto">
              <Table columns={topTestColumns} dataSource={testData} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-2 lg:p-5 bg-background font-regular">
        <div className="bg-white p-3">
          <p className="font-semibold py-2 font-regular text-lg">Login Details</p>
          <div className="w-full lg:overflow-hidden overflow-x-scroll">
            <Table columns={loginColumns} dataSource={loginData} className="w-full font-regular" />
          </div>
        </div>
      </div>

      <div className="w-full p-2 lg:p-5 bg-background font-regular">
        <div className='w-full  bg-white'>
          <div className="px-10 py-5">
            <ul className="flex gap-8">
              {links.map((link, index) => (
                <li onClick={() => handleLinkClick(link.slug)} key={index}>
                  <span
                    className={`font-medium ${link.active
                      ? "text-btn-color border-b-2 py-2 border-btn-color"
                      : "text-gray-600"
                      }`}
                  >
                    {link.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className='px-10 py-5 w-full overflow-x-auto text-xs'>
            {/* <CanvasJSChart options={options} /> */}
            {
              activeLink == "income" ?
                dataPoints.length > 0 ? (
                  <LineChart width={1300} height={300} data={dataPoints}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" />
                  </LineChart>) : (<div className='flex justify-center items-center h-full'><p className='text-xl font-medium'>No Data Found</p></div>)
                : ""
            }
            {
              activeLink == "tests" ?
                testDataPoints.length > 0 ? (
                  <LineChart width={1300} height={300} data={testDataPoints}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" />
                  </LineChart>) : (<div className='flex justify-center items-center h-full'><p className='text-xl font-medium'>No Data Found</p></div>)
                : ""
            }
          </div>
          <div className='px-10 py-5 w-full'>
            <p className="font-regular font-medium text-xl">Patient</p>
            <div className="overflow-x-auto text-xs">
              {
                patientDataPoint.length > 0 ? (
                  <LineChart width={1300} height={300} data={patientDataPoint}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" />
                  </LineChart>) : (<div className='flex justify-center items-center h-full'><p className='text-xl font-medium'>No Data Found</p></div>)
              }
            </div>
          </div>

        </div>
      </div >
    </>
  );
}

export default Analysis;