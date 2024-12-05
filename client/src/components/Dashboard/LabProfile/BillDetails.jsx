import React, { useEffect, useState } from 'react'
import { ButtonComponent, InputField } from '../..'
import { GoUpload } from 'react-icons/go'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaPlus } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLabBillDetailsMutation, useDeleteLabReportDetailsMutation } from '../../../redux/services/labApi.service.js';
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service.js";
import toast from "react-hot-toast";

const BillDetails = () => {
  const [addSignatureStatus, setAddSignatureStatus] = React.useState(false)
  const { register, handleSubmit, setValue } = useForm();
  const [getAdminDetails] = useGetAdminDetailsMutation();
  const [deleteLabReportDetails] = useDeleteLabReportDetailsMutation();
  const admin = useSelector((state) => state.admin);
  const [labBillDetails] = useLabBillDetailsMutation();
  const [reportData, setReportData] = useState({})
  const [previews, setPreviews] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const fetchAdminDetails = async () => {
    try {
      const response = await getAdminDetails({ email: admin.admin.email });

      setReportData(response.data.data)
      Object.keys(response.data.data).forEach((key) => {
        setValue(key, response.data.data[key]);
      });
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [admin.admin.id]);

  const deleteReportDetails = async (data) => {
    try {
      // Access the nested value object

      if (data.signature) {
        const response = await deleteLabReportDetails({ id: admin.admin.id, signature: '' });
        if (response.data.success) {

          toast.success(response.data.message)
          fetchAdminDetails();
        }
      }

    } catch (error) {
    }
  };

  const submitBillDetails = async (data) => {

    const formData = new FormData();
    formData.append('id', admin.admin.id);
    formData.append('billheading', data.billheading);
    formData.append('billSignatureName', data.billSignatureName);
    formData.append('gstnumber', data.gstnumber);
    setIsLoading(true)
    if (data.signature && data.signature.length > 0) {
      formData.append("signature", data.signature[0]);
    }
    const response = await labBillDetails(formData)
    if (response.data.success) {
      toast.success(response.data.message)
      fetchAdminDetails();
      setIsLoading(false)
    } setIsLoading(false)


  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const targetName = event.target.name;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {

        setPreviews(reader.result);
      };
      reader.readAsDataURL(file);
      setValue(targetName, [file]);
    }
  };

  const setShowGstNumber = async (data) => {

    const response = await labBillDetails({ id: admin.admin.id, isGstNumber: data })
    if (response.data.success) {
      toast.success(response.data.message)
      fetchAdminDetails();

    }
  }

  return (
    <div className="bg-background h-full">

      <form onSubmit={handleSubmit(submitBillDetails)} encType="multipart/form-data">
        <div className="px-2 md:px-6">
          <div className="md:flex w-full justify-between gap-4 ">
            <div className="p-2 md:p-5 lg:pe-24 bg-white border border-gray-300 rounded w-full space-y-5">
              {/* Row 1 */}
              <div className="w-64">
                <InputField
                  placeholder="Enter Bill heading"
                  name="billheading"
                  labelclass="text-sm font-normal"
                  label="Bill Heading"
                  className="text-sm placeholder:text-sm"
                  isSearch={false}
                  defaultValue={reportData?.billheading || ""}
                  {...register('billheading')}
                />
              </div>
              <div className="w-64">
                <InputField
                  placeholder="Enter GST Number"
                  name="gstnumber"
                  labelclass="text-sm font-normal"
                  label="GST Number"
                  className="text-sm placeholder:text-sm"
                  defaultValue={reportData?.gstnumber || ""}
                  isSearch={false}
                  {...register('gstnumber')}

                />
              </div>
              <div className="inline-flex  items-center" key={1}>
                <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
                  <input
                    onChange={(e) => setShowGstNumber(e.target.checked)}
                    id={"bill"}
                    type="checkbox"
                    className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-100 checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                    checked={reportData?.isGstNumber ? true : false}
                  />
                  <label
                    htmlFor={`bill`}
                    className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                  >
                    <div
                      className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                      data-ripple-dark="true"
                    ></div>
                  </label>
                </div>
                <p className='my-auto px-5 text-sm font-normal text-gray-700'>Show GST Details in Bill</p>
              </div>
              <div className='w-40'>
                <ButtonComponent type="button" title={<><FaPlus />Add Signature</>} className="mt-3 bg-btn-color text-white text-sm font-normal flex gap-1 justify-center items-center h-8 py-0  hover:bg-blue-500 hover:outline-none hover:ring-1 hover:ring-blue-500" onClick={() => { setAddSignatureStatus(!addSignatureStatus) }} />
              </div>
              {/* Add signature */}
              {
                addSignatureStatus && addSignatureStatus == true ?

                  <div className='flex gap-4'>
                    <div className="w-full">
                      <InputField
                        placeholder="Enter Name"
                        name="billSignatureName"
                        labelclass="text-sm font-normal"
                        label="Name"
                        className="text-sm placeholder:text-sm"
                        isSearch={false}
                        defaultValue={reportData?.billSignatureName || ""}
                        {...register('billSignatureName')}
                      />
                    </div>

                    <div className="w-full">
                      <p className='px-2 mb-1 text-sm font-normal text-gray-700'>Signature</p>
                      <InputField
                        type="file"
                        label={<><GoUpload />Click To Upload</>}
                        id="signature"
                        mainstyle={`border px-2 flex justify-center items-center w-[55%] py-1`}
                        labelclass={`text-sm  font-normal w-full flex items-center gap-2`}
                        outerClass="border-none hidden "
                        name="signature"
                        isSearch={false}
                        {...register('signature')}
                        onChange={handleFileChange}
                      />
                      <div className='p-3 border flex justify-between items-center mt-2'>
                        <div>
                          <img
                            src={reportData?.signature ? reportData?.signature : previews ? previews : "https://imgs.search.brave.com/CRUSpuc4u8POMix8N7oOL-mlg3RT09aglntDK_GL_Mk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzM3LzU3Lzgx/LzM2MF9GXzEzNzU3/ODEwM191bEs5TWJE/OUlmS0FDeDlSWmU2/Ung3UEF5QkE5YU4y/Sy5qcGc"}
                            className="w-20 h-auto"
                            alt="" />
                        </div>
                        <div>
                          <span className='text-btn-color'>Report Footer</span>
                        </div>
                        <div onClick={() => {
                          deleteReportDetails(reportData && {
                            signature: reportData?.signature
                          })
                        }} >
                          <ButtonComponent type="button" title={<><AiOutlineDelete /></>} className="bg-transparent hover:bg-gray-50 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex items-end' onClick={() => {
                      deleteReportDetails(reportData && {
                        signature: reportData?.signature
                      })
                    }}>
                      <ButtonComponent type="button" title="Remove Signature" className="mt-3 bg-transparent border border-btn-color text-btn-color text-sm font-normal flex items-center h-8 py-0  hover:border-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" />
                    </div>
                  </div>
                  : ""
              }

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
            }   </div>
        </div>
      </form>
    </div>
  )
}

export default BillDetails