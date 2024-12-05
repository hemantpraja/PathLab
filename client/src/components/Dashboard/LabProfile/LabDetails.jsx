import React, { useEffect, useState } from "react";
import { contact } from "../../../constants/constants";
import { InputField, SelectBox, ButtonComponent } from "../../index.js";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service.js";
import { useUpdateAdminProfileMutation } from "../../../redux/services/authApi.service.js";
import toast from "react-hot-toast";
const LabDetails = () => {
  
  const admin = useSelector((state) => state.admin);
  const [getAdminDetails] = useGetAdminDetailsMutation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [updateAdminProfile] = useUpdateAdminProfileMutation();

  const fetchAdminDetails = async () => {
    try {
      const response = await getAdminDetails({ email: admin.admin.email });
      const { labName, name, phone, email, city, website, address } = response.data.data;
      setFormData({ labName, name, phone, email, city, website, address });
      Object.keys(response.data.data).forEach((key) => {
        setValue(key, response.data.data[key]);
      });
    } catch (error) {
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await updateAdminProfile(data);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <div className="bg-background h-full">
      <div className="px-2 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex w-full justify-between gap-4">
            <div className="p-5 sm:p-2 md:p-5 lg:pe-24 bg-white border border-gray-300 rounded w-full">
              {/* Row 1 */}
              <div className="w-full space-y-3 sm:space-y-0 sm:flex justify-center items-center gap-5">
                <div className="w-full">
                  <InputField
                    type="text"
                    label={<><span className="text-red-500">*</span> Lab Name</>}
                    placeholder="Name"
                    isSearch={false}
                    labelclass="text-sm"
                    className="placeholder:text-sm text-sm"
                    defaultValue={formData?.labName || ""}
                    {...register("labName", {
                      required: "lab name is required",
                    })}
                  />
                  {errors.labName && <p className="text-red-500">{errors.labName.message}</p>}
                </div>

                <div className="w-full">
                  <InputField
                    type="text"
                    label={<><span className="text-red-500">*</span> Owner Name</>}
                    placeholder="Name"
                    isSearch={false}
                    labelclass="text-sm"
                    className="placeholder:text-sm text-sm"
                    defaultValue={formData.name}
                    {...register("name", {
                      required: "Owner name is required",
                      pattern: {
                        value: /^[A-Za-z]+((['-][A-Za-z])?[A-Za-z]*)*( [A-Za-z]+((['-][A-Za-z])?[A-Za-z]*)*)*$/,
                        message: "Name must be a valid name"
                      }
                    })}
                  />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div className="w-full flex items-end ">
                  <div>
                    <SelectBox options={contact} mainStyle="flex-col" labelclass="text-sm" className="md:border-r-0 sm:w-16 md:w-24 h-8 text-sm placeholder:text-sm" label={<div className="flex"><span className="text-red-500">*</span> Contact</div>} />
                  </div>
                  <div className="w-full flex justify-start">
                    <InputField
                      type="number"
                      placeholder="contact"
                      isSearch={false}
                      defaultValue={formData?.phone || ""}
                      className="text-sm"
                      {...register("phone", {
                        required: "Contact is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Contact must be a valid contact"
                        }
                      })}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="w-full space-y-3 sm:space-y-0 sm:flex justify-center items-center gap-5 py-8 ">
                <div className="w-full">
                  <InputField
                    type="email"
                    label="Email"
                    placeholder="Email"
                    disabled
                    labelclass="text-sm"
                    className="placeholder:text-sm text-sm"
                    isSearch={false}
                    defaultValue={formData.email}
                    {...register("email", {
                      required: "Email is required",
                      validate: {
                        matchPattern: (value) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className="w-full">
                  <InputField
                    type="text"
                    label="City"
                    placeholder="City"
                    isSearch={false}
                    labelclass="text-sm"
                    className="placeholder:text-sm text-sm"
                    defaultValue={formData.city}
                    {...register("city")}
                  />
                </div>
                <div className="w-full ">
                  <InputField
                    type="text"
                    label="Website"
                    placeholder="website"
                    isSearch={false}
                    labelclass="text-sm"
                    className="placeholder:text-sm text-sm"
                    defaultValue={formData.website}
                    {...register("website")}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="w-full lg:w-1/2 ">
                <label className="text-black text-sm" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="5"
                  cols="50"
                  placeholder=""
                  className="border px-3 py-1 text-sm outline-none focus:bg-gray-50 duration-200 border-r border-gray-300 bg-gray-50 w-full"
                  defaultValue={formData.address}
                  {...register("address")}
                ></textarea>
              </div>
            </div>

            <div className="sm:w-48 md:fixed right-0 bottom-0 px-2 py-2">
              <ButtonComponent type="button" title="Preview Bill" className="mt-3 bg-transparent border text-btn-color border-btn-color py-0 h-8 text-sm flex items-center justify-center  hover:bg-border-500 hover:outline-none hover:ring-1 hover:ring-blue-500" />
              <ButtonComponent type="button" title="Preview Report" className="mt-3 bg-transparent border text-btn-color border-btn-color py-0 h-8 text-sm flex items-center justify-center  hover:bg-border-500 hover:outline-none hover:ring-1 hover:ring-blue-500" />
              {
                isLoading == false ?
                  <ButtonComponent type="submit" title="Save" className="mt-3 bg-btn-color text-white py-0 h-8 text-sm flex items-center justify-center  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" />
                  : <div role="status" className='flex justify-center py-4'>
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LabDetails;
