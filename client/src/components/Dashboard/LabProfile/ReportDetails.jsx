import React, { useState, useEffect } from 'react'
import { ButtonComponent, InputField } from '../..'
import { GoUpload } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLabReportDetailsMutation, useDeleteLabReportDetailsMutation } from '../../../redux/services/labApi.service.js';
import { useGetAdminDetailsMutation } from "../../../redux/services/authApi.service.js";
import toast from "react-hot-toast";

const ReportDetails = () => {
    const { register, handleSubmit, watch, setValue } = useForm();
    const admin = useSelector((state) => state.admin);
    const [labReportDetails] = useLabReportDetailsMutation();
    const [deleteLabReportDetails] = useDeleteLabReportDetailsMutation();
    const [getAdminDetails] = useGetAdminDetailsMutation();
    const [reportData, setReportData] = useState({});
    const [previews, setPreviews] = useState({
        reportheader: '',
        reportfooter: ''
    });
    const [isLoading, setIsLoading] = useState(false)
    const fetchAdminDetails = async () => {
        try {
            const response = await getAdminDetails({ email: admin.admin.email });

            setReportData(response.data.data);
        } catch (error) {
        }
    };

    const deleteReportDetails = async (data) => {
        try {

            if (data.reportfooter) {
                const response = await deleteLabReportDetails({ id: admin.admin.id, reportfooter: '' });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchAdminDetails();
                }
            } else if (data.reportheader) {
                const response = await deleteLabReportDetails({ id: admin.admin.id, reportheader: '' });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchAdminDetails();
                }
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchAdminDetails();
    }, [admin.admin.id]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const targetName = event.target.name;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setPreviews((prevPreviews) => ({
                    ...prevPreviews,
                    [targetName]: result
                }));
            };
            reader.readAsDataURL(file);
            setValue(targetName, [file]);
        }
    };

    const submitReportData = async (data) => {

        const formData = new FormData();
        formData.append('id', admin.admin.id);
        const reportheader = data.reportheader;
        const reportfooter = data.reportfooter;
        setIsLoading(true)
        if (reportheader && reportheader.length > 0) {
            formData.append("reportheader", reportheader[0]);
        }

        if (reportfooter && reportfooter.length > 0) {
            formData.append("reportfooter", reportfooter[0]);
        }

        const response = await labReportDetails(formData);
        if (response.data.success) {
            toast.success(response.data.message);
            fetchAdminDetails();
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    return (
        <div className="bg-background h-full">
            <form onSubmit={handleSubmit(submitReportData)} encType="multipart/form-data">
                <div className="px-2 md:px-6">
                    <div className="md:flex w-full justify-between gap-4 ">
                        <div className="p-2 md:p-5 xl:pe-24 bg-white border border-gray-300 rounded w-full ">
                            <div className="xl:w-2/3 lg:flex justify-center items-center gap-5 space-y-4 lg:space-y-0">
                                <div className="w-full">
                                    <p className='px-2'>Report Header</p>
                                    <InputField
                                        type="file"
                                        label={<><GoUpload />Click To Upload</>}
                                        id="reportheader"
                                        mainstyle={`border px-2 flex justify-center items-center w-[55%] py-1`}
                                        labelclass={`text-sm font-normal w-full flex items-center gap-2`}
                                        outerClass="border-none hidden"
                                        name="reportheader"
                                        accept="image/png, image/jpg, image/jpeg"
                                        {...register('reportheader')}
                                        onChange={handleFileChange}
                                    />
                                    <div className='p-3 border flex justify-between items-center mt-2'>
                                        <div>
                                            <img
                                                src={reportData?.reportheader ? reportData?.reportheader : previews?.reportheader ? previews?.reportheader : "https://imgs.search.brave.com/CRUSpuc4u8POMix8N7oOL-mlg3RT09aglntDK_GL_Mk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzM3LzU3Lzgx/LzM2MF9GXzEzNzU3/ODEwM191bEs5TWJE/OUlmS0FDeDlSWmU2/Ung3UEF5QkE5YU4y/Sy5qcGc"}
                                                className="w-20 h-auto"
                                                alt="Report Header Preview"
                                            />
                                        </div>
                                        <div>
                                            <span className='text-btn-color'>Report Header</span>
                                        </div>
                                        <div onClick={() => { deleteReportDetails({ reportheader: reportData?.reportheader }) }}>
                                            <ButtonComponent type="button" title={<><AiOutlineDelete /></>} className="bg-transparent hover:bg-gray-50 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <p className='px-2'>Report Footer</p>
                                    <InputField
                                        type="file"
                                        label={<><GoUpload />Click To Upload</>}
                                        id="reportfooter"
                                        mainstyle={`border px-2 flex justify-center items-center w-[55%] py-1`}
                                        labelclass={`text-sm font-normal w-full flex items-center gap-2`}
                                        outerClass="border-none hidden"
                                        name="reportfooter"
                                        accept="image/png, image/jpg, image/jpeg"
                                        {...register("reportfooter")}
                                        onChange={handleFileChange}
                                    />
                                    <div className='p-3 border flex justify-between items-center mt-2'>
                                        <div>
                                            <img
                                                src={reportData?.reportfooter ? reportData?.reportfooter : previews?.reportfooter ? previews?.reportfooter : "https://imgs.search.brave.com/CRUSpuc4u8POMix8N7oOL-mlg3RT09aglntDK_GL_Mk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzM3LzU3Lzgx/LzM2MF9GXzEzNzU3/ODEwM191bEs5TWJE/OUlmS0FDeDlSWmU2/Ung3UEF5QkE5YU4y/Sy5qcGc"}
                                                className="w-20 h-auto"
                                                alt="Report Footer Preview"
                                            />
                                        </div>
                                        <div>
                                            <span className='text-btn-color'>Report Footer</span>
                                        </div>
                                        <div onClick={() => { deleteReportDetails({ reportfooter: reportData?.reportfooter }) }}>
                                            <ButtonComponent type="button" title={<><AiOutlineDelete /></>} className="bg-transparent hover:bg-gray-50 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            </form>
        </div>
    )
}

export default ReportDetails;
