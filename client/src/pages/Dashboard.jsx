// Dashboard.js
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SideNavbar, TopNavbar } from "../components";
import { useDispatch } from "react-redux";
import { useVerifyTokenMutation } from "../redux/services/authApi.service";
import cookies from "js-cookie"
import { setAdmin, removeAdmin } from "../redux/reducer/adminSlice.js";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifyToken] = useVerifyTokenMutation();
  const [admin, setNewAdmin] = useState({})
  const token = cookies.get("admin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken(token)
        .then((response) => {
          if (response.data.success) {
            const adminData = { id: response.data.data._id, email: response.data.data.email, manageUser: response?.data?.data?.manageUser };
            dispatch(setAdmin(adminData));
            setNewAdmin(adminData);
            setLoading(true)
          } else {
            cookies.remove("admin");
            dispatch(removeAdmin());
            navigate('/');
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      dispatch(removeAdmin());
      navigate('/');
    }
  }, []);

  return (
    <>
      {!loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          {token && admin && (
            <div className=" w-full lg:flex">
              <div className="sticky top-0 z-50 lg:h-screen ">
                <SideNavbar />
              </div>
              <div className="lg:w-[83.6%] bg-background">
                <div className="sticky top-[4.6vh] lg:top-0 z-30 shadow-md ">
                  <TopNavbar className="" />
                </div>
                <div className="">
                <Outlet />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

}

export default Dashboard;
