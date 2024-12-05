import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonComponent, InputField } from "../components";
import { setAdmin } from "../redux/reducer/adminSlice.js";
import { useResendOTPMutation, useVerifyEmailMutation } from "../redux/services/authApi.service.js";

const GetOtp = () => {

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOTP] = useResendOTPMutation();
  const location = useLocation();
  const email = location.state;
  const token = Cookies.get("admin");
  const [resendOtpId, setResendOtpId] = useState("");
  const [resendOtpVisible, setResendOtpVisible] = useState(false);
  const [timer, setTimer] = useState(120); // Initialize timer to 2 minutes (120 seconds)

  useEffect(() => {

    if (token) {
      navigate('/');
    } else if (!email.adminEmail) {
      navigate('/');
    }
    if (!resendOtpVisible) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setResendOtpVisible(true);
            return 120; // Reset timer for the next countdown
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendOtpVisible, email.adminEmail,]);

  const onSubmit = async (otp1) => {
    try {
      if (email.userEmail && email.userId) {
        if (resendOtpId) {
          email.otpId = resendOtpId;
        }
        const response = await verifyEmail({ email: email.adminEmail, userEmail: email.userEmail, userId: email.userId, otp: otp1.otp, otpId: email.otpId });
        if (response.data.success) {
          Cookies.set('admin', response.data.token);
          const result = dispatch(setAdmin({
            email: email.adminEmail, userEmail: response.data?.data?.email, userId: response.data?.data?._id,
            role: response.data?.data?.role ? response.data?.data?.role : ""
          }));
          if (result) {
            toast.success(response.data.message)
            navigate('/dashboard')
          }
        }
        else {
          toast.error(response.data.message)
        }
      }

      else {

        if (resendOtpId) {
          email.otpId = resendOtpId;
        }
        const response = await verifyEmail({ email: email.adminEmail, otp: otp1.otp, otpId: email.otpId });
        if (response.data.success) {
          Cookies.set('admin', response.data.token);
          dispatch(setAdmin({}))
          const result = dispatch(setAdmin({ id: response.data.data._id, email: response.data.data.email, }));
          if (result) {
            toast.success(response.data.message)
            navigate('/dashboard')
          }
        }
        else {
          toast.error(response.data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const resendOtp = async () => {
    try {
      const response = await resendOTP({ email });

      if (response.data.success) {
        toast.success(response.data.message);
        setResendOtpId(response.data.data.otpId);
        setResendOtpVisible(false);
        setTimer(120); // Reset the timer
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full flex justify-center items-center h-screen bg-signup-background ">
      <div className="p-8 lg:w-1/4 shadow-2xl bg-white">
        <p className="text-center text-2xl font-bold font-sans">Get OTP</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type="text"
            placeholder="Enter otp"
            label="Enter OTP"
            isSearch={false}
            className="w-full py-2 "
            {...register("otp", { required: true })}
          /> <br />

          <ButtonComponent
            title="Submit"
            className="w-full text-white font-bold py-2 hover:bg-blue-600 "
          />
          {
            resendOtpVisible
              ? <p className="text-center text-btn-color hover:text-blue-600 py-2 cursor-pointer font-semibold" onClick={resendOtp}>Resend OTP</p>
              : <p className="text-center py-2 font-semibold">{`Resend OTP in ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</p>
          }
        </form>
      </div>
    </div>
  );
}

export default GetOtp;
