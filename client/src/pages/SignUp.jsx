import cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonComponent, InputField } from '../components';
import { useAdminSignupMutation } from '../redux/services/authApi.service.js';
import { useAddDefaultTestListMutation, useAddDefaultTestMethodMutation, useAddDefaultTestOptionMutation } from '../redux/services/labApi.service.js';

function SignUp() {

  const navigate = useNavigate();
  const [adminSignup] = useAdminSignupMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const token = cookies.get("admin");
  const [addDefaultTestList] = useAddDefaultTestListMutation();
  const [addDefaultTestMethod] = useAddDefaultTestMethodMutation();
  const [addDefaultTestOption] = useAddDefaultTestOptionMutation();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, []);


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await adminSignup(data);
      setMessage(response.data.message);
      if (response.data.success) {
        const responseTestList = await addDefaultTestList({ id: response.data.data.id });
        const responseTestMethod = await addDefaultTestMethod({ id: response.data.data.id });
        const responseTestOption = await addDefaultTestOption({ id: response.data.data.id });
        if (responseTestList.data.success && responseTestMethod.data.success && responseTestOption.data.success) {
          toast.success(response.data.message);
          navigate('/otp', { state: { adminEmail: response.data.data.email } });
        }
      }
      else {
        setIsLoading(false)
        toast.error(response.data.message)
      }
    } catch (error) {
      setMessage(error?.message);
      toast.error(error?.message);
    }
  }

  return (

    <div className="w-full flex justify-center items-center h-screen bg-signup-background">
      <div className='p-10 lg:w-1/4 shadow-2xl bg-white'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <p className='text-center text-4xl font-bold font-serif'>PathLabs</p>
          <div>
            <InputField
              type="text"
              placeholder="Lab Name"
              label="Lab Name"
              isSearch={false}
              className="w-full py-2 text-sm placeholder:text-sm"
              labelclass="text-sm font-normal text-gray-700"
              {...register("labName", { required: "Lab Name is required" })}
            // error={errors.labName?.message}
            />
            {errors.labName && <p className="text-red-600">{errors.labName.message}</p>}
          </div>

          {/* Owner Name Field */}
          <div>
            <InputField
              type="text"
              placeholder="Owner Name"
              label="Owner Name"
              isSearch={false}
              className="w-full py-2 text-sm placeholder:text-sm"
              labelclass="text-sm font-normal text-gray-700"
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z]+((['-][A-Za-z])?[A-Za-z]*)*( [A-Za-z]+((['-][A-Za-z])?[A-Za-z]*)*)*$/,
                  message: "Name must be a valid name"
                }
              })}
              error={errors.name?.message}
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <InputField
              type="email"
              placeholder="Email"
              label="Email"
              isSearch={false}
              className="w-full py-2 text-sm placeholder:text-sm"
              labelclass="text-sm font-normal text-gray-700"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                }
              })}
              error={errors.email?.message}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <InputField
              type="text"
              placeholder="Contact"
              label="Contact"
              isSearch={false}
              className="w-full py-2 text-sm placeholder:text-sm"
              labelclass="text-sm font-normal text-gray-700"
              {...register("phone", {
                required: "Phone number is required",
                validate: {
                  matchPattern: (value) =>
                    /^[6-9]\d{9}$/.test(value) || "Phone number must be a valid number"
                }
              })}
              error={errors.phone?.message}
            />
            {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
          </div>
          <br />

          {
            isLoading == false ?
              <ButtonComponent title="Get OTP" className="w-full text-white font-bold py-2 mt-8 hover:bg-blue-600 text-sm" />
              : <div role="status" className='flex justify-center py-4'>
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
          }

          <p className='text-center font-medium py-4 text-sm text-gray-800'>Already have an account? <span className='text-btn-color font-bold hover:text-blue-700'><Link to="/signin">Log In</Link></span></p>
          <p className='text-[12px] text-center text-sm text-gray-800 font-medium'>By signing up, you agree to our <span className='text-btn-color'>Terms & <br />Condition</span> and <span className='text-btn-color'>Privacy Policy.</span></p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
