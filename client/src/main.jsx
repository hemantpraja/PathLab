import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
  createRoutesFromElements,
} from "react-router-dom";
import { SignIn, SignUp, Dashboard, Landing, GetOtp } from "./pages";

import {
  Analysis,
  FinanceAnalysis,
  Inventory,
  LabManagement,
  PatientList,
  PatientRegistration,
  Report,
  Outsource,
  Packages,
  TestList,
  Tests,
  Center,
  ManageUsers,
  OrganizationList,
  CurrentStock,
  PurchaseOrder,
  AnalyticsDashboard,
  LabProfile,
  AddTest,
  DoctorReport,
  PatientDetails
} from "./components/index.js";

// import { ThemeProvider } from "@material-tailwind/react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '0px',
          paddingLeft:"0px",
        },
      },
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Landing />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="otp" element={<GetOtp />} />

      <Route path="dashboard" element={<Dashboard />}>
        <Route path="" element={<PatientRegistration />} />
        <Route path="home" element={<PatientRegistration />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="patientlist">
          <Route path="" element={<PatientList />}/>
          <Route path="patientdetails" element={<PatientDetails />} />
        </Route>
        <Route path="report" element={<Report />} />
        <Route path="financeanalysis" element={<FinanceAnalysis />} />
        <Route path="profile" element={<LabProfile />} />

        <Route path="test" element={<Tests />}>
          <Route path="list">
            <Route path="" element={<TestList />} />
            <Route path="addtest" element={<AddTest />} />
          </Route>
          <Route path="outsource" element={<Outsource />} />
          <Route path="packages" element={<Packages />} />
        </Route>

        <Route path="lab" element={<LabManagement />}>
          <Route path="center" element={<Center />} />
          <Route path="manageusers" element={<ManageUsers />} />
          <Route path="organizations" element={<OrganizationList />} />
        </Route>

        <Route path="inventory" element={<Inventory />}>
          <Route path="stock" element={<CurrentStock />} />
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          <Route path="purchaseorder" element={<PurchaseOrder />} />
        </Route>

        <Route path="doctor_report" element={<DoctorReport />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme} >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </ThemeProvider>

);
